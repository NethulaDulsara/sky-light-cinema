import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles, Box, Grid } from '@material-ui/core';
import {
  getMovies,
  getShowtimes,
  getMovieSuggestion,
  getCinemas
} from '../../../store/actions';
import MovieCarousel from '../components/MovieCarousel/MovieCarousel';
import HeroBanner from '../components/HeroBanner/HeroBanner';
import Experiences from '../components/Experiences/Experiences';
import Offers from '../components/Offers/Offers';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import styles from './styles';

class HomePage extends Component {
  state = { heroIds: [] };

  componentDidMount() {
    const {
      movies,
      showtimes,
      suggested,
      cinemas,
      getMovies,
      getShowtimes,
      getMovieSuggestion,
      getCinemas,
      user
    } = this.props;
    if (!movies.length) getMovies();
    if (!cinemas.length) getCinemas();
    if (!showtimes.length) getShowtimes();
    if (user) {
      if (!suggested.length) getMovieSuggestion(user.username);
    }
    // Admin-chosen featured movies for the hero slider.
    fetch('/settings')
      .then(res => res.json())
      .then(data => this.setState({ heroIds: data.heroMovieIds || [] }))
      .catch(() => {});
  }

  componentDidUpdate(prevProps) {
    if (this.props.user !== prevProps.user) {
      this.props.user &&
        this.props.getMovieSuggestion(this.props.user.username);
    }
  }

  render() {
    const {
      classes,
      movies,
      comingSoon,
      nowShowing,
      suggested,
      cinemas
    } = this.props;

    const bannerSettings = {
      dots: true,
      infinite: true,
      speed: 1000,
      autoplay: true,
      autoplaySpeed: 3000,
      slidesToShow: 1,
      slidesToScroll: 1,
      pauseOnHover: false,
      arrows: false
    };

    const { heroIds } = this.state;
    const heroMovies =
      heroIds && heroIds.length
        ? heroIds.map(id => movies.find(m => m._id === id)).filter(Boolean)
        : movies;

    return (
      <Fragment>
        {heroMovies && heroMovies.length > 0 && (
          <Slider {...bannerSettings}>
            {heroMovies.map(movie => (
              <div key={movie._id}>
                <HeroBanner movie={movie} height="85vh" />
              </div>
            ))}
          </Slider>
        )}
        <Box height={60} />

        <MovieCarousel
          carouselClass={classes.carousel}
          title="Now Showing"
          to="/movie/category/nowShowing"
          movies={nowShowing}
          autoplay={true}
          autoplaySpeed={3000}
        />
        <MovieCarousel
          carouselClass={classes.carousel}
          title="Coming Soon"
          to="/movie/category/comingSoon"
          movies={comingSoon}
          autoplay={true}
          autoplaySpeed={3500}
        />
        {cinemas && cinemas.length > 0 && (
          <div className={classes.cinemaSection}>
            <MovieCarousel
              carouselClass={classes.carousel}
              title="Featured Cinemas"
              type="cinema"
              to="/cinemas"
              movies={cinemas.map(c => ({
                ...c,
                title: c.name,
                image: c.image,
                linkUrl: '/cinemas'
              }))}
            />
          </div>
        )}
        <Experiences />
        <Offers />
        {false && (
          <Grid container style={{ height: 500 }}>
            <Grid item xs={7} style={{ background: '#131334' }}></Grid>
            <Grid item xs={5} style={{ background: '#010025' }}></Grid>
          </Grid>
        )}
      </Fragment>
    );
  }
}

HomePage.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  movies: PropTypes.array.isRequired,
  latestMovies: PropTypes.array.isRequired
};

const mapStateToProps = ({ movieState, showtimeState, cinemaState, authState }) => ({
  movies: movieState.movies,
  randomMovie: movieState.randomMovie,
  latestMovies: movieState.latestMovies,
  comingSoon: movieState.comingSoon,
  nowShowing: movieState.nowShowing,
  showtimes: showtimeState.showtimes,
  suggested: movieState.suggested,
  cinemas: cinemaState.cinemas,
  user: authState.user
});

const mapDispatchToProps = { getMovies, getShowtimes, getMovieSuggestion, getCinemas };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(HomePage));
