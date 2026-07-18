import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Box } from '@material-ui/core';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';

const useStyles = makeStyles(theme => ({
  banner: {
    display: 'flex',
    alignItems: 'center',
    background: 'linear-gradient(to right, #f2f2f5, #d2d4dc)',
    padding: theme.spacing(2, 4),
    width: '100%',
    color: '#000'
  },
  poster: {
    height: '100px',
    width: '70px',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    borderRadius: '4px',
    marginRight: theme.spacing(3),
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  titleRow: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(0.5)
  },
  title: {
    fontSize: '28px',
    fontWeight: 800,
    textTransform: 'uppercase',
    color: '#080824',
    letterSpacing: '1px',
    marginRight: theme.spacing(2)
  },
  subtitle: {
    fontSize: '14px',
    color: '#333',
    fontWeight: 500,
    textTransform: 'capitalize'
  }
}));

export default function MovieInfo(props) {
  const classes = useStyles(props);
  const { movie } = props;
  const images = {
    eternals: 'https://phantom-marca.unidadeditorial.es/927e619e34b67b9e7326c9266914e6f0/crop/68x0/1311x700/resize/1320/f/jpg/assets/multimedia/imagenes/2021/08/20/16294695683527.jpg',
    'spider man-no way home': 'https://images.indianexpress.com/2021/11/spider-man-no-way-home-new-poster-1200.jpg',
    'avengers-infinity war': 'https://pyxis.nymag.com/v1/imgs/8b3/ac6/ca28ec3072fdc00a5b59a72a75a39ab61b-20-avengers-lede.rsquare.w700.jpg',
    'doctor strange-multiverse of madness': 'https://m.media-amazon.com/images/I/818x-d2qUuL.jpg',
    'wakanda forever': 'https://thumbor.forbes.com/thumbor/fit-in/1200x0/filters%3Aformat%28jpg%29/https%3A%2F%2Fblogs-images.forbes.com%2Fscottmendelson%2Ffiles%2F2017%2F10%2FDMQuyI5V4AAUHP0.jpg'
  };

  if (!movie) return <h1>Movie Loading...</h1>;

  const imageUrl = movie.image ? (movie.image.startsWith('/uploads') ? `http://localhost:8080${movie.image}` : movie.image) : images[movie.title];
  const durationStr = movie.duration ? `${Math.floor(movie.duration / 60)}h ${movie.duration % 60}min` : '';

  return (
    <Box className={classes.banner}>
      <div
        className={classes.poster}
        style={{
          backgroundImage: `url("${imageUrl}")`
        }}
      />
      <div className={classes.details}>
        <div className={classes.titleRow}>
          <Typography className={classes.title}>{movie.title}</Typography>
          <KeyboardArrowDownIcon style={{ color: '#080824' }} />
        </div>
        <Typography className={classes.subtitle}>
          {movie.genre}{durationStr ? `, ${durationStr}` : ''} | Digital 3D, Digital 2D
        </Typography>
      </div>
    </Box>
  );
}
