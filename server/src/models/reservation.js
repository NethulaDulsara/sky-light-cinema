const mongoose = require('mongoose');

const { Schema } = mongoose;
const reservationSchema = new Schema({
  date: {
    type: Date,
    required: true,
  },
  startAt: {
    type: String,
    required: true,
    trim: true,
  },
  seats: {
    type: [Schema.Types.Mixed],
    required: true,
  },
  ticketPrice: {
    type: Number,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
  // Pricing breakdown (fees, taxes, dynamic pricing). Optional for backward
  // compatibility with reservations created before this change.
  subtotal: { type: Number },
  convenienceFee: { type: Number },
  vat: { type: Number },
  format: { type: String, default: '2D' },
  movieId: {
    type: Schema.Types.ObjectId,
    ref: 'Movie',
    required: true,
  },
  cinemaId: {
    type: Schema.Types.ObjectId,
    ref: 'Cinema',
    required: true,
  },
  // Ties a reservation to a specific showtime so seat availability is computed
  // per screening (fixes cross-movie/cross-cinema seat collisions).
  showtimeId: {
    type: Schema.Types.ObjectId,
    ref: 'Showtime',
  },
  // Links a booking to a registered account (absent for guest bookings) so it
  // shows up in that user's dashboard.
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
    required: true,
  },
  checkin: {
    type: Boolean,
    default: false,
  },
  // Payment lifecycle. A reservation only reserves seats once it is `paid`.
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded', 'cancelled', 'expired'],
    default: 'pending',
  },
  paymentId: { type: String },
  // While pending, the seats are only *held* until this time; a background
  // sweep / query ignores expired pending holds so the seats free up.
  holdExpiresAt: { type: Date },
  // Sales channel: 'online' (self-service web) or 'counter' (box-office / POS).
  channel: {
    type: String,
    enum: ['online', 'counter'],
    default: 'online',
  },
  // How the booking was paid. Counter sales are settled on the spot (cash/card);
  // online sales go through the payment gateway.
  paymentMethod: {
    type: String,
    enum: ['online', 'cash', 'card'],
    default: 'online',
  },
  // The staff member who processed a counter sale (absent for online bookings).
  cashierId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
}, { timestamps: true });

// A pending reservation still blocks seats, but only until its hold expires.
reservationSchema.statics.activeStatuses = ['paid'];

const Reservation = mongoose.model('Reservation', reservationSchema);

module.exports = Reservation;
