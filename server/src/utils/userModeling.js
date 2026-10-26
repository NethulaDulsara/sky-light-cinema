const Reservation = require('../models/reservation');
const Movie = require('../models/movie');
const Cinema = require('../models/cinema');

// Cinema User modeling (GET ALL CINEMAS)
// Get all cinemas based on the user's past reservations
// @return a sorted cinema list
const cinemaUserModeling = async (cinemas, username) => {
  try {
    const userReservations = await Reservation.find({ username: username });

    if (userReservations.length && cinemas && cinemas.length) {
      let cinemaResult = {};
      userReservations.forEach(userReservation => {
        const id = userReservation.cinemaId;
        if (id) {
          cinemaResult[id] = (cinemaResult[id] || 0) + 1;
        }
      });
      const sortedCinemaResult = [];
      for (let cinema in cinemaResult) {
        sortedCinemaResult.push([cinema, cinemaResult[cinema]]);
      }

      sortedCinemaResult.sort((a, b) => b[1] - a[1]);

      const newCinemas = JSON.parse(JSON.stringify(cinemas));
      let i = 0;
      for (let sortedCinema of sortedCinemaResult) {
        const foundIndex = newCinemas.findIndex(c => c && c._id == sortedCinema[0]);
        if (foundIndex !== -1) {
          const [extractedObj] = newCinemas.splice(foundIndex, 1);
          if (extractedObj) {
            newCinemas.splice(i, 0, extractedObj);
            i++;
          }
        }
      }
      return newCinemas;
    }
    return cinemas;
  } catch (e) {
    return cinemas;
  }
};

const moviesUserModeling = async username => {
  const userPreference = {
    genre: {},
    director: {},
    cast: {},
  };

  const userReservations = JSON.parse(
    JSON.stringify(await Reservation.find({ username: username }))
  );
  const Allmovies = JSON.parse(JSON.stringify(await Movie.find({})));

  const moviesWatched = userReservations
    .map(reservation => {
      for (let movie of Allmovies) {
        if (movie._id == reservation.movieId) {
          return movie;
        }
      }
      return null;
    })
    .filter(Boolean);

  moviesWatched.forEach(movie => {
    if (!movie.genre || !movie.director || !movie.cast) return;
    let genres = movie.genre.replace(/\s*,\s*/g, ',').split(',');
    let directors = movie.director.replace(/\s*,\s*/g, ',').split(',');
    let casts = movie.cast.replace(/\s*,\s*/g, ',').split(',');
    for (let genre of genres) {
      userPreference.genre[genre]
        ? ++userPreference.genre[genre]
        : (userPreference.genre[genre] = 1);
    }
    for (let director of directors) {
      userPreference.director[director]
        ? ++userPreference.director[director]
        : (userPreference.director[director] = 1);
    }
    for (let cast of casts) {
      userPreference.cast[cast] ? ++userPreference.cast[cast] : (userPreference.cast[cast] = 1);
    }
  });

  //console.log(userPreference)

  //find movies that are available for booking
  const availableMovies = availableMoviesFilter(Allmovies);
  //console.log(availableMovies)
  const moviesNotWatched = moviesNotWatchedFilter(availableMovies, userReservations);
  //console.log(moviesNotWatched)

  const moviesRated = findRates(moviesNotWatched, userPreference);

  moviesRated.sort((a, b) => {
    return b[1] - a[1];
  });
  // console.log(moviesRated)

  const moviesToObject = moviesRated.map(array => {
    return array[0];
  });
  return moviesToObject;
};

const findRates = (moviesNotWatched, userPreference) => {
  const result = [];
  let rate;
  for (let movie of moviesNotWatched) {
    rate = 0;
    for (let pref in userPreference) {
      rate += getRateOfProperty(pref, userPreference, movie);
      //TODO we can use weights here
      console.log(rate, pref);
    }
    if (rate !== 0) result.push([movie, rate]);
  }
  console.log(result);
  return result;
};

const getRateOfProperty = (pref, userPreference, movie) => {
  let rate = 0;
  const values = Object.keys(userPreference[pref]).map(key => {
    return [key, userPreference[pref][key]];
  });
  let movieValues = movie[pref].replace(/\s*,\s*/g, ',').split(',');
  for (const value of values) {
    if (movieValues.length) {
      for (const movieValue of movieValues) {
        if (movieValue == value[0]) {
          rate += value[1];
        }
      }
    }
  }

  return rate;
};

const availableMoviesFilter = Allmovies => {
  const today = new Date();
  const returnMovies = [];
  Allmovies.map(movie => {
    let releaseDate = new Date(movie.releaseDate);
    let endDate = new Date(movie.endDate);
    if (today >= releaseDate && today <= endDate) {
      returnMovies.push(movie);
    }
  });
  return returnMovies;
};

const moviesNotWatchedFilter = (availableMovies, userReservations) => {
  const returnMovies = [];
  availableMovies.map(movie => {
    let isFirst = [];
    for (let reservation of userReservations) {
      if (reservation.movieId == movie._id) {
        isFirst.push(false);
      } else {
        isFirst.push(true);
      }
    }

    if (isFirst.every(Boolean)) {
      returnMovies.push(movie);
    }
  });
  return returnMovies;
};

const reservationSeatsUserModeling = async (username, newSeats) => {
  try {
    let numberOfTicketsArray = [];
    let numberOfTickets = 1;
    const positions = {
      front: 0,
      center: 0,
      back: 0,
    };
    const cinemas = JSON.parse(JSON.stringify(await Cinema.find({})));
    const userReservations = JSON.parse(
      JSON.stringify(await Reservation.find({ username: username }))
    );

    userReservations.forEach(reservation => {
      for (let cinema of cinemas) {
        if (
          cinema._id == reservation.cinemaId &&
          Array.isArray(reservation.seats) &&
          reservation.seats.length
        ) {
          const rowsCount = cinema.seats && cinema.seats.length ? cinema.seats.length : 10;
          const position = getPosition(rowsCount, reservation.seats);
          if (positions[position] !== undefined) {
            ++positions[position];
          }
          numberOfTicketsArray.push(reservation.seats.length);
        }
      }
    });

    if (numberOfTicketsArray.length) {
      numberOfTickets = Math.round(
        numberOfTicketsArray.reduce((a, b) => a + b, 0) / numberOfTicketsArray.length
      );
    }

    return {
      numberOfTickets,
      positions,
    };
  } catch (err) {
    return {
      numberOfTickets: 1,
      positions: { front: 0, center: 1, back: 0 }
    };
  }
};

const getPosition = (cinemaRows, seats) => {
  if (!cinemaRows || cinemaRows <= 0 || !seats || !seats.length || !seats[0]) return 'center';
  const rowNum = Number(seats[0][0]) || 0;
  const step = cinemaRows / 3;
  if (!step || step <= 0) return 'center';
  let pos = 1;
  for (let i = step; i <= cinemaRows; i += step) {
    if (rowNum < i) {
      switch (pos) {
        case 1:
          return 'front';
        case 2:
          return 'center';
        case 3:
          return 'back';
      }
    }
    pos++;
  }
  return 'center';
};

const userModeling = {
  cinemaUserModeling,
  moviesUserModeling,
  reservationSeatsUserModeling,
};

module.exports = userModeling;
