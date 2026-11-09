const express = require('express');
const auth = require('../middlewares/auth');
const Settings = require('../models/settings');

const router = new express.Router();

// Public: read settings (formats, fees, refund policy) for pricing + booking UI.
router.get('/settings', async (req, res) => {
  try {
    const settings = await Settings.getSingleton();
    res.send(settings);
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

// Admin: update settings.
router.patch('/settings', auth.enhance, async (req, res) => {
  const allowedUpdates = [
    'formats',
    'convenienceFeeRate',
    'vatRate',
    'weekendSurcharge',
    'peakSurcharge',
    'peakStartHour',
    'peakEndHour',
    'refundWindowHours',
    'offers',
    'heroMovieIds',
  ];
  const updates = Object.keys(req.body);
  const isValid = updates.every(u => allowedUpdates.includes(u));
  if (!isValid) return res.status(400).send({ error: 'Invalid updates!' });

  try {
    const settings = await Settings.getSingleton();
    updates.forEach(u => (settings[u] = req.body[u]));
    await settings.save();
    res.send(settings);
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

module.exports = router;
