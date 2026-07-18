import React from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';

const useStyles = makeStyles(theme => ({
  card: {
    maxWidth: 400,
    margin: '0 auto',
    backgroundColor: '#1a1a3a',
    borderRadius: 12,
    color: theme.palette.common.white,
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)',
    transition: 'transform 0.2s',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 12px 30px rgba(0, 229, 255, 0.4)'
    }
  },
  media: {
    height: 400,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    borderRadius: '12px 12px 0 0'
  },
  content: {
    padding: theme.spacing(2),
    backgroundColor: '#1a1a3a',
    borderTop: '2px solid rgba(255,255,255,0.1)'
  },
  h5: {
    textTransform: 'capitalize',
    fontWeight: 600,
    fontSize: '1.2rem',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  }
}));

const MovieCardSimple = props => {
  const classes = useStyles();
  const { movie } = props;
  const images ={eternals:'https://phantom-marca.unidadeditorial.es/927e619e34b67b9e7326c9266914e6f0/crop/68x0/1311x700/resize/1320/f/jpg/assets/multimedia/imagenes/2021/08/20/16294695683527.jpg','spider man-no way home':'https://images.indianexpress.com/2021/11/spider-man-no-way-home-new-poster-1200.jpg','avengers-infinity war':'https://pyxis.nymag.com/v1/imgs/8b3/ac6/ca28ec3072fdc00a5b59a72a75a39ab61b-20-avengers-lede.rsquare.w700.jpg','doctor strange-multiverse of madness':'https://m.media-amazon.com/images/I/818x-d2qUuL.jpg','wakanda forever':'https://thumbor.forbes.com/thumbor/fit-in/1200x0/filters%3Aformat%28jpg%29/https%3A%2F%2Fblogs-images.forbes.com%2Fscottmendelson%2Ffiles%2F2017%2F10%2FDMQuyI5V4AAUHP0.jpg'};
  
  const getImageUrl = (image) => {
    if (!image) return images[movie.title];
    if (image.startsWith('/uploads')) {
      return `http://localhost:8080${image}`;
    }
    return image;
  };

  return (
    <Link to={movie.linkUrl ? movie.linkUrl : `movie/${movie._id}`} style={{ textDecoration: 'none' }}>
      <Card className={classes.card}>
        <CardActionArea>
          <CardMedia
            className={classes.media}
            image={getImageUrl(movie.image)}
            title={movie.title}
          />
          <CardContent className={classes.content}>
            <Typography
              className={classes.h5}
              gutterBottom
              variant="h5"
              component="h2"
              color="inherit">
              {movie.title}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Link>
  );
};

MovieCardSimple.propTypes = {
  movie: PropTypes.object.isRequired
};
export default MovieCardSimple;
