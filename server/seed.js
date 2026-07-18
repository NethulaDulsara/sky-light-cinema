require('dotenv').config();
const mongoose = require('mongoose');
const Movie = require('./src/models/movie');
const Cinema = require('./src/models/cinema');

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('Connected to MongoDB. Seeding data...');
    
    // Clear existing
    await Movie.deleteMany({});
    
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
      }
    ];

    await Movie.insertMany(movies);
    console.log('Successfully seeded 2 movies!');
    process.exit();
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
