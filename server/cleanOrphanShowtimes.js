const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const mongoose = require('mongoose');
const Movie = require('./src/models/movie');
const Showtime = require('./src/models/showtime');

mongoose
  .connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    const movieIds = (await Movie.find({}).select('_id')).map(m => String(m._id));
    const res = await Showtime.deleteMany({ movieId: { $nin: movieIds } });
    console.log(`Removed ${res.deletedCount} orphan showtime(s).`);
    console.log('Total showtimes now:', await Showtime.countDocuments());
    process.exit();
  })
  .catch(err => { console.error(err); process.exit(1); });
