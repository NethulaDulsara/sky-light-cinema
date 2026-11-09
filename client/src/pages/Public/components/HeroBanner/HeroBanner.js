import React from 'react';
import { Link } from 'react-router-dom';
import { Typography, Button } from '@material-ui/core';
import { textTruncate } from '../../../../utils';
import { getPosterUrl, onPosterError, POSTER_PLACEHOLDER } from '../../../../utils/poster';
import useStyles from './styles';

const buildBackdrop = image => {
  let url = '';
  if (image && image.startsWith('/uploads')) url = `http://localhost:8080${image}`;
  else if (image) url = image;
  if (!url) return `url("${POSTER_PLACEHOLDER}")`;
  return `url("${encodeURI(url)}"), url("${POSTER_PLACEHOLDER}")`;
};

const formatDuration = mins => {
  if (!mins) return '';
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h ? `${h}h ` : ''}${m ? `${m}m` : ''}`.trim();
};

function HeroBanner({ movie, height }) {
  const classes = useStyles({ height });
  if (!movie) return null;

  const genres = (movie.genre || '')
    .split(',')
    .map(g => g.trim())
    .filter(Boolean)
    .slice(0, 4);

  return (
    <div className={classes.hero}>
      <div
        className={classes.backdrop}
        style={{ backgroundImage: buildBackdrop(movie.image) }}
      />
      <div className={classes.scrim} />

      <div className={classes.inner}>
        <div className={classes.content}>
          <Link to={`/movie/${movie._id}`} className={classes.posterLink}>
            <img
              className={classes.poster}
              src={getPosterUrl(movie.image)}
              alt={`${movie.title} poster`}
              onError={onPosterError}
            />
          </Link>

          <div className={classes.details}>
            <Typography className={classes.title} variant="h1" component="h1">
              <Link to={`/movie/${movie._id}`} className={classes.titleLink}>
                {movie.title}
              </Link>
            </Typography>

            <Typography className={classes.description}>
              {textTruncate(movie.description, 220)}
            </Typography>

            {genres.length > 0 && (
              <div className={classes.genres}>
                {genres.map((g, i) => (
                  <span className={classes.chip} key={i}>
                    {g}
                  </span>
                ))}
              </div>
            )}

            <div className={classes.meta}>
              <span>{movie.certification || 'NR'}</span>
              {movie.duration ? (
                <>
                  <span className={classes.dot}>•</span>
                  <span>{formatDuration(movie.duration)}</span>
                </>
              ) : null}
              {movie.language ? (
                <>
                  <span className={classes.dot}>•</span>
                  <span className={classes.lang}>{movie.language}</span>
                </>
              ) : null}
            </div>
          </div>
        </div>

        <div className={classes.footer}>
          <div className={classes.footerInfo}>
            <Typography className={classes.footerPrimary}>
              Now showing at Sky Light Cinema
            </Typography>
            <Typography className={classes.footerSecondary}>
              Dolby Atmos&nbsp;&nbsp;•&nbsp;&nbsp;4K Digital Projection
            </Typography>
          </div>
          <Button
            className={classes.buyBtn}
            component={Link}
            to={`/movie/booking/${movie._id}`}>
            Buy Tickets
          </Button>
        </div>
      </div>
    </div>
  );
}

export default HeroBanner;
