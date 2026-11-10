import React from 'react';
import PropTypes from 'prop-types';
import { Typography, Button, IconButton } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import ConfirmationNumberIcon from '@material-ui/icons/ConfirmationNumber';
import { getPosterUrl, onPosterError } from '../../../../utils/poster';
import { youTubeId } from '../../../../utils/youtube';
import NotifyButton from '../NotifyButton/NotifyButton';

const useStyles = makeStyles(theme => ({
  wrapper: { padding: theme.spacing(0, 1), textAlign: 'center' },
  card: {
    position: 'relative',
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#0c1022',
    boxShadow: '0 10px 28px rgba(0,0,0,0.45)',
    '&:hover $poster': { filter: 'blur(3px) brightness(0.4)', transform: 'scale(1.05)' },
    '&:hover $overlay': { opacity: 1 }
  },
  posterWrap: {
    position: 'relative',
    width: '100%',
    paddingTop: '150%',
    overflow: 'hidden'
  },
  poster: {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: 'center',
    transition: 'filter .35s ease, transform .35s ease'
  },
  overlay: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing(1.5),
    opacity: 0,
    transition: 'opacity .3s ease',
    background: 'rgba(5,7,12,0.35)'
  },
  playBtn: {
    color: '#fff',
    border: '2px solid rgba(255,255,255,0.85)',
    background: 'rgba(0,0,0,0.25)',
    width: 62,
    height: 62,
    transition: 'transform .2s ease, background .2s ease, border-color .2s ease',
    '&:hover': {
      transform: 'scale(1.1)',
      borderColor: '#00C6FF',
      background: 'rgba(0,198,255,0.2)'
    }
  },
  watchLabel: {
    color: '#fff',
    fontWeight: 700,
    fontSize: '0.95rem',
    letterSpacing: '0.5px'
  },
  overlayBuy: {
    color: '#00C6FF',
    fontWeight: 700,
    fontSize: '0.9rem',
    letterSpacing: '0.5px',
    textDecoration: 'none',
    cursor: 'pointer',
    '&:hover': { textDecoration: 'underline' }
  },
  title: {
    marginTop: theme.spacing(2),
    fontSize: '1.05rem',
    fontWeight: 700,
    color: '#fff',
    textTransform: 'capitalize',
    display: '-webkit-box',
    WebkitLineClamp: 1,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    '&:hover': { color: '#00C6FF' }
  },
  meta: {
    marginTop: theme.spacing(0.75),
    color: '#5bc4ff',
    fontSize: '0.82rem',
    fontWeight: 600,
    letterSpacing: '0.2px'
  },
  buyBtn: {
    marginTop: theme.spacing(1.5),
    minWidth: 150,
    borderRadius: 6,
    padding: theme.spacing(0.9, 3),
    fontWeight: 700,
    letterSpacing: '0.5px',
    backgroundColor: '#00a0ee',
    color: '#fff',
    boxShadow: '0 2px 8px rgba(0, 160, 238, 0.25)',
    '&:hover': {
      backgroundColor: '#008cd1',
      boxShadow: '0 4px 12px rgba(0, 160, 238, 0.35)'
    }
  },
  disabledBtn: {
    marginTop: theme.spacing(1.5),
    minWidth: 150,
    borderRadius: 6,
    padding: theme.spacing(0.9, 2),
    fontWeight: 700,
    letterSpacing: '0.5px',
    color: 'rgba(255,255,255,0.55)',
    backgroundColor: 'rgba(255,255,255,0.08)'
  },
  link: { textDecoration: 'none' }
}));

const formatDuration = mins => {
  if (!mins) return '';
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  const parts = [];
  if (h) parts.push(`${h} HR`);
  if (m) parts.push(`${m} MIN`);
  return parts.join(' ');
};

const formatGenres = genre =>
  (genre || '')
    .split(',')
    .map(g => g.trim())
    .filter(Boolean)
    .slice(0, 3)
    .map(g => g.charAt(0).toUpperCase() + g.slice(1))
    .join(', ');

const MovieCardSimple = props => {
  const classes = useStyles();
  const { movie, onPlayTrailer, ifupcoming, hasShowtimes } = props;

  const hasTrailer = Boolean(youTubeId(movie.trailerUrl));
  const bookable = !ifupcoming && hasShowtimes !== false;
  const bookingTo = `/movie/booking/${movie._id}`;

  const metaBits = [formatDuration(movie.duration), formatGenres(movie.genre)]
    .filter(Boolean)
    .join(' | ');

  return (
    <div className={classes.wrapper}>
      <div className={classes.card}>
        <div className={classes.posterWrap}>
          <img
            className={classes.poster}
            src={getPosterUrl(movie.image)}
            alt={`${movie.title} poster`}
            onError={onPosterError}
          />
          <div className={classes.overlay}>
            {hasTrailer && (
              <>
                <IconButton
                  className={classes.playBtn}
                  aria-label={`Play ${movie.title} trailer`}
                  onClick={() => onPlayTrailer && onPlayTrailer(movie)}>
                  <PlayArrowIcon style={{ fontSize: 34 }} />
                </IconButton>
                <span className={classes.watchLabel}>Watch Trailer</span>
              </>
            )}
            {bookable && (
              <Link to={bookingTo} className={classes.overlayBuy}>
                Buy Tickets
              </Link>
            )}
          </div>
        </div>
      </div>

      <Link to={`/movie/${movie._id}`} className={classes.link}>
        <Typography className={classes.title}>{movie.title}</Typography>
      </Link>
      {metaBits ? <div className={classes.meta}>{metaBits}</div> : null}

      {bookable ? (
        <Button
          className={classes.buyBtn}
          component={Link}
          to={bookingTo}
          startIcon={<ConfirmationNumberIcon />}>
          Buy Tickets
        </Button>
      ) : ifupcoming ? (
        <div style={{ marginTop: 12, display: 'inline-block' }}>
          <NotifyButton movie={movie} />
        </div>
      ) : (
        <Button className={classes.disabledBtn} disabled>
          Tickets Not Available
        </Button>
      )}
    </div>
  );
};

MovieCardSimple.propTypes = {
  movie: PropTypes.object.isRequired,
  onPlayTrailer: PropTypes.func,
  ifupcoming: PropTypes.bool,
  hasShowtimes: PropTypes.bool
};

export default MovieCardSimple;
