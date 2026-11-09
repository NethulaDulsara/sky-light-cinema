const mongoose = require('mongoose');

const { Schema } = mongoose;
const movieSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  image: {
    type: String,
  },
  language: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  genre: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  director: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  cast: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  // --- Extended metadata (all optional for backward compatibility) ---
  trailerUrl: { type: String, trim: true },
  certification: { type: String, trim: true }, // U / PG / PG-13 / R ...
  imdbRating: { type: Number, min: 0, max: 10 },
  country: { type: String, trim: true, lowercase: true },
  backdropImage: { type: String, trim: true },
  gallery: { type: [String], default: [] }, // extra photo URLs for the gallery
  releaseDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
});

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;
