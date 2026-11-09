import React, { useEffect, useState } from 'react';
import classnames from 'classnames';
import { Link } from 'react-router-dom';
import {
  makeStyles,
  Typography,
  Button,
  Dialog,
  IconButton
} from '@material-ui/core';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { ArrowBackIos, ArrowForwardIos } from '@material-ui/icons';
import CloseIcon from '@material-ui/icons/Close';
import MovieCardSimple from '../MovieCardSimple/MovieCardSimple';
import CinemaCard from '../CinemaCard/CinemaCard';
import { youTubeId } from '../../../../utils/youtube';
import styles from './styles';

const useStyles = makeStyles(styles);

function NextArrow(props) {
  const { currentSlide, slideCount, onClick, infinite } = props;
  const classes = useStyles({ currentSlide, slideCount, infinite });
  return (
    <div className={classnames(classes.arrow, 'nextArrow')} onClick={onClick}>
      <ArrowForwardIos color="inherit" fontSize="large" />
    </div>
  );
}

function PrevArrow(props) {
  const { currentSlide, onClick, infinite } = props;
  const classes = useStyles({ currentSlide, infinite });
  return (
    <div className={classnames(classes.arrow, 'prevArrow')} onClick={onClick}>
      <ArrowBackIos color="inherit" fontSize="large" />
    </div>
  );
}

function MovieCarousel({
  carouselClass,
  movies = [],
  title,
  to = null,
  type = 'movie',
  autoplay = false,
  autoplaySpeed = 3000
}) {
  const classes = useStyles();
  const [trailer, setTrailer] = useState(null); // { id, title }
  const [showtimeMovieIds, setShowtimeMovieIds] = useState(null);

  // Fetch which movies actually have showtimes (for the Buy Tickets state).
  useEffect(() => {
    if (type !== 'movie') return;
    let active = true;
    fetch('/showtimes')
      .then(res => res.json())
      .then(data => {
        if (!active) return;
        setShowtimeMovieIds(new Set((data || []).map(s => s.movieId)));
      })
      .catch(() => setShowtimeMovieIds(new Set()));
    return () => {
      active = false;
    };
  }, [type]);

  const openTrailer = movie => {
    const id = youTubeId(movie.trailerUrl);
    if (id) setTrailer({ id, title: movie.title });
  };
  const closeTrailer = () => setTrailer(null);

  const isAutoplay = Boolean(autoplay && movies.length > 1);
  let displayMovies = movies;
  if (isAutoplay && movies.length < 9) {
    while (displayMovies.length < 12) {
      displayMovies = [...displayMovies, ...movies];
    }
  }

  const isInfinite = isAutoplay || movies.length > 5;

  const settings = {
    centerMode: true,
    centerPadding: '0px',
    infinite: isInfinite,
    autoplay: isAutoplay,
    autoplaySpeed: autoplaySpeed,
    speed: 800,
    pauseOnHover: true,
    slidesToShow: 5,
    slidesToScroll: 1,
    swipeToSlide: true,
    nextArrow: <NextArrow infinite={isInfinite} />,
    prevArrow: <PrevArrow infinite={isInfinite} />,
    responsive: [
      {
        breakpoint: 1600,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: isAutoplay || movies.length > 3
        }
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          centerPadding: '48px',
          slidesToScroll: 1,
          infinite: isAutoplay || movies.length > 1
        }
      }
    ]
  };

  return (
    <div className={carouselClass}>
      <div className={classes.container}>
        <Typography className={classes.h2} variant="h2" color="inherit">
          {title}
        </Typography>
        {to == null ? null : (
          <Link to={to} style={{ textDecoration: 'none' }}>
            <Button className={classes.button} color="primary">
              Explore All
            </Button>
          </Link>
        )}
      </div>
      {movies.length > 0 ? (
        <Slider {...settings} className={classes.slider}>
          {displayMovies.map((movie, i) =>
            type === 'cinema' ? (
              <CinemaCard key={`${movie._id}-${i}`} cinema={movie} />
            ) : (
              <MovieCardSimple
                key={`${movie._id}-${i}`}
                movie={movie}
                index={i}
                ifupcoming={title === 'Coming Soon'}
                onPlayTrailer={openTrailer}
                hasShowtimes={
                  showtimeMovieIds ? showtimeMovieIds.has(movie._id) : true
                }
              />
            )
          )}
        </Slider>
      ) : (
        <div
          style={{
            textAlign: 'center',
            padding: '50px 0',
            color: 'rgba(255,255,255,0.6)'
          }}>
          <Typography variant="h4">No movies available right now.</Typography>
          <Typography variant="subtitle1">Check back later for updates!</Typography>
        </div>
      )}

      <Dialog
        open={Boolean(trailer)}
        onClose={closeTrailer}
        maxWidth="md"
        fullWidth
        PaperProps={{ className: classes.trailerPaper }}>
        <IconButton
          aria-label="Close trailer"
          className={classes.trailerClose}
          onClick={closeTrailer}>
          <CloseIcon />
        </IconButton>
        {trailer && (
          <div className={classes.trailerFrameWrap}>
            <iframe
              className={classes.trailerFrame}
              src={`https://www.youtube.com/embed/${trailer.id}?autoplay=1&rel=0`}
              title={`${trailer.title} trailer`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}
      </Dialog>
    </div>
  );
}
export default MovieCarousel;
