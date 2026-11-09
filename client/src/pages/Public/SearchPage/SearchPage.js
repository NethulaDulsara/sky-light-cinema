import React, { useEffect, useState, useCallback } from 'react';
import {
  makeStyles,
  Grid,
  Typography,
  TextField,
  MenuItem,
  InputAdornment,
  CircularProgress
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import ResponsiveMovieCard from '../components/ResponsiveMovieCard/ResponsiveMovieCard';
import { genreData, languageData } from '../../../data/MovieDataService';

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: theme.spacing(14),
    marginBottom: theme.spacing(8),
    padding: theme.spacing(0, 2),
    maxWidth: 1100,
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  title: {
    fontSize: '2.4rem',
    fontWeight: 700,
    marginBottom: theme.spacing(3)
  },
  filters: {
    display: 'flex',
    gap: theme.spacing(2),
    flexWrap: 'wrap',
    marginBottom: theme.spacing(4)
  },
  searchField: { flex: '1 1 320px' },
  select: { minWidth: 160 },
  empty: { marginTop: theme.spacing(6), textAlign: 'center', opacity: 0.7 }
}));

const useQuery = search => new URLSearchParams(search);

function SearchPage(props) {
  const classes = useStyles();
  const params = useQuery(props.location.search);

  const [query, setQuery] = useState(params.get('q') || '');
  const [genre, setGenre] = useState(params.get('genre') || '');
  const [language, setLanguage] = useState(params.get('language') || '');
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchMovies = useCallback(async () => {
    setLoading(true);
    try {
      const qs = new URLSearchParams();
      if (query) qs.set('search', query);
      if (genre) qs.set('genre', genre);
      if (language) qs.set('language', language);
      const res = await fetch(`/movies?${qs.toString()}`);
      const data = await res.json();
      setMovies(Array.isArray(data) ? data : []);
    } catch (e) {
      setMovies([]);
    } finally {
      setLoading(false);
    }
  }, [query, genre, language]);

  // Debounce the search so we don't hit the server on every keystroke.
  useEffect(() => {
    const t = setTimeout(fetchMovies, 300);
    return () => clearTimeout(t);
  }, [fetchMovies]);

  return (
    <div className={classes.root}>
      <Typography className={classes.title} variant="h1" component="h1">
        Find a Movie
      </Typography>

      <div className={classes.filters}>
        <TextField
          className={classes.searchField}
          variant="outlined"
          placeholder="Search by title…"
          value={query}
          onChange={e => setQuery(e.target.value)}
          inputProps={{ 'aria-label': 'Search movies by title' }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            )
          }}
        />
        <TextField
          select
          className={classes.select}
          variant="outlined"
          label="Genre"
          value={genre}
          onChange={e => setGenre(e.target.value)}>
          <MenuItem value="">All genres</MenuItem>
          {genreData.map(g => (
            <MenuItem key={g} value={g}>
              {g}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          className={classes.select}
          variant="outlined"
          label="Language"
          value={language}
          onChange={e => setLanguage(e.target.value)}>
          <MenuItem value="">All languages</MenuItem>
          {languageData.map(l => (
            <MenuItem key={l} value={l}>
              {l}
            </MenuItem>
          ))}
        </TextField>
      </div>

      {loading ? (
        <div className={classes.empty}>
          <CircularProgress />
        </div>
      ) : movies.length ? (
        <Grid container direction="column" alignItems="center" spacing={2}>
          {movies.map(movie => (
            <Grid key={movie._id} item style={{ width: '100%' }}>
              <ResponsiveMovieCard movie={movie} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography className={classes.empty} variant="h6">
          No movies match your search.
        </Typography>
      )}
    </div>
  );
}

export default SearchPage;
