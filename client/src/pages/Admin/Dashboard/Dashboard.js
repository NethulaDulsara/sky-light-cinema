import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles, Grid, Typography } from '@material-ui/core';
import auditoriumBg from '../../../assets/auditorium.jpg';
import {
  TotalUsers,
  TotalCinemas,
  TotalMovies,
  TotalReservations,
  BestMovies,
  UsersByDevice
} from './components';
import {
  getUsers,
  getCinemas,
  getMovies,
  getReservations
} from '../../../store/actions';

const styles = theme => ({
  root: {
    boxSizing: 'border-box',
    width: '100%',
    padding: theme.spacing(4),
    position: 'relative',
    minHeight: `calc(100vh - ${theme.topBar.height})`,
    color: theme.palette.common.white,
    backgroundImage: `linear-gradient(135deg, rgba(8, 12, 26, 0.72) 0%, rgba(6, 9, 20, 0.80) 50%, rgba(8, 12, 24, 0.75) 100%), radial-gradient(circle at 85% 25%, rgba(0, 160, 238, 0.18) 0%, transparent 55%), url(${auditoriumBg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center top',
    backgroundRepeat: 'no-repeat',
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(2)
    }
  },
  header: {
    marginBottom: theme.spacing(5),
    textAlign: 'left',
  },
  greeting: {
    fontWeight: 800,
    background: 'linear-gradient(45deg, #00a0ee 30%, #38bdf8 90%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    letterSpacing: '1px'
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: theme.spacing(1),
    fontWeight: 500
  }
});

const KpiCard = ({ label, value, accent }) => (
  <div
    style={{
      background: 'rgba(13, 17, 30, 0.65)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      borderRadius: 14,
      padding: '20px 22px',
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.35)'
    }}>
    <div style={{ fontSize: 13, opacity: 0.7, textTransform: 'uppercase', letterSpacing: 1 }}>
      {label}
    </div>
    <div style={{ fontSize: 28, fontWeight: 800, marginTop: 6, color: accent || '#fff' }}>
      {value}
    </div>
  </div>
);

const lkr = n =>
  'LKR ' + Number(n || 0).toLocaleString('en-US', { maximumFractionDigits: 0 });

class Dashboard extends Component {
  state = { analytics: null };

  componentDidMount() {
    this.props.getUsers();
    this.props.getCinemas();
    this.props.getMovies();
    this.props.getReservations();
    this.fetchAnalytics();
  }

  fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      const res = await fetch('/analytics', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) this.setState({ analytics: await res.json() });
    } catch (e) {
      /* non-fatal */
    }
  };

  getBestMovies = (reservations, movies, total = 5) => {
    if (!reservations || !reservations.length || !movies || !movies.length) {
      return [];
    }
    const reservationCounter = reservations.map(reservation => ({
      movieId: reservation.movieId,
      count: reservations.filter(r => r.movieId === reservation.movieId).length
    }));

    const result = [];
    const map = new Map();
    for (const item of reservationCounter) {
      if (item.movieId && !map.has(item.movieId)) {
        map.set(item.movieId, true); // set any value to Map
        result.push({
          movieId: item.movieId,
          count: item.count
        });
      }
    }
    return result
      .sort((a, b) => b.count - a.count)
      .slice(0, total)
      .map(res => ({
        movie: movies.find(movie => String(movie._id) === String(res.movieId)),
        count: res.count
      }))
      .filter(item => item && item.movie && item.movie.title);
  };

  render() {
    const { classes, users, cinemas, movies, reservations } = this.props;
    const { analytics } = this.state;

    return (
      <div className={classes.root}>
        <div className={classes.header}>
          <Typography variant="h3" className={classes.greeting}>
            Admin Overview
          </Typography>
          <Typography variant="subtitle1" className={classes.subtitle}>
            Welcome back! Here's what's happening today.
          </Typography>
        </div>

        {analytics && (
          <Grid container spacing={4} style={{ marginBottom: 8 }}>
            <Grid item lg={3} sm={6} xs={12}>
              <KpiCard label="Total Revenue" value={lkr(analytics.totalRevenue)} accent="#4ade80" />
            </Grid>
            <Grid item lg={3} sm={6} xs={12}>
              <KpiCard label="Tickets Sold" value={analytics.ticketsSold} accent="#60a5fa" />
            </Grid>
            <Grid item lg={3} sm={6} xs={12}>
              <KpiCard label="Occupancy" value={`${analytics.occupancy.toFixed(1)}%`} accent="#f59e0b" />
            </Grid>
            <Grid item lg={3} sm={6} xs={12}>
              <KpiCard label="Avg Order Value" value={lkr(analytics.avgOrderValue)} accent="#c084fc" />
            </Grid>
            {analytics.byFormat && Object.keys(analytics.byFormat).length > 0 && (
              <Grid item xs={12}>
                <div
                  style={{
                    background: 'rgba(13, 17, 30, 0.65)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: 14,
                    padding: '18px 22px',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.35)'
                  }}>
                  <div style={{ fontSize: 13, opacity: 0.7, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>
                    Revenue by Format
                  </div>
                  <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap' }}>
                    {Object.entries(analytics.byFormat).map(([fmt, v]) => (
                      <div key={fmt}>
                        <div style={{ fontSize: 15, fontWeight: 700 }}>{fmt}</div>
                        <div style={{ fontSize: 13, opacity: 0.8 }}>
                          {lkr(v.revenue)} · {v.tickets} tickets
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Grid>
            )}
          </Grid>
        )}

        <Grid container spacing={4}>
          <Grid item lg={3} sm={6} xl={3} xs={12}>
            <TotalUsers users={users.length} />
          </Grid>
          <Grid item lg={3} sm={6} xl={3} xs={12}>
            <TotalCinemas cinemas={cinemas.length} />
          </Grid>
          <Grid item lg={3} sm={6} xl={3} xs={12}>
            <TotalMovies movies={movies.length} />
          </Grid>
          <Grid item lg={3} sm={6} xl={3} xs={12}>
            <TotalReservations reservations={reservations.length} />
          </Grid>
          <Grid item lg={8} md={12} xl={9} xs={12}>
            <BestMovies
              bestMovies={this.getBestMovies(reservations, movies, 5)}
            />
          </Grid>
          <Grid item lg={4} md={6} xl={3} xs={12}>
            <UsersByDevice />
          </Grid>
        </Grid>
      </div>
    );
  }
}

const mapStateToProps = ({
  userState,
  cinemaState,
  movieState,
  reservationState
}) => ({
  users: userState.users,
  cinemas: cinemaState.cinemas,
  movies: movieState.movies,
  reservations: reservationState.reservations
});
const mapDispatchToProps = {
  getUsers,
  getCinemas,
  getMovies,
  getReservations
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Dashboard));
