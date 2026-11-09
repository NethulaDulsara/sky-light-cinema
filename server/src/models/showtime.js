const mongoose = require('mongoose');

const { Schema } = mongoose;
const showtimeSchema = new Schema({
  startAt: {
    type: String,
    required: true,
    trim: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  // Screen format for this showtime (2D/3D/IMAX/4DX). Drives price multiplier.
  format: {
    type: String,
    default: '2D',
    trim: true,
  },
  // Per-screening frozen seats ("rowIndex-colIndex"), on top of the hall's.
  frozenSeats: {
    type: [String],
    default: [],
  },
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
});

const Showtime = mongoose.model('Showtime', showtimeSchema);

module.exports = Showtime;
