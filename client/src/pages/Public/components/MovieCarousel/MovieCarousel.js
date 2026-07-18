import React from 'react';
import classnames from 'classnames';
import { Link } from 'react-router-dom';
import { makeStyles, Typography, Button } from '@material-ui/core';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { ArrowBackIos, ArrowForwardIos } from '@material-ui/icons';
import MovieCardSimple from '../MovieCardSimple/MovieCardSimple';
import CinemaCard from '../CinemaCard/CinemaCard';
import styles from './styles';

const useStyles = makeStyles(styles);

function NextArrow(props) {
  const { currentSlide, slideCount, onClick } = props;
  const classes = useStyles({ currentSlide, slideCount });
  return (
    <div className={classnames(classes.arrow, 'nextArrow')} onClick={onClick}>
      <ArrowForwardIos color="inherit" fontSize="large" />
    </div>
  );
}

function PrevArrow(props) {
  const { currentSlide, onClick } = props;
  const classes = useStyles({ currentSlide });
  return (
    <div className={classnames(classes.arrow, 'prevArrow')} onClick={onClick}>
      <ArrowBackIos color="inherit" fontSize="large" />
    </div>
  );
}

function MovieCarousel({ carouselClass, movies = [], title, to = null, type = 'movie' }) {
  const classes = useStyles();
  const settings = {
    centerMode: false,
    infinite: movies.length > 4,
    speed: 500,
    slidesToShow: 4,
    swipeToSlide: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1600,
        settings: {
          slidesToShow: 3,
          infinite: movies.length > 3
        }
      },
      {
        breakpoint: 1250,
        settings: {
          slidesToShow: 2,
          infinite: movies.length > 2
        }
      },
      {
        breakpoint: 750,
        settings: {
          slidesToShow: 1,
          infinite: movies.length > 1
        }
      }
    ]
  };
  // Remove the early return so the title is always visible
  // if (!movies.length) return null;
  return (
    <div className={carouselClass}>
      <div className={classes.container}>
        <Typography className={classes.h2} variant="h2" color="inherit">
          {title}
        </Typography>
        {to==null? null
           :
          <Link to={to} style={{ textDecoration: 'none' }}>
          <Button className={classes.button} color="primary">
            Explore All
          </Button>
        </Link>
      }
      </div>
      {movies.length > 0 ? (
        <Slider {...settings} className={classes.slider}>
          {movies.map((movie, i) => (
            type === 'cinema' ? (
              <CinemaCard key={movie._id} cinema={movie} />
            ) : (
              <MovieCardSimple key={movie._id} movie={movie} index={i} ifupcoming={title === 'Coming Soon'} />
            )
          ))}
        </Slider>
      ) : (
        <div style={{ textAlign: 'center', padding: '50px 0', color: 'rgba(255,255,255,0.6)' }}>
          <Typography variant="h4">No movies available right now.</Typography>
          <Typography variant="subtitle1">Check back later for updates!</Typography>
        </div>
      )}
    </div>
  );
}
export default MovieCarousel;
