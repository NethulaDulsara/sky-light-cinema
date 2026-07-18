const express = require('express');
const auth = require('../middlewares/auth');
const Reservation = require('../models/reservation');
const userModeling = require('../utils/userModeling');
const generateQR = require('../utils/generateQRCode');
const crypto = require('crypto');

const router = new express.Router();

const PAYHERE_MERCHANT_ID = '1236984';
const PAYHERE_SECRET = 'MTM2MjQxMDg4OTM4NDQxNzI4NjQyODQ2OTQ3MjgyODA2ODEwNDg0';

// Create a reservation
router.post('/reservations', async (req, res) => {
  // Set checkin to false, but also we can use a custom status field if needed.
  // For PayHere we will just assume it's created and pending payment.
  const reservation = new Reservation(req.body);

  const QRCode = await generateQR(`https://razorpay.com`);

  try {
    await reservation.save();
    res.status(201).send({ reservation, QRCode });
  } catch (e) {
    res.status(400).send(e);
  }
});

// PayHere Hash Generation
router.post('/reservations/payhere/hash', async (req, res) => {
  const { order_id, amount, currency } = req.body;
  
  const hashed_secret = crypto.createHash('md5').update(PAYHERE_SECRET).digest('hex').toUpperCase();
  const amountFormatted = parseFloat(amount).toFixed(2);
  const hash = crypto.createHash('md5').update(PAYHERE_MERCHANT_ID + order_id + amountFormatted + currency + hashed_secret).digest('hex').toUpperCase();

  res.send({ hash, merchant_id: PAYHERE_MERCHANT_ID });
});

// PayHere Notify Webhook
router.post('/reservations/payhere/notify', async (req, res) => {
  const { merchant_id, order_id, payhere_amount, payhere_currency, status_code, md5sig } = req.body;

  const hashed_secret = crypto.createHash('md5').update(PAYHERE_SECRET).digest('hex').toUpperCase();
  const local_md5sig = crypto.createHash('md5').update(merchant_id + order_id + payhere_amount + payhere_currency + status_code + hashed_secret).digest('hex').toUpperCase();

  if (local_md5sig === md5sig) {
    if (status_code === '2') {
      // Payment success
      try {
        const reservation = await Reservation.findById(order_id);
        if (reservation) {
          // We could add a status field, but for now just updating checkin or something, 
          // or we can just leave it as is. We'll update the contact details from the frontend before payment anyway.
          console.log(`Payment success for reservation ${order_id}`);
        }
      } catch (e) {
        console.error(e);
      }
    }
    res.status(200).send();
  } else {
    res.status(400).send('Invalid signature');
  }
});

// Get all reservations
router.get('/reservations', async (req, res) => {
  try {
    const reservations = await Reservation.find({});
    res.send(reservations);
  } catch (e) {
    res.status(400).send(e);
  }
});

// Get reservation by id
router.get('/reservations/:id', async (req, res) => {
  const _id = req.params.id;
  try {
    const reservation = await Reservation.findById(_id);
    return !reservation ? res.sendStatus(404) : res.send(reservation);
  } catch (e) {
    return res.status(400).send(e);
  }
});

// Get reservation checkin by id
router.get('/reservations/checkin/:id', async (req, res) => {
  const _id = req.params.id;
  try {
    const reservation = await Reservation.findById(_id);
    reservation.checkin = true;
    await reservation.save();
    return !reservation ? res.sendStatus(404) : res.send(reservation);
  } catch (e) {
    res.status(400).send(e);
  }
});

// Update reservation by id
router.patch('/reservations/:id', async (req, res) => {
  const _id = req.params.id;
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
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) return res.status(400).send({ error: 'Invalid updates!' });

  try {
    const reservation = await Reservation.findById(_id);
    updates.forEach((update) => (reservation[update] = req.body[update]));
    await reservation.save();
    return !reservation ? res.sendStatus(404) : res.send(reservation);
  } catch (e) {
    return res.status(400).send(e);
  }
});

// Delete reservation by id
router.delete('/reservations/:id', auth.enhance, async (req, res) => {
  const _id = req.params.id;
  try {
    const reservation = await Reservation.findByIdAndDelete(_id);
    return !reservation ? res.sendStatus(404) : res.send(reservation);
  } catch (e) {
    return res.sendStatus(400);
  }
});

// User modeling get suggested seats
router.get('/reservations/usermodeling/:username', async (req, res) => {
  const { username } = req.params;
  try {
    const suggestedSeats = await userModeling.reservationSeatsUserModeling(username);
    res.send(suggestedSeats);
  } catch (e) {
    res.status(400).send(e);
  }
});

module.exports = router;
