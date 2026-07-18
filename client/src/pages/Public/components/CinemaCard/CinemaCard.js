import React from 'react';
import PropTypes from 'prop-types';
import { Typography, Card, CardActionArea, CardContent, CardMedia } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  card: {
    maxWidth: 400,
    margin: '0 auto',
    backgroundColor: '#fff',
    borderRadius: 16,
    color: '#010025',
    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.5)',
    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
    '&:hover': {
      transform: 'translateY(-10px)',
      boxShadow: '0 12px 40px 0 rgba(0, 229, 255, 0.6)',
    }
  },
  media: {
    height: 300,
    backgroundSize: 'contain',
    backgroundPosition: 'center',
    backgroundColor: '#fff',
    borderRadius: '16px 16px 0 0'
  },
  content: {
    padding: theme.spacing(2),
    backgroundColor: '#010025',
    color: '#fff',
    textAlign: 'center'
  },
  h5: {
    textTransform: 'capitalize',
    fontWeight: 700,
    letterSpacing: '1px'
  }
}));

const CinemaCard = ({ cinema }) => {
  const classes = useStyles();

  const getImageUrl = (image) => {
    if (!image) return 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c';
    if (image.startsWith('/uploads')) {
      return `http://localhost:8080${image}`;
    }
    return image;
  };

  return (
    <Link to={cinema.linkUrl || `/cinemas/${cinema._id}`} style={{ textDecoration: 'none' }}>
      <Card className={classes.card}>
        <CardActionArea>
          <CardMedia
            className={classes.media}
            image={getImageUrl(cinema.image)}
            title={cinema.title}
          />
          <CardContent className={classes.content}>
            <Typography
              className={classes.h5}
              gutterBottom
              variant="h5"
              component="h2"
              color="inherit"
            >
              {cinema.title}
            </Typography>
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
