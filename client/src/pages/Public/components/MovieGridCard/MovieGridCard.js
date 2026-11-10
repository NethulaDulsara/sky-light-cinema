import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { makeStyles, Typography, Button } from '@material-ui/core';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import { getPosterUrl, onPosterError } from '../../../../utils/poster';
import NotifyButton from '../NotifyButton/NotifyButton';

const useStyles = makeStyles(theme => ({
  card: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    borderRadius: 14,
    overflow: 'hidden',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    transition: 'transform .25s ease, box-shadow .25s ease, border-color .25s ease',
    '&:hover': {
      transform: 'translateY(-6px)',
      borderColor: 'rgba(0,198,255,0.45)',
      boxShadow: '0 18px 40px rgba(0,0,0,0.5)'
    },
    '&:hover $posterImg': { transform: 'scale(1.06)' },
    '&:hover $overlayBtn': { opacity: 1, transform: 'translateY(0)' }
  },
  posterWrap: {
    position: 'relative',
    width: '100%',
    paddingTop: '150%', // 2:3 poster ratio
    overflow: 'hidden',
    backgroundColor: '#0c1022'
  },
  posterImg: {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: 'center',
    transition: 'transform .35s ease'
  },
  posterLink: { position: 'absolute', inset: 0, zIndex: 1 },
  posterScrim: {
    position: 'absolute',
    inset: 0,
    zIndex: 1,
    pointerEvents: 'none',
    background:
      'linear-gradient(to top, rgba(10,14,23,0.92) 0%, rgba(10,14,23,0.15) 38%, rgba(10,14,23,0) 62%)'
  },
  ratingChip: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 2,
    padding: theme.spacing(0.3, 1),
    borderRadius: 999,
    fontSize: '0.72rem',
    fontWeight: 700,
    color: '#fff',
    background: 'rgba(0,0,0,0.6)',
    backdropFilter: 'blur(4px)'
  },
  overlayBtn: {
    position: 'absolute',
    zIndex: 2,
    bottom: 12,
    left: 12,
    right: 12,
    opacity: 0,
    transform: 'translateY(8px)',
    transition: 'opacity .25s ease, transform .25s ease',
    borderRadius: 999,
    fontWeight: 700,
    letterSpacing: '0.3px',
    backgroundColor: '#00a0ee',
    color: '#fff',
    boxShadow: '0 2px 8px rgba(0, 160, 238, 0.25)',
    '&:hover': { backgroundColor: '#008cd1' }
  },
  body: {
    padding: theme.spacing(1.75, 1.75, 2),
    display: 'flex',
    flexDirection: 'column',
    gap: 6
  },
  title: {
    fontSize: '1.02rem',
    fontWeight: 700,
    lineHeight: 1.25,
    color: '#fff',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    minHeight: '2.5em'
  },
  meta: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    color: 'rgba(255,255,255,0.6)',
    fontSize: '0.8rem'
  },
  durationChip: {
    padding: theme.spacing(0.2, 1),
    borderRadius: 6,
    border: '1px solid rgba(0,198,255,0.35)',
    color: '#9fe4ff',
    fontWeight: 600
  },
  genre: {
    textTransform: 'capitalize',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  link: { textDecoration: 'none', display: 'block' }
}));

function MovieGridCard({ movie, category }) {
  const classes = useStyles();
  const isComingSoon = category === 'comingSoon';
  const firstGenres = (movie.genre || '')
    .split(',')
    .map(g => g.trim())
    .filter(Boolean)
    .slice(0, 2)
    .join(' • ');

  return (
    <div className={classes.card}>
      <div className={classes.posterWrap}>
        <img
          className={classes.posterImg}
          src={getPosterUrl(movie.image)}
          alt={`${movie.title} poster`}
          onError={onPosterError}
        />
        <div className={classes.posterScrim} />
        <Link
          to={`/movie/${movie._id}`}
          className={classes.posterLink}
          aria-label={movie.title}
        />
        {movie.certification ? (
          <span className={classes.ratingChip}>{movie.certification}</span>
        ) : null}
        <Button
          className={classes.overlayBtn}
          component={Link}
          to={isComingSoon ? `/movie/${movie._id}` : `/movie/booking/${movie._id}`}
          startIcon={!isComingSoon ? <PlayArrowIcon /> : null}>
          {isComingSoon ? 'View Details' : 'Book Now'}
        </Button>
      </div>

      <div className={classes.body}>
        <Link to={`/movie/${movie._id}`} className={classes.link}>
          <Typography className={classes.title}>{movie.title}</Typography>
        </Link>
        <div className={classes.meta}>
          {movie.duration ? (
            <span className={classes.durationChip}>{movie.duration} min</span>
          ) : null}
          {firstGenres ? <span className={classes.genre}>{firstGenres}</span> : null}
        </div>
        {isComingSoon && (
          <div style={{ marginTop: 10 }}>
            <NotifyButton movie={movie} fullWidth />
          </div>
        )}
      </div>
    </div>
  );
}

MovieGridCard.propTypes = {
  movie: PropTypes.object.isRequired,
  category: PropTypes.string
};

export default MovieGridCard;
