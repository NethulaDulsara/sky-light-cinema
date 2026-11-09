import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { makeStyles, Grid, Typography, Container } from '@material-ui/core';
import { Redirect } from 'react-router-dom';
import {
  getMovies,
  getMyReservations,
  getCinemas,
  cancelReservation
} from '../../../store/actions';
import { MyReservationTable } from './components';
import MyWatchlist from './components/MyWatchlist/MyWatchlist';
import Account from '../../Admin/Account';

const useStyles = makeStyles(theme => ({
  title: {
    fontSize: '3rem',
    lineHeight: '3rem',
    textAlign: 'center',
    textTransform: 'capitalize',
    marginTop: theme.spacing(15),
    marginBottom: theme.spacing(3)
  },
  [theme.breakpoints.down('sm')]: {
    fullWidth: { width: '100%' }
  }
}));

function MyDashboard(props) {
  const {
    user,
    reservations,
    movies,
    cinemas,
    getMovies,
    getMyReservations,
    getCinemas,
    cancelReservation
  } = props;

  useEffect(() => {
    getMovies();
    getMyReservations();
    getCinemas();
  }, [getMovies, getMyReservations, getCinemas]);

  const classes = useStyles(props);

  // This dashboard is for signed-in users; guests are sent to login.
  if (!user) return <Redirect to="/login" />;

  // The /reservations/mine endpoint already scopes to this user.
  const myReservations = reservations;

  const handleCancel = async reservation => {
    const msg =
      reservation.paymentStatus === 'paid'
        ? 'Cancel this booking? Eligible bookings are refunded automatically.'
        : 'Cancel this booking?';
    if (window.confirm(msg)) {
      await cancelReservation(reservation._id);
      getMyReservations(); // refresh this user's own list
    }
  };

  return (
    <Container>
      <Grid container spacing={2}>
        {!!myReservations.length && (
          <>
            <Grid item xs={12}>
              <Typography
                className={classes.title}
                variant="h2"
                color="inherit">
                My Reservations
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <MyReservationTable
                reservations={myReservations}
                movies={movies}
                cinemas={cinemas}
                onCancel={handleCancel}
              />
            </Grid>
          </>
        )}
        <Grid item xs={12}>
          <MyWatchlist />
        </Grid>
        <Grid item xs={12}>
          <Typography className={classes.title} variant="h2" color="inherit">
            My Account
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Account />
        </Grid>
      </Grid>
    </Container>
  );
}

const mapStateToProps = ({
  authState,
  movieState,
  reservationState,
  cinemaState
}) => ({
  user: authState.user,
  movies: movieState.movies,
  reservations: reservationState.reservations,
  cinemas: cinemaState.cinemas
});

const mapDispatchToProps = { getMovies, getMyReservations, getCinemas, cancelReservation };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MyDashboard);
