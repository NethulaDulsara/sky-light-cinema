import React, { useEffect, useMemo, useState } from 'react';
import { connect } from 'react-redux';
import {
  makeStyles,
  Grid,
  Typography,
  Select,
  MenuItem,
  FormControl
} from '@material-ui/core';
import MovieGridCard from '../components/MovieGridCard/MovieGridCard';
import { getMovies } from '../../../store/actions';

const CATEGORY_LABELS = {
  nowShowing: 'Now Showing',
  comingSoon: 'Coming Soon'
};

const HEAD_FONT = "'Poppins', 'Montserrat', sans-serif";

const useStyles = makeStyles(theme => ({
  page: {
    maxWidth: 1240,
    margin: '0 auto',
    padding: theme.spacing(0, 3, 10),
    width: '100%'
  },
  header: {
    textAlign: 'center',
    marginTop: theme.spacing(15),
    marginBottom: theme.spacing(4)
  },
  kicker: {
    fontFamily: HEAD_FONT,
    textTransform: 'uppercase',
    letterSpacing: 5,
    fontSize: '0.82rem',
    fontWeight: 600,
    color: theme.palette.primary.main
  },
  title: {
    fontFamily: HEAD_FONT,
    fontSize: '3.4rem',
    fontWeight: 800,
    lineHeight: 1.05,
    letterSpacing: '-1px',
    marginTop: theme.spacing(1.5),
    background: 'linear-gradient(180deg, #ffffff 0%, #9fd8ff 160%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    textShadow: '0 8px 40px rgba(0,198,255,0.12)'
  },
  accentBar: {
    width: 72,
    height: 4,
    borderRadius: 4,
    margin: `${theme.spacing(2.5)}px auto 0`,
    background: 'linear-gradient(135deg, #00C6FF 0%, #0072FF 100%)',
    boxShadow: '0 4px 14px rgba(0,114,255,0.5)'
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: theme.spacing(2),
    marginBottom: theme.spacing(4)
  },
  chips: { display: 'flex', flexWrap: 'wrap', gap: theme.spacing(1) },
  chip: {
    fontFamily: HEAD_FONT,
    cursor: 'pointer',
    padding: theme.spacing(0.6, 2),
    borderRadius: 999,
    fontSize: '0.82rem',
    fontWeight: 600,
    letterSpacing: '0.3px',
    textTransform: 'capitalize',
    color: 'rgba(255,255,255,0.75)',
    border: '1px solid rgba(255,255,255,0.14)',
    background: 'rgba(255,255,255,0.04)',
    transition: 'all .2s ease',
    '&:hover': { color: '#fff', borderColor: 'rgba(0,198,255,0.5)' }
  },
  chipActive: {
    color: '#fff',
    border: '1px solid transparent',
    background: 'linear-gradient(135deg, #00C6FF 0%, #0072FF 100%)',
    boxShadow: '0 6px 16px rgba(0,114,255,0.4)'
  },
  sortWrap: { display: 'flex', alignItems: 'center', gap: theme.spacing(1) },
  sortLabel: { color: 'rgba(255,255,255,0.55)', fontSize: '0.85rem' },
  select: {
    color: '#fff',
    fontSize: '0.88rem',
    fontWeight: 600,
    '&:before': { borderColor: 'rgba(255,255,255,0.2)' },
    '& .MuiSelect-icon': { color: 'rgba(255,255,255,0.7)' }
  },
  empty: { textAlign: 'center', opacity: 0.7, marginTop: theme.spacing(8) },
  [theme.breakpoints.down('xs')]: {
    title: { fontSize: '2.2rem' }
  }
}));

function MovieCategoryPage(props) {
  const { movies, getMovies } = props;
  const category = props.match.params.category;
  const classes = useStyles(props);
  const [genre, setGenre] = useState('all');
  const [sort, setSort] = useState('featured');

  useEffect(() => {
    if (!movies.length) getMovies();
  }, [movies, getMovies]);

  // Reset filters when switching between categories.
  useEffect(() => {
    setGenre('all');
    setSort('featured');
  }, [category]);

  const genres = useMemo(() => {
    const set = new Set();
    movies.forEach(m =>
      (m.genre || '')
        .split(',')
        .map(g => g.trim().toLowerCase())
        .filter(Boolean)
        .forEach(g => set.add(g))
    );
    return Array.from(set).sort();
  }, [movies]);

  const visible = useMemo(() => {
    let list = movies.filter(
      m => genre === 'all' || (m.genre || '').toLowerCase().includes(genre)
    );
    if (sort === 'title')
      list = [...list].sort((a, b) => a.title.localeCompare(b.title));
    else if (sort === 'duration')
      list = [...list].sort((a, b) => (a.duration || 0) - (b.duration || 0));
    else if (sort === 'rating')
      list = [...list].sort(
        (a, b) => (b.imdbRating || 0) - (a.imdbRating || 0)
      );
    return list;
  }, [movies, genre, sort]);

  if (!['nowShowing', 'comingSoon'].includes(category)) {
    return (
      <div className={classes.page}>
        <div className={classes.header}>
          <Typography className={classes.title} variant="h2">
            Category does not exist.
          </Typography>
        </div>
      </div>
    );
  }

  return (
    <div className={classes.page}>
      <div className={classes.header}>
        <Typography className={classes.kicker}>
          {category === 'comingSoon' ? 'On the way' : 'In cinemas'}
        </Typography>
        <Typography className={classes.title} variant="h2">
          {CATEGORY_LABELS[category]}
        </Typography>
        <div className={classes.accentBar} />
      </div>

      {movies.length > 0 && (
        <div className={classes.controls}>
          <div className={classes.chips}>
            <span
              className={`${classes.chip} ${
                genre === 'all' ? classes.chipActive : ''
              }`}
              onClick={() => setGenre('all')}>
              All
            </span>
            {genres.map(g => (
              <span
                key={g}
                className={`${classes.chip} ${
                  genre === g ? classes.chipActive : ''
                }`}
                onClick={() => setGenre(g)}>
                {g}
              </span>
            ))}
          </div>

          <div className={classes.sortWrap}>
            <span className={classes.sortLabel}>Sort by</span>
            <FormControl>
              <Select
                className={classes.select}
                value={sort}
                onChange={e => setSort(e.target.value)}
                MenuProps={{ PaperProps: { style: { background: '#121725', color: '#fff' } } }}>
                <MenuItem value="featured">Featured</MenuItem>
                <MenuItem value="title">Title (A–Z)</MenuItem>
                <MenuItem value="duration">Duration</MenuItem>
                <MenuItem value="rating">IMDb Rating</MenuItem>
              </Select>
            </FormControl>
          </div>
        </div>
      )}

      {visible.length === 0 ? (
        <Typography className={classes.empty} variant="h6">
          No movies match this filter.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {visible.map(movie => (
            <Grid key={movie._id} item xs={6} sm={4} md={3} lg={3}>
              <MovieGridCard movie={movie} category={category} />
            </Grid>
          ))}
        </Grid>
      )}
    </div>
  );
}

const mapStateToProps = ({ movieState }, ownProps) => ({
  movies: movieState[ownProps.match.params.category] || []
});

const mapDispatchToProps = { getMovies };

export default connect(mapStateToProps, mapDispatchToProps)(MovieCategoryPage);
