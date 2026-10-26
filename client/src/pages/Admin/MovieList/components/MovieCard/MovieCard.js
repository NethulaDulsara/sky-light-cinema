import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { makeStyles } from '@material-ui/core';
import { Typography } from '@material-ui/core';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import TheatersIcon from '@material-ui/icons/TheatersOutlined';
import { Paper } from '../../../../../components';

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: '100%',
    cursor: 'pointer',
    position: 'relative',
    borderRadius: '18px',
    overflow: 'hidden',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    backgroundColor: 'rgba(17, 24, 39, 0.85)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    '&:hover': {
      transform: 'translateY(-6px)',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6), 0 0 30px rgba(0, 198, 255, 0.2)',
      borderColor: 'rgba(0, 198, 255, 0.4)',
      '& $image': {
        transform: 'scale(1.05)'
      }
    }
  },
  imageWrapper: {
    height: '220px',
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#0a0d14'
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.4s ease'
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
    background: 'linear-gradient(180deg, transparent 0%, rgba(17, 24, 39, 0.95) 100%)'
  },
  genreBadge: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    background: 'rgba(0, 0, 0, 0.75)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(0, 198, 255, 0.3)',
    color: '#00C6FF',
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '11px',
    fontWeight: 700,
    letterSpacing: '0.5px',
    textTransform: 'uppercase'
  },
  details: {
    padding: theme.spacing(2.5, 3, 1)
  },
  title: {
    fontSize: '18px',
    fontWeight: 700,
    lineHeight: '24px',
    color: '#ffffff',
    textTransform: 'capitalize'
  },
  description: {
    fontSize: '13px',
    lineHeight: '18px',
    height: '36px',
    overflow: 'hidden',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    color: '#94a3b8',
    marginTop: theme.spacing(1)
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing(1.5, 3, 2),
    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
    marginTop: theme.spacing(1.5)
  },
  duration: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    color: '#64748b',
    fontSize: '12px',
    fontWeight: 500
  },
  durationIcon: {
    fontSize: '16px',
    color: '#00C6FF'
  },
  editHint: {
    color: '#00C6FF',
    fontSize: '12px',
    fontWeight: 600
  }
}));

function MovieCard(props) {
  const classes = useStyles(props);
  const { className, movie } = props;

  const rootClassName = classNames(classes.root, className);
  const genreFirst = movie.genre ? movie.genre.split(',')[0].trim() : 'Movie';

  const getImageUrl = (image) => {
    let url = '';
    if (image && image.startsWith('/uploads')) {
      url = `http://localhost:8080${image}`;
    } else if (image) {
      url = image;
    } else {
      url = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80';
    }
    return encodeURI(url);
  };

  return (
    <Paper className={rootClassName}>
      <div className={classes.imageWrapper}>
        <img
          alt={movie.title}
          className={classes.image}
          src={getImageUrl(movie.image)}
        />
        <div className={classes.imageOverlay} />
        <span className={classes.genreBadge}>{genreFirst}</span>
      </div>

      <div className={classes.details}>
        <Typography className={classes.title} variant="h6">
          {movie.title}
        </Typography>
        <Typography className={classes.description} variant="body2">
          {movie.description}
        </Typography>
      </div>

      <div className={classes.footer}>
        <div className={classes.duration}>
          <AccessTimeIcon className={classes.durationIcon} />
          <span>{movie.duration} mins</span>
        </div>
        <span className={classes.editHint}>Click to Edit →</span>
      </div>
    </Paper>
  );
}

MovieCard.propTypes = {
  movie: PropTypes.object.isRequired
};

export default MovieCard;
