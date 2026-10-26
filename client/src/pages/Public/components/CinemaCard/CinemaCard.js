import React from 'react';
import PropTypes from 'prop-types';
import { Typography, Card, CardActionArea, CardContent, CardMedia } from '@material-ui/core';
import LocationOnIcon from '@material-ui/icons/LocationOnOutlined';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  card: {
    maxWidth: 400,
    margin: '0 auto',
    backgroundColor: 'rgba(17, 24, 39, 0.85)',
    backgroundImage: 'linear-gradient(145deg, rgba(25, 34, 53, 0.6) 0%, rgba(13, 18, 30, 0.8) 100%)',
    borderRadius: 18,
    border: '1px solid rgba(255, 255, 255, 0.08)',
    boxShadow: '0 12px 36px 0 rgba(0, 0, 0, 0.45)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    overflow: 'hidden',
    '&:hover': {
      transform: 'translateY(-8px)',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6), 0 0 30px rgba(0, 198, 255, 0.2)',
      borderColor: 'rgba(0, 198, 255, 0.4)',
      '& $media': {
        transform: 'scale(1.05)'
      }
    }
  },
  mediaWrapper: {
    height: 220,
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#0a0d14'
  },
  media: {
    width: '100%',
    height: '100%',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    transition: 'transform 0.4s ease'
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    background: 'linear-gradient(180deg, transparent 0%, rgba(17, 24, 39, 0.95) 100%)'
  },
  content: {
    padding: theme.spacing(2.5, 3),
    color: '#ffffff'
  },
  name: {
    textTransform: 'capitalize',
    fontWeight: 700,
    fontSize: '18px',
    color: '#f8fafc',
    marginBottom: '6px'
  },
  cityBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    color: '#00C6FF',
    background: 'rgba(0, 198, 255, 0.08)',
    border: '1px solid rgba(0, 198, 255, 0.2)',
    padding: '3px 10px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: 600,
    textTransform: 'capitalize'
  }
}));

const CinemaCard = ({ cinema }) => {
  const classes = useStyles();

  const getImageUrl = image => {
    if (!image) return 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=600&q=80';
    if (image.startsWith('/uploads')) {
      return `http://localhost:8080${image}`;
    }
    return image;
  };

  const displayName = cinema.name || cinema.title || 'Cinema Hall';

  return (
    <Link to={cinema.linkUrl || `/cinemas/${cinema._id}`} style={{ textDecoration: 'none' }}>
      <Card className={classes.card}>
        <CardActionArea>
          <div className={classes.mediaWrapper}>
            <CardMedia
              className={classes.media}
              image={getImageUrl(cinema.image)}
              title={displayName}
            />
            <div className={classes.imageOverlay} />
          </div>
          <CardContent className={classes.content}>
            <Typography className={classes.name} variant="h6">
              {displayName}
            </Typography>
            {cinema.city && (
              <span className={classes.cityBadge}>
                <LocationOnIcon style={{ fontSize: '14px' }} />
                {cinema.city}
              </span>
            )}
          </CardContent>
        </CardActionArea>
      </Card>
    </Link>
  );
};

CinemaCard.propTypes = {
  cinema: PropTypes.object.isRequired
};

export default CinemaCard;
