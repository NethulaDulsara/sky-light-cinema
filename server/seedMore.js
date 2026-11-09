const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const mongoose = require('mongoose');
const Movie = require('./src/models/movie');

// Helper: date N days from now
const days = n => new Date(Date.now() + n * 24 * 60 * 60 * 1000);

// Real movies with real poster images (TMDB CDN).
// releaseDate in the past  -> "Now Showing"
// releaseDate in the future -> "Coming Soon"
const movies = [
  // ---------- NOW SHOWING (released, still running) ----------
  {
    title: 'Oppenheimer',
    image: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
    language: 'English',
    genre: 'Drama',
    director: 'Christopher Nolan',
    cast: 'Cillian Murphy, Emily Blunt, Matt Damon, Robert Downey Jr.',
    description: 'The story of J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II.',
    duration: 180,
    releaseDate: new Date('2023-07-21'),
    endDate: days(45),
  },
  {
    title: 'Dune: Part Two',
    image: 'https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',
    language: 'English',
    genre: 'Sci-Fi',
    director: 'Denis Villeneuve',
    cast: 'Timothee Chalamet, Zendaya, Rebecca Ferguson, Javier Bardem',
    description: 'Paul Atreides unites with the Fremen to wage war against House Harkonnen and avenge his family.',
    duration: 166,
    releaseDate: new Date('2024-03-01'),
    endDate: days(50),
  },
  {
    title: 'The Godfather',
    image: 'https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg',
    language: 'English',
    genre: 'Crime',
    director: 'Francis Ford Coppola',
    cast: 'Marlon Brando, Al Pacino, James Caan',
    description: 'The aging patriarch of an organized crime dynasty transfers control to his reluctant son.',
    duration: 175,
    releaseDate: new Date('1972-03-24'),
    endDate: days(40),
  },
  {
    title: 'Parasite',
    image: 'https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg',
    language: 'Korean',
    genre: 'Thriller',
    director: 'Bong Joon-ho',
    cast: 'Song Kang-ho, Lee Sun-kyun, Cho Yeo-jeong',
    description: 'Greed and class discrimination threaten the relationship between a wealthy family and a poor clan.',
    duration: 132,
    releaseDate: new Date('2019-11-08'),
    endDate: days(35),
  },
  {
    title: 'Spider-Man: Across the Spider-Verse',
    image: 'https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg',
    language: 'English',
    genre: 'Animation',
    director: 'Joaquim Dos Santos',
    cast: 'Shameik Moore, Hailee Steinfeld, Oscar Isaac',
    description: 'Miles Morales catapults across the Multiverse and encounters a team of Spider-People.',
    duration: 140,
    releaseDate: new Date('2023-06-02'),
    endDate: days(42),
  },
  {
    title: 'Everything Everywhere All at Once',
    image: 'https://image.tmdb.org/t/p/w500/w3LxiVYdWWRvEVdn5RYq6jIqkb1.jpg',
    language: 'English',
    genre: 'Sci-Fi',
    director: 'Daniel Kwan, Daniel Scheinert',
    cast: 'Michelle Yeoh, Ke Huy Quan, Jamie Lee Curtis',
    description: 'A middle-aged woman is swept into an adventure where she alone can save existence across the multiverse.',
    duration: 139,
    releaseDate: new Date('2022-03-25'),
    endDate: days(38),
  },
  {
    title: 'Top Gun: Maverick',
    image: 'https://image.tmdb.org/t/p/w500/62HCnUTziyWcpDaBO2i1DX17ljH.jpg',
    language: 'English',
    genre: 'Action',
    director: 'Joseph Kosinski',
    cast: 'Tom Cruise, Miles Teller, Jennifer Connelly',
    description: 'After thirty years, Maverick trains a detachment of Top Gun graduates for a specialized mission.',
    duration: 131,
    releaseDate: new Date('2022-05-27'),
    endDate: days(48),
  },
  {
    title: 'Pulp Fiction',
    image: 'https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg',
    language: 'English',
    genre: 'Crime',
    director: 'Quentin Tarantino',
    cast: 'John Travolta, Uma Thurman, Samuel L. Jackson',
    description: 'The lives of two mob hitmen, a boxer, and a pair of diner bandits intertwine in four tales of violence.',
    duration: 154,
    releaseDate: new Date('1994-10-14'),
    endDate: days(33),
  },

  // ---------- COMING SOON (future release) ----------
  {
    title: 'Avatar: Fire and Ash',
    image: 'https://image.tmdb.org/t/p/w500/bRBeSHfGHwkEpImlhxPmOcUsaeg.jpg',
    language: 'English',
    genre: 'Sci-Fi',
    director: 'James Cameron',
    cast: 'Sam Worthington, Zoe Saldana, Sigourney Weaver',
    description: 'The Sully family continues their fight for survival on Pandora, facing a new and aggressive Na\'vi clan.',
    duration: 190,
    releaseDate: days(20),
    endDate: days(90),
  },
  {
    title: 'Mission: Impossible - The Final Reckoning',
    image: 'https://image.tmdb.org/t/p/w500/z53D72EAOxGRqdr7KXXWp9dJiDe.jpg',
    language: 'English',
    genre: 'Action',
    director: 'Christopher McQuarrie',
    cast: 'Tom Cruise, Hayley Atwell, Ving Rhames',
    description: 'Ethan Hunt and the IMF team race to stop a catastrophic artificial intelligence threatening the world.',
    duration: 169,
    releaseDate: days(12),
    endDate: days(75),
  },
  {
    title: 'The Batman: Part II',
    image: 'https://image.tmdb.org/t/p/w500/b0PlSFdDwbyK0cf5RxwDpaOJQvQ.jpg',
    language: 'English',
    genre: 'Action',
    director: 'Matt Reeves',
    cast: 'Robert Pattinson, Zoe Kravitz, Colin Farrell',
    description: 'The Dark Knight returns to confront new threats rising from the shadows of a corrupt Gotham City.',
    duration: 160,
    releaseDate: days(35),
    endDate: days(110),
  },
  {
    title: 'Blade Runner 2049',
    image: 'https://image.tmdb.org/t/p/w500/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg',
    language: 'English',
    genre: 'Sci-Fi',
    director: 'Denis Villeneuve',
    cast: 'Ryan Gosling, Harrison Ford, Ana de Armas',
    description: 'A young blade runner uncovers a long-buried secret that could plunge what is left of society into chaos.',
    duration: 164,
    releaseDate: days(28),
    endDate: days(95),
  },
  {
    title: 'Joker: Folie a Deux',
    image: 'https://image.tmdb.org/t/p/w500/if8QiqCI7WAGImKcJCfzp6VTyKA.jpg',
    language: 'English',
    genre: 'Drama',
    director: 'Todd Phillips',
    cast: 'Joaquin Phoenix, Lady Gaga, Brendan Gleeson',
    description: 'Arthur Fleck finds love and faces the consequences of his alter ego within the walls of Arkham.',
    duration: 138,
    releaseDate: days(18),
    endDate: days(80),
  },
  {
    title: 'Gladiator II',
    image: 'https://image.tmdb.org/t/p/w500/2cxhvwyEwRlysAmRH4iodkvo0z5.jpg',
    language: 'English',
    genre: 'Action',
    director: 'Ridley Scott',
    cast: 'Paul Mescal, Pedro Pascal, Denzel Washington',
    description: 'Years after witnessing the fall of Maximus, Lucius is forced to enter the Colosseum to fight for Rome.',
    duration: 148,
    releaseDate: days(40),
    endDate: days(115),
  },
];

mongoose
  .connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('Connected to MongoDB. Adding sample movies...');

    // Dedupe by title (schema stores titles lowercase)
    const existing = await Movie.find({}, 'title').lean();
    const existingTitles = new Set(existing.map(m => m.title.toLowerCase()));

    const toInsert = movies.filter(m => !existingTitles.has(m.title.toLowerCase()));

    if (toInsert.length === 0) {
      console.log('All sample movies already exist. Nothing to add.');
    } else {
      await Movie.insertMany(toInsert);
      console.log(`Successfully added ${toInsert.length} new movies:`);
      toInsert.forEach(m => console.log(`  - ${m.title}`));
    }

    const total = await Movie.countDocuments();
    console.log(`Database now has ${total} movies total.`);
    process.exit();
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
