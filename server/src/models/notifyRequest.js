const mongoose = require('mongoose');

const { Schema } = mongoose;

// A "notify me when tickets open" / watchlist entry for an upcoming movie.
const notifyRequestSchema = new Schema(
  {
    movieId: { type: Schema.Types.ObjectId, ref: 'Movie', required: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    notified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// One signup per email per movie.
notifyRequestSchema.index({ movieId: 1, email: 1 }, { unique: true });

const NotifyRequest = mongoose.model('NotifyRequest', notifyRequestSchema);

module.exports = NotifyRequest;
