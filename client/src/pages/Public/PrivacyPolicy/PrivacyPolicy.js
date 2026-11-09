import React from 'react';
import { makeStyles, Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: 820,
    margin: '0 auto',
    padding: theme.spacing(14, 3, 10)
  },
  h1: { fontSize: '2.4rem', fontWeight: 700, marginBottom: theme.spacing(2) },
  updated: { opacity: 0.6, marginBottom: theme.spacing(4) },
  h2: { fontSize: '1.3rem', fontWeight: 700, marginTop: theme.spacing(4), marginBottom: theme.spacing(1) },
  p: { lineHeight: 1.7, marginBottom: theme.spacing(2) }
}));

function PrivacyPolicy() {
  const classes = useStyles();
  return (
    <main className={classes.root}>
      <Typography className={classes.h1} variant="h1" component="h1">
        Privacy Policy
      </Typography>
      <Typography className={classes.updated} variant="body2">
        Last updated: {new Date().getFullYear()}
      </Typography>

      <Typography className={classes.p}>
        Sky Light Cinema ("we") respects your privacy. This policy explains what
        data we collect when you browse movies and book tickets, why we collect
        it, and the choices you have — in line with the GDPR and similar laws.
      </Typography>

      <Typography className={classes.h2} variant="h2">Information we collect</Typography>
      <Typography className={classes.p}>
        When you make a booking we collect the contact details you provide (name,
        email, phone), the seats and showtime you choose, and the payment status
        returned by our payment provider. We do not store your full card details;
        card payments are processed by our payment gateway.
      </Typography>

      <Typography className={classes.h2} variant="h2">How we use it</Typography>
      <Typography className={classes.p}>
        We use your data to create and manage your booking, send your ticket and
        check-in QR code, process refunds and cancellations, and — in aggregate,
        anonymised form — to understand which screenings are popular.
      </Typography>

      <Typography className={classes.h2} variant="h2">Cookies</Typography>
      <Typography className={classes.p}>
        We use strictly necessary browser storage to keep you signed in and to
        hold your selected seats during checkout. Analytics or non-essential
        cookies are only set if you accept them in the cookie banner. You can
        change your choice at any time by clearing your browser storage.
      </Typography>

      <Typography className={classes.h2} variant="h2">Your rights</Typography>
      <Typography className={classes.p}>
        You can request access to, correction of, or deletion of your personal
        data, and you can delete your own account from your dashboard. To exercise
        any of these rights, contact us via the details on our contact page.
      </Typography>
    </main>
  );
}

export default PrivacyPolicy;
