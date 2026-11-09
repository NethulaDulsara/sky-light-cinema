const express = require('express');
const SeatLock = require('../models/seatLock');
const Reservation = require('../models/reservation');
const { SEAT_HOLD_MINUTES } = require('../config');
const { seatKey } = require('../utils/seats');

const router = new express.Router();

// Acquire short-lived holds on the given seats for a showtime. Rejects seats
// that are already booked or held by another session. `sessionId` lets guests
// hold seats without logging in.
router.post('/seatlocks', async (req, res) => {
  try {
    const { showtimeId, seats = [], sessionId } = req.body;
    if (!showtimeId || !sessionId || !Array.isArray(seats) || seats.length === 0) {
      return res.status(400).send({ error: 'showtimeId, sessionId and seats are required.' });
    }

    const now = new Date();

    // Seats already confirmed/pending via reservations.
    const reservations = await Reservation.find({
      showtimeId,
      $or: [
        { paymentStatus: 'paid' },
        { paymentStatus: 'pending', holdExpiresAt: { $gt: now } },
      ],
    }).select('seats');
    const bookedKeys = new Set();
    reservations.forEach(r =>
      (Array.isArray(r.seats) ? r.seats : []).forEach(s => bookedKeys.add(seatKey(s)))
    );

    // Seats held by OTHER sessions.
    const otherLocks = await SeatLock.find({
      showtimeId,
      sessionId: { $ne: sessionId },
      expiresAt: { $gt: now },
    }).select('seat');
    const heldKeys = new Set(otherLocks.map(l => l.seat));

    const requested = seats.map(seatKey);
    const conflict = requested.find(k => bookedKeys.has(k) || heldKeys.has(k));
    if (conflict) {
      return res.status(409).send({ error: 'Some seats are no longer available.' });
    }

    const expiresAt = new Date(Date.now() + SEAT_HOLD_MINUTES * 60 * 1000);

    // Release this session's previous holds for the showtime, then set new ones.
    await SeatLock.deleteMany({ showtimeId, sessionId });
    await SeatLock.insertMany(
      requested.map(seat => ({ showtimeId, seat, sessionId, expiresAt }))
    );

    res.status(201).send({ expiresAt, seats: requested });
  } catch (e) {
    // Duplicate key => a concurrent session grabbed a seat first.
    if (e.code === 11000) {
      return res.status(409).send({ error: 'Some seats were just taken.' });
    }
    res.status(400).send({ error: e.message });
  }
});

// Release a session's holds for a showtime.
router.delete('/seatlocks', async (req, res) => {
  try {
    const { showtimeId, sessionId } = req.body;
    if (!sessionId) return res.status(400).send({ error: 'sessionId required' });
    await SeatLock.deleteMany({
      ...(showtimeId ? { showtimeId } : {}),
      sessionId,
    });
    res.send({ released: true });
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

module.exports = router;
