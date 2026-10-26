const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const mongoose = require('mongoose');
const Movie = require('./src/models/movie');
const Cinema = require('./src/models/cinema');

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('Connected to MongoDB. Seeding data...');
    
    // Only seed if empty to prevent wiping existing movies
    const count = await Movie.countDocuments();
    if (count > 0) {
      console.log(`Database already has ${count} movies. Preserving your data!`);
      process.exit();
    }
    
    const now = new Date();
    const nextMonth = new Date();
    nextMonth.setMonth(now.getMonth() + 1);

    const movies = [
      {
        title: 'Inception',
        image: 'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_FMjpg_UX1000_.jpg',
        language: 'English',
        genre: 'Sci-Fi',
        director: 'Christopher Nolan',
        cast: 'Leonardo DiCaprio, Joseph Gordon-Levitt',
        description: 'A thief who steals corporate secrets through the use of dream-sharing technology.',
        duration: 148,
        releaseDate: new Date('2010-07-16'),
        endDate: nextMonth
      },
      {
        title: 'The Dark Knight',
        image: 'https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_FMjpg_UX1000_.jpg',
        language: 'English',
        genre: 'Action',
        director: 'Christopher Nolan',
        cast: 'Christian Bale, Heath Ledger',
        description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham.',
        duration: 152,
        releaseDate: new Date('2008-07-18'),
        endDate: nextMonth
      },
      {
        title: 'Interstellar',
        image: 'https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2EwOWM3OTM5MzkwXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_FMjpg_UX1000_.jpg',
        language: 'English',
        genre: 'Sci-Fi',
        director: 'Christopher Nolan',
        cast: 'Matthew McConaughey, Anne Hathaway',
        description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity survival.',
        duration: 169,
        releaseDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)
      }
    ];

    await Movie.insertMany(movies);
    console.log(`Successfully seeded ${movies.length} movies!`);
    process.exit();
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
