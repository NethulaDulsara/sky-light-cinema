const express = require('express');
const crypto = require('crypto');
const auth = require('../middlewares/auth');
const Reservation = require('../models/reservation');
const Cinema = require('../models/cinema');
const Showtime = require('../models/showtime');
const Settings = require('../models/settings');
const SeatLock = require('../models/seatLock');
const userModeling = require('../utils/userModeling');
const generateQR = require('../utils/generateQRCode');
const { calculatePrice } = require('../utils/pricing');
const { isRefundEligible } = require('../utils/refund');
const { seatKey, findSeatConflict } = require('../utils/seats');
const {
  PAYHERE_MERCHANT_ID,
  PAYHERE_SECRET,
  CLIENT_URL,
  SEAT_HOLD_MINUTES,
  POS_HOLD_MINUTES,
} = require('../config');

const router = new express.Router();

// Collect seats that are unavailable for a showtime (paid, or pending with an
// unexpired hold), optionally excluding one reservation (e.g. when re-checking
// the reservation being created). Returns a Set of "row-col" keys.
const getTakenSeatKeys = async (showtimeId, excludeId) => {
  const now = new Date();
  const query = {
    showtimeId,
    $or: [
      { paymentStatus: 'paid' },
      { paymentStatus: 'pending', holdExpiresAt: { $gt: now } },
    ],
  };
  if (excludeId) query._id = { $ne: excludeId };
  const reservations = await Reservation.find(query).select('seats');
  const keys = new Set();
  reservations.forEach(r =>
    (Array.isArray(r.seats) ? r.seats : []).forEach(s => keys.add(seatKey(s)))
  );
  return keys;
};

// Atomic seat claim shared by the online and counter (POS) flows. Inserts one
// SeatLock per seat tagged `res:<reservationId>`; the unique index on
// {showtimeId, seat} means two simultaneous bookings for the same seat cannot
// both succeed — exactly one insert wins, the other gets a duplicate-key error.
// This is the hard double-booking guard. Returns true on success, false if a
// concurrent booking claimed one of the seats first.
const claimSeats = async ({ showtimeId, seats, reservationId, expiresAt, sessionId }) => {
  if (!showtimeId) return true;
  const seatKeys = seats.map(seatKey);
  const now = new Date();
  // Clear expired holds and this browser session's own holds on these seats so
  // they don't block our own claim.
  const clearOr = [{ expiresAt: { $lte: now } }];
  if (sessionId) clearOr.push({ sessionId });
  await SeatLock.deleteMany({ showtimeId, seat: { $in: seatKeys }, $or: clearOr });

  try {
    await SeatLock.insertMany(
      seatKeys.map(seat => ({
        showtimeId,
        seat,
        sessionId: `res:${reservationId}`,
        expiresAt,
      })),
      { ordered: true }
    );
    return true;
  } catch (e) {
    // A concurrent booking claimed one of these seats first.
    await SeatLock.deleteMany({ sessionId: `res:${reservationId}` });
    return false;
  }
};

// True if any requested seat has been frozen by an admin (hall-level or
// per-showtime), so it must not be bookable through any channel.
const hitsFrozenSeat = async ({ cinemaId, showtimeId, seats }) => {
  const [cin, show] = await Promise.all([
    cinemaId ? Cinema.findById(cinemaId).select('frozenSeats') : null,
    showtimeId ? Showtime.findById(showtimeId).select('frozenSeats') : null,
  ]);
  const frozen = new Set([
    ...((cin && cin.frozenSeats) || []),
    ...((show && show.frozenSeats) || []),
  ]);
  if (!frozen.size) return false;
  return seats.some(s => frozen.has(seatKey(s)));
};

// Build an authoritative price quote for a set of seats at a showtime.
const quoteFor = async ({ cinemaId, seatCount, format, date, startAt }) => {
  const [cinema, settings] = await Promise.all([
    Cinema.findById(cinemaId),
    Settings.getSingleton(),
  ]);
  if (!cinema) throw new Error('Cinema not found');
  return calculatePrice(
    {
      basePrice: cinema.ticketPrice,
      seatCount,
      format: format || '2D',
      date,
      startAt,
    },
    settings
  );
};

// --- Price quote (no reservation created) -------------------------------------
router.post('/reservations/quote', async (req, res) => {
  try {
    const { cinemaId, seatCount, format, date, startAt } = req.body;
    const price = await quoteFor({ cinemaId, seatCount, format, date, startAt });
    res.send(price);
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

// --- Create a reservation (pending, with a seat hold) -------------------------
router.post('/reservations', async (req, res) => {
  try {
    const { showtimeId, cinemaId, seats = [], format, date, startAt, sessionId } = req.body;

    if (!Array.isArray(seats) || seats.length === 0) {
      return res.status(400).send({ error: 'No seats selected.' });
    }

    // Reject any seat an admin has frozen (hall-level + per-showtime).
    if (await hitsFrozenSeat({ cinemaId, showtimeId, seats })) {
      return res
        .status(409)
        .send({ error: 'One or more selected seats are unavailable. Please pick again.' });
    }

    // Friendly pre-check: reject if any requested seat is already reserved.
    if (showtimeId) {
      const taken = await getTakenSeatKeys(showtimeId);
      const clash = findSeatConflict(taken, seats);
      if (clash) {
        return res
          .status(409)
          .send({ error: 'One or more selected seats were just taken. Please pick again.' });
      }
    }

    // Authoritative server-side pricing (ignore any client-supplied amounts).
    const price = await quoteFor({
      cinemaId,
      seatCount: seats.length,
      format,
      date,
      startAt,
    });

    const holdExpiresAt = new Date(Date.now() + SEAT_HOLD_MINUTES * 60 * 1000);

    const reservation = new Reservation({
      date,
      startAt,
      seats,
      format: format || '2D',
      movieId: req.body.movieId,
      cinemaId,
      showtimeId,
      ticketPrice: price.perSeat,
      subtotal: price.subtotal,
      convenienceFee: price.convenienceFee,
      vat: price.vat,
      total: price.total,
      userId: req.body.userId || undefined,
      username: req.body.username || 'Guest',
      email: req.body.email,
      phone: req.body.phone || '0000000000',
      paymentStatus: 'pending',
      holdExpiresAt,
    });

    // Atomic seat claim — the hard double-booking guard (see claimSeats).
    if (showtimeId) {
      const claimed = await claimSeats({
        showtimeId,
        seats,
        reservationId: reservation._id,
        expiresAt: holdExpiresAt,
        sessionId,
      });
      if (!claimed) {
        return res
          .status(409)
          .send({ error: 'One or more selected seats were just taken. Please pick again.' });
      }
    }

    try {
      await reservation.save();
    } catch (e) {
      await SeatLock.deleteMany({ sessionId: `res:${reservation._id}` });
      throw e;
    }

    const QRCode = await generateQR(`${CLIENT_URL}/#/checkin/${reservation._id}`);
    res.status(201).send({ reservation, QRCode });
  } catch (e) {
    res.status(400).send({ error: e.message || 'Could not create reservation.' });
  }
});

// --- PayHere: generate secure hash using the SERVER-computed total ------------
router.post('/reservations/payhere/hash', async (req, res) => {
  try {
    const { order_id } = req.body;
    const reservation = await Reservation.findById(order_id);
    if (!reservation) return res.status(404).send({ error: 'Reservation not found' });

    const currency = 'LKR';
    const amountFormatted = Number(reservation.total).toFixed(2);
    const hashedSecret = crypto
      .createHash('md5')
      .update(PAYHERE_SECRET)
      .digest('hex')
      .toUpperCase();
    const hash = crypto
      .createHash('md5')
      .update(PAYHERE_MERCHANT_ID + order_id + amountFormatted + currency + hashedSecret)
      .digest('hex')
      .toUpperCase();

    res.send({ hash, merchant_id: PAYHERE_MERCHANT_ID, amount: amountFormatted, currency });
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

// Mark a reservation paid exactly once: confirm seats + decrement availability.
const confirmPaid = async (reservation, paymentId) => {
  if (reservation.paymentStatus === 'paid') return reservation;
  reservation.paymentStatus = 'paid';
  reservation.holdExpiresAt = undefined;
  if (paymentId) reservation.paymentId = paymentId;
  await reservation.save();

  // Decrement cinema availability and clear any seat holds for these seats.
  const cinema = await Cinema.findById(reservation.cinemaId);
  if (cinema && typeof cinema.seatsAvailable === 'number') {
    cinema.seatsAvailable = Math.max(0, cinema.seatsAvailable - reservation.seats.length);
    await cinema.save();
  }
  // Keep the seat claim alive (it now represents a confirmed booking) by pushing
  // its expiry far into the future, instead of releasing it.
  if (reservation.showtimeId) {
    const far = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
    await SeatLock.updateMany(
      { sessionId: `res:${reservation._id}` },
      { $set: { expiresAt: far } }
    );
  }
  return reservation;
};

// --- PayHere: server-to-server notify webhook --------------------------------
router.post('/reservations/payhere/notify', async (req, res) => {
  const { merchant_id, order_id, payhere_amount, payhere_currency, status_code, md5sig } = req.body;
  try {
    const hashedSecret = crypto
      .createHash('md5')
      .update(PAYHERE_SECRET)
      .digest('hex')
      .toUpperCase();
    const localSig = crypto
      .createHash('md5')
      .update(
        merchant_id + order_id + payhere_amount + payhere_currency + status_code + hashedSecret
      )
      .digest('hex')
      .toUpperCase();

    if (localSig !== md5sig) return res.status(400).send('Invalid signature');

    const reservation = await Reservation.findById(order_id);
    if (!reservation) return res.status(404).send();

    // PayHere status codes: 2 paid, 0 pending, -1 cancelled, -2 failed, -3 chargedback
    switch (String(status_code)) {
      case '2':
        await confirmPaid(reservation, req.body.payment_id);
        break;
      case '-1':
        reservation.paymentStatus = 'cancelled';
        await reservation.save();
        break;
      case '-2':
      case '-3':
        reservation.paymentStatus = 'failed';
        await reservation.save();
        break;
      default:
        break; // 0 / pending — leave as pending
    }
    res.status(200).send();
  } catch (e) {
    console.error('PayHere notify error:', e.message);
    res.status(400).send();
  }
});

// --- Client-side verification fallback ---------------------------------------
// PayHere cannot reach a localhost notify_url, so the client calls this from the
// onCompleted callback. In the sandbox we trust completion and confirm payment.
router.post('/reservations/:id/verify', async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) return res.sendStatus(404);
    if (reservation.paymentStatus === 'pending') {
      await confirmPaid(reservation, req.body.paymentId);
    }
    res.send(reservation);
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

// --- Cancel / refund a reservation -------------------------------------------
router.post('/reservations/:id/cancel', async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) return res.sendStatus(404);
    if (['refunded', 'cancelled', 'expired'].includes(reservation.paymentStatus)) {
      return res.status(400).send({ error: 'Reservation is already cancelled.' });
    }

    const settings = await Settings.getSingleton();
    const refundEligible = isRefundEligible(reservation.date, settings.refundWindowHours);

    const wasPaid = reservation.paymentStatus === 'paid';
    if (wasPaid && refundEligible) {
      reservation.paymentStatus = 'refunded';
    } else {
      reservation.paymentStatus = 'cancelled';
    }
    reservation.holdExpiresAt = undefined;
    await reservation.save();

    // Restore cinema availability only if seats had been confirmed (paid).
    if (wasPaid) {
      const cinema = await Cinema.findById(reservation.cinemaId);
      if (cinema && typeof cinema.seatsAvailable === 'number') {
        cinema.seatsAvailable += reservation.seats.length;
        await cinema.save();
      }
    }
    // Release the seat claim so the seats become available again.
    if (reservation.showtimeId) {
      await SeatLock.deleteMany({ sessionId: `res:${reservation._id}` });
    }

    res.send({
      reservation,
      refunded: wasPaid && refundEligible,
      message:
        wasPaid && refundEligible
          ? 'Booking cancelled and refunded.'
          : wasPaid
          ? `Booking cancelled. No refund (within ${settings.refundWindowHours}h of showtime).`
          : 'Booking cancelled.',
    });
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

// =============================================================================
// Box office (POS) — counter sales processed by cashier/admin staff
// =============================================================================

// Shared counter-sale creation used by both the pay-now and the hold (park)
// flows. Runs the SAME frozen guard, taken-seat check, authoritative pricing and
// atomic double-booking guard as the online route — a cashier cannot oversell a
// seat sold online, and vice versa, because both channels compete for the same
// SeatLock unique index. `paid: true` settles immediately (seats claimed for
// good, availability decremented); `paid: false` parks the order as a pending
// hold whose seats expire after POS_HOLD_MINUTES. Returns { reservation } on
// success or { error, code } on failure.
const buildCounterSale = async (req, { paid }) => {
  const {
    showtimeId,
    cinemaId,
    seats = [],
    format,
    date,
    startAt,
    movieId,
    customerName,
    customerPhone,
    paymentMethod = 'cash',
  } = req.body;

  if (!Array.isArray(seats) || seats.length === 0) {
    return { error: 'No seats selected.', code: 400 };
  }
  if (paid && !['cash', 'card'].includes(paymentMethod)) {
    return { error: 'Invalid payment method.', code: 400 };
  }
  if (await hitsFrozenSeat({ cinemaId, showtimeId, seats })) {
    return { error: 'One or more selected seats are unavailable. Please pick again.', code: 409 };
  }
  if (showtimeId) {
    const taken = await getTakenSeatKeys(showtimeId);
    if (findSeatConflict(taken, seats)) {
      return { error: 'One or more selected seats were just taken. Please pick again.', code: 409 };
    }
  }

  const price = await quoteFor({ cinemaId, seatCount: seats.length, format, date, startAt });

  // Paid sales claim seats for good; parked holds expire after POS_HOLD_MINUTES.
  const expiresAt = paid
    ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
    : new Date(Date.now() + POS_HOLD_MINUTES * 60 * 1000);

  const reservation = new Reservation({
    date,
    startAt,
    seats,
    format: format || '2D',
    movieId,
    cinemaId,
    showtimeId,
    ticketPrice: price.perSeat,
    subtotal: price.subtotal,
    convenienceFee: price.convenienceFee,
    vat: price.vat,
    total: price.total,
    username: (customerName && customerName.trim()) || 'Walk-in Customer',
    phone: (customerPhone && customerPhone.trim()) || '0000000000',
    paymentStatus: paid ? 'paid' : 'pending',
    channel: 'counter',
    paymentMethod: paid ? paymentMethod : paymentMethod || 'cash',
    cashierId: req.user._id,
    holdExpiresAt: paid ? undefined : expiresAt,
  });

  if (showtimeId) {
    const claimed = await claimSeats({
      showtimeId,
      seats,
      reservationId: reservation._id,
      expiresAt,
    });
    if (!claimed) {
      return { error: 'One or more selected seats were just taken. Please pick again.', code: 409 };
    }
  }

  try {
    await reservation.save();
  } catch (e) {
    await SeatLock.deleteMany({ sessionId: `res:${reservation._id}` });
    return { error: e.message || 'Could not save sale.', code: 400 };
  }

  if (paid) {
    const cinema = await Cinema.findById(cinemaId);
    if (cinema && typeof cinema.seatsAvailable === 'number') {
      cinema.seatsAvailable = Math.max(0, cinema.seatsAvailable - seats.length);
      await cinema.save();
    }
  }

  return { reservation };
};

// Create a confirmed counter sale in a single step (paid on the spot).
router.post('/pos/reservations', auth.staff, async (req, res) => {
  try {
    const result = await buildCounterSale(req, { paid: true });
    if (result.error) return res.status(result.code).send({ error: result.error });
    const QRCode = await generateQR(`${CLIENT_URL}/#/checkin/${result.reservation._id}`);
    res.status(201).send({ reservation: result.reservation, QRCode });
  } catch (e) {
    res.status(400).send({ error: e.message || 'Could not create sale.' });
  }
});

// Park an order: hold the seats (pending) without taking payment, so the cashier
// can serve another customer and recall it later to settle.
router.post('/pos/reservations/hold', auth.staff, async (req, res) => {
  try {
    const result = await buildCounterSale(req, { paid: false });
    if (result.error) return res.status(result.code).send({ error: result.error });
    res.status(201).send({ reservation: result.reservation });
  } catch (e) {
    res.status(400).send({ error: e.message || 'Could not hold order.' });
  }
});

// Held (parked) counter orders still within their hold window — the recall list.
router.get('/pos/reservations/held', auth.staff, async (req, res) => {
  try {
    const now = new Date();
    const held = await Reservation.find({
      channel: 'counter',
      paymentStatus: 'pending',
      holdExpiresAt: { $gt: now },
    })
      .sort({ createdAt: -1 })
      .populate('movieId', 'title')
      .populate('cinemaId', 'name')
      .populate('cashierId', 'name username');
    res.send(held);
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

// Settle a recalled hold: collect payment (cash/card) and confirm the booking.
router.post('/pos/reservations/:id/settle', auth.staff, async (req, res) => {
  try {
    const { paymentMethod } = req.body;
    if (!['cash', 'card'].includes(paymentMethod)) {
      return res.status(400).send({ error: 'Invalid payment method.' });
    }
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) return res.sendStatus(404);
    if (reservation.channel !== 'counter') {
      return res.status(400).send({ error: 'Not a counter order.' });
    }
    if (reservation.paymentStatus === 'paid') {
      const QRCode = await generateQR(`${CLIENT_URL}/#/checkin/${reservation._id}`);
      return res.send({ reservation, QRCode }); // idempotent
    }
    if (reservation.paymentStatus !== 'pending') {
      return res.status(400).send({ error: 'This order can no longer be settled.' });
    }
    if (reservation.holdExpiresAt && reservation.holdExpiresAt <= new Date()) {
      return res.status(409).send({ error: 'This hold has expired and its seats were released.' });
    }

    reservation.paymentMethod = paymentMethod;
    await confirmPaid(reservation); // sets paid, decrements availability, locks seats
    const QRCode = await generateQR(`${CLIENT_URL}/#/checkin/${reservation._id}`);
    res.send({ reservation, QRCode });
  } catch (e) {
    res.status(400).send({ error: e.message || 'Could not settle order.' });
  }
});

// Cancel/discard a parked hold, releasing its seats.
router.post('/pos/reservations/:id/void', auth.staff, async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) return res.sendStatus(404);
    if (reservation.channel !== 'counter' || reservation.paymentStatus !== 'pending') {
      return res.status(400).send({ error: 'Only a parked (held) order can be discarded.' });
    }
    reservation.paymentStatus = 'cancelled';
    reservation.holdExpiresAt = undefined;
    await reservation.save();
    if (reservation.showtimeId) {
      await SeatLock.deleteMany({ sessionId: `res:${reservation._id}` });
    }
    res.send({ reservation });
  } catch (e) {
    res.status(400).send({ error: e.message || 'Could not discard order.' });
  }
});

// All completed counter sales, newest first, for the POS bookings table.
// Staff-only; the customer PII here is operational data the box office needs.
router.get('/pos/reservations', auth.staff, async (req, res) => {
  try {
    const reservations = await Reservation.find({ channel: 'counter', paymentStatus: 'paid' })
      .sort({ createdAt: -1 })
      .limit(500)
      .populate('movieId', 'title')
      .populate('cinemaId', 'name')
      .populate('cashierId', 'name username');
    res.send(reservations);
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

// --- Get all reservations (admin only) ---------------------------------------
router.get('/reservations', auth.enhance, async (req, res) => {
  try {
    const reservations = await Reservation.find({});
    res.send(reservations);
  } catch (e) {
    res.status(400).send(e);
  }
});

// --- Get the signed-in user's own reservations -------------------------------
router.get('/reservations/mine', auth.simple, async (req, res) => {
  try {
    const reservations = await Reservation.find({
      $or: [{ userId: req.user._id }, { username: req.user.username }],
    }).sort({ createdAt: -1 });
    res.send(reservations);
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

// --- Get reservation by id ----------------------------------------------------
router.get('/reservations/:id', async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    return !reservation ? res.sendStatus(404) : res.send(reservation);
  } catch (e) {
    return res.status(400).send(e);
  }
});

// --- Check in a reservation (staff) ------------------------------------------
router.patch('/reservations/:id/checkin', auth.simple, async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) return res.sendStatus(404);
    reservation.checkin = true;
    await reservation.save();
    return res.send(reservation);
  } catch (e) {
    return res.status(400).send(e);
  }
});

// --- Update reservation (guest contact details, etc.) ------------------------
router.patch('/reservations/:id', async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = [
    'date',
    'startAt',
    'seats',
    'ticketPrice',
    'total',
    'username',
    'email',
    'phone',
    'checkin',
  ];
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));
  if (!isValidOperation) return res.status(400).send({ error: 'Invalid updates!' });

  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) return res.sendStatus(404);
    updates.forEach(update => (reservation[update] = req.body[update]));
    await reservation.save();
    return res.send(reservation);
  } catch (e) {
    return res.status(400).send(e);
  }
});

// --- Delete reservation (admin) ----------------------------------------------
router.delete('/reservations/:id', auth.enhance, async (req, res) => {
  try {
    const reservation = await Reservation.findByIdAndDelete(req.params.id);
    return !reservation ? res.sendStatus(404) : res.send(reservation);
  } catch (e) {
    return res.sendStatus(400);
  }
});

// --- User modeling: suggested seats ------------------------------------------
router.get('/reservations/usermodeling/:username', async (req, res) => {
  try {
    const suggestedSeats = await userModeling.reservationSeatsUserModeling(
      req.params.username
    );
    res.send(suggestedSeats);
  } catch (e) {
    res.status(400).send(e);
  }
});

module.exports = router;
