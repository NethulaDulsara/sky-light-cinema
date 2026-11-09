import React from 'react';
import { makeStyles, Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: { maxWidth: 860, margin: '0 auto', padding: theme.spacing(14, 3, 10) },
  h1: { fontSize: '2.4rem', fontWeight: 800, marginBottom: theme.spacing(1) },
  updated: { opacity: 0.6, marginBottom: theme.spacing(4) },
  p: { lineHeight: 1.75, marginBottom: theme.spacing(2.5), opacity: 0.92 }
}));

function Disclaimer() {
  const classes = useStyles();
  return (
    <main className={classes.root}>
      <Typography className={classes.h1} variant="h1" component="h1">
        Disclaimer
      </Typography>
      <Typography className={classes.updated} variant="body2">
        Last updated: {new Date().getFullYear()}
      </Typography>

      <Typography className={classes.p}>
        The information, showtimes, pricing and content on this website are provided
        for general booking purposes and are believed to be accurate at the time of
        publishing. Sky Light Cinema makes no warranties, express or implied, about
        the completeness, accuracy or availability of any information on the site.
      </Typography>
      <Typography className={classes.p}>
        Screening times, formats and prices are subject to change without notice.
        While we make every effort to honour published showtimes, screenings may be
        rescheduled or cancelled due to circumstances beyond our control; in such
        cases, valid ticket holders will be refunded in line with our policy.
      </Typography>
      <Typography className={classes.p}>
        Film posters, trailers, images and titles are the property of their
        respective studios and rights holders and are used here for the purpose of
        identifying the films being screened. Trailers are embedded from third-party
        services and are subject to those providers’ terms.
      </Typography>
      <Typography className={classes.p}>
        Payments are processed by third-party payment gateways. Sky Light Cinema is
        not responsible for any issue arising from your bank or card provider, and
        does not store your full card details.
      </Typography>
      <Typography className={classes.p}>
        To the fullest extent permitted by law, Sky Light Cinema shall not be liable
        for any loss or damage arising from the use of, or reliance on, this website.
      </Typography>
    </main>
  );
}

export default Disclaimer;
