import React, { Component } from 'react';
import {
  withStyles,
  Typography,
  CircularProgress,
  Chip
} from '@material-ui/core';
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive';

const styles = theme => ({
  root: { padding: theme.spacing(4), color: '#fff', minHeight: '100vh' },
  title: { fontWeight: 800, marginBottom: theme.spacing(1) },
  sub: { color: '#94a3b8', marginBottom: theme.spacing(4) },
  card: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 12,
    padding: theme.spacing(3),
    marginBottom: theme.spacing(3)
  },
  movieRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(2)
  },
  movieName: { fontWeight: 700, fontSize: '1.15rem', textTransform: 'capitalize' },
  countChip: {
    background: 'linear-gradient(135deg, #00C6FF 0%, #0072FF 100%)',
    color: '#fff',
    fontWeight: 700
  },
  emails: { display: 'flex', flexWrap: 'wrap', gap: theme.spacing(1) },
  emailChip: {
    background: 'rgba(0,198,255,0.08)',
    border: '1px solid rgba(0,198,255,0.2)',
    color: '#bfe9ff'
  },
  empty: { color: '#94a3b8', marginTop: theme.spacing(6), textAlign: 'center' }
});

class NotifyRequests extends Component {
  state = { list: [], loading: true };

  async componentDidMount() {
    try {
      const token = localStorage.getItem('jwtToken');
      const res = await fetch('/notify', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const list = res.ok ? await res.json() : [];
      this.setState({ list, loading: false });
    } catch (e) {
      this.setState({ loading: false });
    }
  }

  groupByMovie() {
    const groups = {};
    this.state.list.forEach(entry => {
      const movie = entry.movieId;
      const id = movie ? movie._id : 'unknown';
      if (!groups[id]) {
        groups[id] = {
          title: movie ? movie.title : 'Unknown / removed movie',
          emails: []
        };
      }
      groups[id].emails.push(entry.email);
    });
    return Object.values(groups).sort((a, b) => b.emails.length - a.emails.length);
  }

  render() {
    const { classes } = this.props;
    const { loading, list } = this.state;
    const groups = this.groupByMovie();

    return (
      <div className={classes.root}>
        <Typography variant="h4" className={classes.title}>
          Watchlist / Notify Requests
        </Typography>
        <Typography className={classes.sub}>
          People waiting to be notified when upcoming movies go on sale
          {list.length ? ` — ${list.length} total signups` : ''}.
        </Typography>

        {loading ? (
          <CircularProgress />
        ) : groups.length === 0 ? (
          <Typography className={classes.empty}>
            No notify requests yet.
          </Typography>
        ) : (
          groups.map((g, i) => (
            <div className={classes.card} key={i}>
              <div className={classes.movieRow}>
                <span className={classes.movieName}>{g.title}</span>
                <Chip
                  className={classes.countChip}
                  size="small"
                  icon={<NotificationsActiveIcon style={{ color: '#fff' }} />}
                  label={`${g.emails.length} waiting`}
                />
              </div>
              <div className={classes.emails}>
                {g.emails.map((e, j) => (
                  <Chip key={j} size="small" label={e} className={classes.emailChip} />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    );
  }
}

export default withStyles(styles)(NotifyRequests);
