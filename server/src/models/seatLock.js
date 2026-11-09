const mongoose = require('mongoose');

const { Schema } = mongoose;

// A short-lived hold on a single seat for a given showtime. MongoDB's TTL
// monitor removes the document automatically once `expiresAt` passes, so holds
// free themselves without any sweep job. `sessionId` is a browser-generated id
// so guests (not logged in) can hold seats.
const seatLockSchema = new Schema({
  showtimeId: {
    type: Schema.Types.ObjectId,
    ref: 'Showtime',
    required: true,
  },
  // Seat coordinate as "row-col" (e.g. "3-5") for a unique index.
  seat: {
    type: String,
    required: true,
  },
  sessionId: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
});

// One active lock per seat per showtime.
seatLockSchema.index({ showtimeId: 1, seat: 1 }, { unique: true });
// TTL index: Mongo deletes the doc when expiresAt is reached.
seatLockSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const SeatLock = mongoose.model('SeatLock', seatLockSchema);

module.exports = SeatLock;
