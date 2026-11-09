// Create sample showtimes for every movie across every cinema.
// Idempotent: skips a (movie, cinema, startAt) combination that already exists.
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const mongoose = require('mongoose');
const Movie = require('./src/models/movie');
const Cinema = require('./src/models/cinema');
const Showtime = require('./src/models/showtime');

// One slot per screen format, at varied times (drives dynamic pricing).
const SLOTS = [
  { startAt: '10:00', format: '2D' },
  { startAt: '15:30', format: '3D' },
  { startAt: '18:00', format: 'IMAX' },
  { startAt: '21:00', format: '4DX' },
];

const midnight = d => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
};

mongoose
  .connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('Connected. Seeding showtimes...');
    const [movies, cinemas, existing] = await Promise.all([
      Movie.find({}),
      Cinema.find({}),
      Showtime.find({}).select('movieId cinemaId startAt'),
    ]);

    if (!cinemas.length) {
      console.log('No cinemas found — create a cinema first.');
      process.exit();
    }

    // Set of "movie|cinema|startAt" already present.
    const seen = new Set(
      existing.map(s => `${s.movieId}|${s.cinemaId}|${s.startAt}`)
    );

    const today = midnight(new Date());
    const toCreate = [];

    for (const movie of movies) {
      // Availability window: from the later of today / release date, for 30 days.
      const release = midnight(movie.releaseDate || today);
      const startDate = release > today ? release : today;
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 30);

      for (const cinema of cinemas) {
        for (const slot of SLOTS) {
          const key = `${movie._id}|${cinema._id}|${slot.startAt}`;
          if (seen.has(key)) continue;
          toCreate.push({
            startAt: slot.startAt,
            format: slot.format,
            startDate,
            endDate,
            movieId: movie._id,
            cinemaId: cinema._id,
          });
          seen.add(key);
        }
      }
    }

    if (!toCreate.length) {
      console.log('All movies already have showtimes. Nothing to add.');
    } else {
      await Showtime.insertMany(toCreate);
      console.log(`Created ${toCreate.length} showtimes across ${movies.length} movies and ${cinemas.length} cinema(s).`);
    }

    const total = await Showtime.countDocuments();
    console.log(`Total showtimes now: ${total}`);
    process.exit();
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
