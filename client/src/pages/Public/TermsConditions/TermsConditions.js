import React from 'react';
import { makeStyles, Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: { maxWidth: 860, margin: '0 auto', padding: theme.spacing(14, 3, 10) },
  h1: { fontSize: '2.4rem', fontWeight: 800, marginBottom: theme.spacing(1) },
  updated: { opacity: 0.6, marginBottom: theme.spacing(4) },
  h2: {
    fontSize: '1.15rem',
    fontWeight: 700,
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(1),
    color: '#00C6FF'
  },
  p: { lineHeight: 1.75, marginBottom: theme.spacing(2), opacity: 0.92 }
}));

const SECTIONS = [
  ['1. Acceptance of Terms', 'By using this website, or by clicking a box that states that you accept or agree to these terms, you signify your agreement to these Terms & Conditions. If you do not agree, please do not use this website.'],
  ['2. Use of the Website', 'This website is for your personal, non-commercial use only. You may not use it for any unlawful or harmful purpose. We may update these terms at any time by posting a revised version on this page, so please review it regularly.'],
  ['3. Payments', 'All payments are governed by the terms and conditions of your bank or card issuer, over whose payment gateway we have no control. We do not store your full card details. All prices are shown in LKR and include applicable taxes such as VAT.'],
  ['4. All Sales Are Final', 'Tickets are sold subject to availability. Except as provided by our published refund and cancellation policy, bookings may not be cancelled, exchanged or amended for reasons including change of date or time, partial attendance, or lost tickets. Please verify your booking details before paying.'],
  ['5. Cancellations & Refunds', 'Where our refund policy allows, cancellations made before the showtime cut-off are refunded to the original payment method. If a screening is cancelled by the cinema due to unavoidable circumstances, valid ticket holders will be refunded.'],
  ['6. At the Cinema', 'You are responsible for carrying your original booking confirmation (and QR code) to the theatre. No outside food or beverage is permitted on the premises. The cinema may refuse admission in line with the certification/age rating of a film.'],
  ['7. Availability', 'We may modify, suspend or discontinue any part of the website at any time, with or without notice, and we do not guarantee uninterrupted access.'],
  ['8. Governing Law', 'These Terms & Conditions are governed by the laws of the Republic of Sri Lanka.']
];

function TermsConditions() {
  const classes = useStyles();
  return (
    <main className={classes.root}>
      <Typography className={classes.h1} variant="h1" component="h1">
        Terms &amp; Conditions
      </Typography>
      <Typography className={classes.updated} variant="body2">
        Last updated: {new Date().getFullYear()}
      </Typography>
      {SECTIONS.map(([h, body]) => (
        <section key={h}>
          <Typography className={classes.h2} variant="h2" component="h2">{h}</Typography>
          <Typography className={classes.p}>{body}</Typography>
        </section>
      ))}
    </main>
  );
}

export default TermsConditions;
