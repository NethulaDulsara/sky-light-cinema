import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Card, CardContent, Grid, Typography, Avatar } from '@material-ui/core';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import TheatersIcon from '@material-ui/icons/Theaters';

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
    background: 'linear-gradient(135deg, #FF416C 0%, #FF4B2B 100%)',
    height: 56,
    width: 56,
    boxShadow: '0 4px 20px 0 rgba(255, 75, 43, 0.4)'
  },
  icon: {
    height: 32,
    width: 32,
    color: '#fff'
  },
  difference: {
    marginTop: theme.spacing(2),
    display: 'flex',
    alignItems: 'center'
  },
  differenceIcon: {
    color: '#ff1744'
  },
  differenceValue: {
    color: '#ff1744',
    marginRight: theme.spacing(1),
    fontWeight: 'bold'
  },
  caption: {
    color: 'rgba(255,255,255,0.5)'
  }
}));

const TotalCinemas = props => {
  const { className, cinemas } = props;

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
              TOTAL CINEMAS
            </Typography>
            <Typography className={classes.value} variant="h3">{cinemas}</Typography>
          </Grid>
          <Grid item>
            <Avatar className={classes.avatar}>
              <TheatersIcon className={classes.icon} />
            </Avatar>
          </Grid>
        </Grid>
        <div className={classes.difference}>
          <ArrowDownwardIcon className={classes.differenceIcon} />
          <Typography className={classes.differenceValue} variant="body2">
            16%
          </Typography>
          <Typography className={classes.caption} variant="caption">
            Since last month
          </Typography>
        </div>
      </CardContent>
    </Card>
  );
};

TotalCinemas.propTypes = {
  className: PropTypes.string
};

export default TotalCinemas;
