// Backfill existing movies with extended metadata (trailer, certification,
// IMDb rating, country). Matches by title (stored lowercase). Idempotent.
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const mongoose = require('mongoose');
const Movie = require('./src/models/movie');

const yt = id => `https://www.youtube.com/watch?v=${id}`;

// Keyed by lowercase title.
const meta = {
  'inception': { trailerUrl: yt('YoHD9XEInc0'), certification: 'PG-13', imdbRating: 8.8, country: 'usa' },
  'the dark knight': { trailerUrl: yt('EXeTwQWrcwY'), certification: 'PG-13', imdbRating: 9.0, country: 'usa' },
  'interstellar': { trailerUrl: yt('zSWdZVtXT7E'), certification: 'PG-13', imdbRating: 8.7, country: 'usa' },
  'oppenheimer': { trailerUrl: yt('uYPbbksJxIg'), certification: 'R', imdbRating: 8.3, country: 'usa' },
  'dune: part two': { trailerUrl: yt('Way9Dexny3w'), certification: 'PG-13', imdbRating: 8.5, country: 'usa' },
  'the godfather': { trailerUrl: yt('UaVTIH8mujA'), certification: 'R', imdbRating: 9.2, country: 'usa' },
  'parasite': { trailerUrl: yt('5xH0HfJHsaY'), certification: 'R', imdbRating: 8.5, country: 'south korea' },
  'spider-man: across the spider-verse': { trailerUrl: yt('cqGjhVJWtEg'), certification: 'PG', imdbRating: 8.6, country: 'usa' },
  'everything everywhere all at once': { trailerUrl: yt('wxN1T1uxQ2g'), certification: 'R', imdbRating: 7.8, country: 'usa' },
  'top gun: maverick': { trailerUrl: yt('qSqVVswa420'), certification: 'PG-13', imdbRating: 8.2, country: 'usa' },
  'pulp fiction': { trailerUrl: yt('s7EdQ4FqbhY'), certification: 'R', imdbRating: 8.9, country: 'usa' },
  'blade runner 2049': { trailerUrl: yt('gCcx85zbxz4'), certification: 'R', imdbRating: 8.0, country: 'usa' },
  'mission: impossible - the final reckoning': { trailerUrl: yt('fsQgc9pCyDU'), certification: 'PG-13', imdbRating: 7.0, country: 'usa' },
  'joker: folie a deux': { trailerUrl: yt('_OKAwz2MsJs'), certification: 'R', imdbRating: 5.1, country: 'usa' },
  // Trailer not confirmed / not yet released — metadata only.
  'gladiator ii': { certification: 'R', imdbRating: 6.5, country: 'usa' },
  'avatar: fire and ash': { certification: 'PG-13', country: 'usa' },
  'the batman: part ii': { certification: 'PG-13', country: 'usa' },
};

mongoose
  .connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('Connected. Enriching movie metadata...');
    let updated = 0;
    for (const [title, fields] of Object.entries(meta)) {
      const res = await Movie.updateOne({ title }, { $set: fields });
      if (res.modifiedCount || res.nModified) {
        updated++;
        console.log(`  + ${title}`);
      }
    }
    console.log(`Enriched ${updated} movies.`);
    process.exit();
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
