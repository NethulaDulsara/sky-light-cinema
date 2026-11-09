import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { makeStyles, Typography, Button } from '@material-ui/core';
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive';
import { getPosterUrl, onPosterError } from '../../../../../utils/poster';

const useStyles = makeStyles(theme => ({
  heading: {
    fontSize: '3rem',
    lineHeight: '3rem',
    textAlign: 'center',
    textTransform: 'capitalize',
    marginTop: theme.spacing(8),
    marginBottom: theme.spacing(3),
    color: '#fff'
  },
  empty: {
    textAlign: 'center',
    color: 'rgba(255,255,255,0.55)',
    marginBottom: theme.spacing(2)
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
    gap: theme.spacing(2)
  },
  item: {
    display: 'flex',
    gap: theme.spacing(1.5),
    padding: theme.spacing(1.25),
    borderRadius: 12,
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)'
  },
  poster: {
    width: 56,
    height: 84,
    objectFit: 'cover',
    borderRadius: 8,
    flexShrink: 0,
    backgroundColor: '#0c1022'
  },
  info: { display: 'flex', flexDirection: 'column', justifyContent: 'center', minWidth: 0 },
  title: {
    fontWeight: 700,
    textTransform: 'capitalize',
    color: '#fff',
    textDecoration: 'none',
    lineHeight: 1.25,
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  status: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    color: '#5bc4ff',
    fontSize: '0.78rem',
    fontWeight: 600,
    margin: '4px 0'
  },
  remove: { alignSelf: 'flex-start', color: '#f87171', textTransform: 'none', padding: 0, minWidth: 0 }
}));

export default function MyWatchlist() {
  const classes = useStyles();
  const [items, setItems] = useState([]);

  const load = () => {
    const token = localStorage.getItem('jwtToken');
    if (!token) return;
    fetch('/notify/mine', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => (res.ok ? res.json() : []))
      .then(data => setItems((data || []).filter(i => i.movieId)))
      .catch(() => {});
  };

  useEffect(() => {
    load();
  }, []);

  const remove = async id => {
    const token = localStorage.getItem('jwtToken');
    try {
      await fetch(`/notify/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      setItems(prev => prev.filter(i => i._id !== id));
    } catch (e) {
      /* ignore */
    }
  };

  return (
    <>
      <Typography className={classes.heading} variant="h2">
        My Watchlist
      </Typography>
      {!items.length ? (
        <Typography className={classes.empty}>
          You're not waiting on any upcoming movies yet. Add one from{' '}
          <Link to="/movie/category/comingSoon" style={{ color: '#00C6FF' }}>
            Coming Soon
          </Link>
          .
        </Typography>
      ) : (
        <div className={classes.grid}>
          {items.map(entry => {
        const movie = entry.movieId;
        return (
          <div className={classes.item} key={entry._id}>
            <img
              className={classes.poster}
              src={getPosterUrl(movie.image)}
              alt={`${movie.title} poster`}
              onError={onPosterError}
            />
            <div className={classes.info}>
              <Link to={`/movie/${movie._id}`} className={classes.title}>
                {movie.title}
              </Link>
              <span className={classes.status}>
                <NotificationsActiveIcon style={{ fontSize: 15 }} /> Notify when tickets open
              </span>
              <Button
                className={classes.remove}
                size="small"
                onClick={() => remove(entry._id)}>
                Remove
              </Button>
            </div>
          </div>
            );
          })}
        </div>
      )}
    </>
  );
}
