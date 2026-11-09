const express = require('express');
const auth = require('../middlewares/auth');
const Showtime = require('../models/showtime');
const Reservation = require('../models/reservation');
const SeatLock = require('../models/seatLock');

const router = new express.Router();

// Guest-safe seat availability for a showtime: booked seats (paid, or pending
// with an unexpired hold) and seats currently held by other sessions. Returns
// only seat coordinates — never customer PII.
router.get('/showtimes/:id/seats', async (req, res) => {
  const showtimeId = req.params.id;
  try {
    const now = new Date();
    const reservations = await Reservation.find({
      showtimeId,
      $or: [
        { paymentStatus: 'paid' },
        { paymentStatus: 'pending', holdExpiresAt: { $gt: now } },
      ],
    }).select('seats');

    const booked = reservations.reduce(
      (acc, r) => acc.concat(Array.isArray(r.seats) ? r.seats : []),
      []
    );

    const locks = await SeatLock.find({
      showtimeId,
      expiresAt: { $gt: now },
    }).select('seat sessionId');

    const held = locks.map(l => ({ seat: l.seat, sessionId: l.sessionId }));

    res.send({ booked, held });
  } catch (e) {
    res.status(400).send(e);
  }
});

// Create a showtime
router.post('/showtimes', auth.enhance, async (req, res) => {
  const showtime = new Showtime(req.body);
  try {
    await showtime.save();
    res.status(201).send(showtime);
  } catch (e) {
    res.status(400).send(e);
  }
});

// Get all showtimes
router.get('/showtimes', async (req, res) => {
  try {
    const showtimes = await Showtime.find({});
    res.send(showtimes);
  } catch (e) {
    res.status(400).send(e);
  }
});

// Get showtime by id
router.get('/showtimes/:id', async (req, res) => {
  const _id = req.params.id;
  try {
    const showtime = await Showtime.findById(_id);
    return !showtime ? res.sendStatus(404) : res.send(showtime);
  } catch (e) {
    res.status(400).send(e);
  }
});

// Update showtime by id
router.patch('/showtimes/:id', auth.enhance, async (req, res) => {
  const _id = req.params.id;
  const updates = Object.keys(req.body);
  const allowedUpdates = ['startAt', 'startDate', 'endDate', 'movieId', 'cinemaId', 'format', 'frozenSeats'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) return res.status(400).send({ error: 'Invalid updates!' });

  try {
    const showtime = await Showtime.findById(_id);
    updates.forEach((update) => (showtime[update] = req.body[update]));
    await showtime.save();
    return !showtime ? res.sendStatus(404) : res.send(showtime);
  } catch (e) {
    return res.status(400).send(e);
  }
});

// Delete showtime by id
router.delete('/showtimes/:id', auth.enhance, async (req, res) => {
  const _id = req.params.id;
  try {
    const showtime = await Showtime.findByIdAndDelete(_id);
    return !showtime ? res.sendStatus(404) : res.send(showtime);
  } catch (e) {
    return res.sendStatus(400);
  }
});

module.exports = router;
