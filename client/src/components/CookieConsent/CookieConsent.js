import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { makeStyles, Button, Typography } from '@material-ui/core';

const STORAGE_KEY = 'cookieConsent';

const useStyles = makeStyles(theme => ({
  banner: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 2000,
    backgroundColor: '#11121f',
    color: '#fff',
    padding: theme.spacing(2, 3),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing(2),
    flexWrap: 'wrap',
    boxShadow: '0 -4px 20px rgba(0,0,0,0.35)'
  },
  text: { fontSize: 14, maxWidth: 680, lineHeight: 1.5 },
  link: { color: '#00C6FF', textDecoration: 'underline' },
  actions: { display: 'flex', gap: theme.spacing(1.5) },
  accept: { backgroundColor: '#00C6FF', color: '#07203a', fontWeight: 700 },
  reject: { color: '#fff', borderColor: 'rgba(255,255,255,0.4)' }
}));

function readConsent() {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch (e) {
    return null;
  }
}

function writeConsent(value) {
  try {
    localStorage.setItem(STORAGE_KEY, value);
  } catch (e) {
    /* storage unavailable — banner simply reappears next visit */
  }
}

function CookieConsent() {
  const classes = useStyles();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!readConsent()) setVisible(true);
  }, []);

  const choose = value => () => {
    writeConsent(value);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className={classes.banner}
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent">
      <Typography className={classes.text}>
        We use strictly necessary storage to keep you signed in and hold your
        seats during checkout. With your consent we also use cookies to measure
        how the site is used. See our{' '}
        <Link to="/privacy" className={classes.link}>
          Privacy Policy
        </Link>
        .
      </Typography>
      <div className={classes.actions}>
        <Button
          variant="outlined"
          className={classes.reject}
          onClick={choose('rejected')}>
          Reject non-essential
        </Button>
        <Button
          variant="contained"
          className={classes.accept}
          onClick={choose('accepted')}>
          Accept all
        </Button>
      </div>
    </div>
  );
}

export default CookieConsent;
