import { GET_MOVIES, SELECT_MOVIE,GET_SUGGESTIONS } from '../types';
import { setAlert } from './alert';

export const uploadMovieImage = (id, image) => async dispatch => {
  try {
    const data = new FormData();
    data.append('file', image);
    const token = localStorage.getItem('jwtToken');
    const url = '/movies/photo/' + id;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: data
    });
    const responseData = await response.json().catch(() => ({}));
    if (response.ok) {
      dispatch(setAlert('Poster uploaded successfully!', 'success', 5000));
      dispatch(getMovies());
    }
    if (responseData.error) {
      dispatch(setAlert(responseData.error.message || 'Poster upload failed', 'error', 5000));
    }
  } catch (error) {
    dispatch(setAlert(error.message, 'error', 5000));
  }
};

export const getMovies = () => async dispatch => {
  try {
    const url = '/movies';
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    const movies = await response.json();
    if (response.ok) {
      dispatch({ type: GET_MOVIES, payload: movies });
    }
  } catch (error) {
    dispatch(setAlert(error.message, 'error', 5000));
  }
};

export const onSelectMovie = movie => ({
  type: SELECT_MOVIE,
  payload: movie
});

export const getMovie = id => async dispatch => {
  try {
    const url = '/movies/' + id;
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    const movie = await response.json();
    if (response.ok) {
      dispatch({ type: SELECT_MOVIE, payload: movie });
    }
  } catch (error) {
    dispatch(setAlert(error.message, 'error', 5000));
  }
};

export const getMovieSuggestion = id => async dispatch => {
  try {
    const url = '/movies/usermodeling/' + id;
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    const movies = await response.json();
    if (response.ok) {
      dispatch({ type: GET_SUGGESTIONS, payload: movies });
    }
  } catch (error) {
    dispatch(setAlert(error.message, 'error', 5000));
  }
};

export const addMovie = (image, newMovie) => async dispatch => {
  try {
    const token = localStorage.getItem('jwtToken');
    const url = '/movies';
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newMovie)
    });
    const movie = await response.json().catch(() => ({}));
    if (response.ok) {
      dispatch(setAlert('Movie saved successfully!', 'success', 5000));
      if (image && movie._id) {
        await dispatch(uploadMovieImage(movie._id, image));
      }
      dispatch(getMovies());
      return true;
    } else {
      let errorMsg = 'Failed to save movie';
      if (movie) {
        if (movie.error && typeof movie.error === 'string') {
          errorMsg = movie.error;
        } else if (movie.error && movie.error.message) {
          errorMsg = movie.error.message;
        } else if (movie.message) {
          errorMsg = movie.message;
        } else if (movie.errors) {
          errorMsg = Object.values(movie.errors).map(err => err.message).join(', ');
        }
      }
      dispatch(setAlert(errorMsg, 'error', 6000));
      return false;
    }
  } catch (error) {
    dispatch(setAlert(error.message, 'error', 5000));
    return false;
  }
};

export const updateMovie = (movieId, movie, image) => async dispatch => {
  try {
    const token = localStorage.getItem('jwtToken');
    const url = '/movies/' + movieId;
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(movie)
    });
    const data = await response.json().catch(() => ({}));
    if (response.ok) {
      dispatch(onSelectMovie(null));
      dispatch(setAlert('Movie updated successfully!', 'success', 5000));
      if (image) {
        await dispatch(uploadMovieImage(movieId, image));
      }
      dispatch(getMovies());
      return true;
    } else {
      let errorMsg = 'Failed to update movie';
      if (data) {
        if (data.error && typeof data.error === 'string') {
          errorMsg = data.error;
        } else if (data.error && data.error.message) {
          errorMsg = data.error.message;
        } else if (data.message) {
          errorMsg = data.message;
        } else if (data.errors) {
          errorMsg = Object.values(data.errors).map(err => err.message).join(', ');
        }
      }
      dispatch(setAlert(errorMsg, 'error', 6000));
      return false;
    }
  } catch (error) {
    dispatch(setAlert(error.message, 'error', 5000));
    return false;
  }
};

export const removeMovie = movieId => async dispatch => {
  try {
    const token = localStorage.getItem('jwtToken');
    const url = '/movies/' + movieId;
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    if (response.ok) {
      dispatch(getMovies());
      dispatch(onSelectMovie(null));
      dispatch(setAlert('Movie has been deleted!', 'success', 5000));
      return true;
    } else {
      const data = await response.json().catch(() => ({}));
      dispatch(setAlert(data.message || data.error || 'Failed to delete movie', 'error', 5000));
      return false;
    }
  } catch (error) {
    dispatch(setAlert(error.message, 'error', 5000));
    return false;
  }
};
