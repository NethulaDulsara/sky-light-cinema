const express = require('express');
const auth = require('../middlewares/auth');
const NotifyRequest = require('../models/notifyRequest');

const router = new express.Router();

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Public: sign up to be notified when an upcoming movie's tickets open.
// Login is optional; a logged-in user is linked via userId.
router.post('/notify', auth.optional, async (req, res) => {
  try {
    const { movieId } = req.body;
    const email = (req.body.email || (req.user && req.user.email) || '')
      .trim()
      .toLowerCase();
    if (!movieId) return res.status(400).send({ error: 'movieId is required' });
    if (!emailRe.test(email))
      return res.status(400).send({ error: 'A valid email is required' });

    const doc = await NotifyRequest.findOneAndUpdate(
      { movieId, email },
      {
        $setOnInsert: {
          movieId,
          email,
          userId: req.user ? req.user._id : undefined,
        },
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    res.status(201).send(doc);
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

// The logged-in user's watchlist (populated with the movie).
router.get('/notify/mine', auth.simple, async (req, res) => {
  try {
    const list = await NotifyRequest.find({
      $or: [{ userId: req.user._id }, { email: req.user.email }],
    })
      .populate('movieId')
      .sort({ createdAt: -1 });
    res.send(list);
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

// Remove a watchlist entry (own entry only).
router.delete('/notify/:id', auth.simple, async (req, res) => {
  try {
    const entry = await NotifyRequest.findById(req.params.id);
    if (!entry) return res.sendStatus(404);
    const isOwner =
      (entry.userId && entry.userId.equals(req.user._id)) ||
      entry.email === req.user.email;
    if (!isOwner) return res.sendStatus(403);
    await entry.deleteOne();
    res.send({ success: true });
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

// Admin: all notify requests, grouped by movie with counts & emails.
router.get('/notify', auth.enhance, async (req, res) => {
  try {
    const list = await NotifyRequest.find()
      .populate('movieId')
      .sort({ createdAt: -1 });
    res.send(list);
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

module.exports = router;
