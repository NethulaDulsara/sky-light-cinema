import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Card, CardContent, Grid, Typography, Avatar } from '@material-ui/core';
import EventIcon from '@material-ui/icons/Event';

const useStyles = makeStyles(theme => ({
  root: {
    height: '100%',
    background: 'rgba(255, 255, 255, 0.03)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    borderRadius: '16px',
    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 12px 40px 0 rgba(0, 0, 0, 0.5)',
    }
  },
  content: {
    alignItems: 'center',
    display: 'flex'
  },
  title: {
    fontWeight: 700,
    color: 'rgba(255,255,255,0.7)',
    letterSpacing: '1px'
  },
  value: {
    fontWeight: 800,
    color: '#fff',
    marginTop: theme.spacing(1)
  },
  avatar: {
    background: 'linear-gradient(135deg, #F9D423 0%, #FF4E50 100%)',
    height: 56,
    width: 56,
    boxShadow: '0 4px 20px 0 rgba(255, 78, 80, 0.4)'
  },
  icon: {
    height: 32,
    width: 32,
    color: '#fff'
  }
}));

const TotalReservations = props => {
  const { className, reservations } = props;

  const classes = useStyles();

  return (
    <Card className={classnames(classes.root, className)}>
      <CardContent>
        <Grid container justify="space-between">
          <Grid item>
            <Typography
              className={classes.title}
              gutterBottom
              variant="body2">
              TOTAL RESERVATIONS
            </Typography>
            <Typography className={classes.value} variant="h3">
              {reservations}
            </Typography>
          </Grid>
          <Grid item>
            <Avatar className={classes.avatar}>
              <EventIcon className={classes.icon} />
            </Avatar>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

TotalReservations.propTypes = {
  className: PropTypes.string
};

export default TotalReservations;
