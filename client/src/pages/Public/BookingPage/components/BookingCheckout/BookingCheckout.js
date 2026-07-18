import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Typography, Button } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  footer: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    width: '100%',
    backgroundColor: '#151532',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(2, 4),
    boxShadow: '0 -4px 12px rgba(0,0,0,0.3)',
    zIndex: 10
  },
  legendBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing(4),
    marginBottom: theme.spacing(2)
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '12px',
    color: '#fff',
    fontWeight: 600
  },
  legendBox: {
    width: '16px',
    height: '16px',
    borderRadius: '4px',
    marginRight: '8px'
  },
  buttonRow: {
    display: 'flex',
    gap: theme.spacing(2),
    justifyContent: 'center',
    width: '100%'
  },
  backButton: {
    border: '2px solid #fff',
    color: '#fff',
    backgroundColor: 'transparent',
    padding: '10px 40px',
    fontWeight: 700,
    width: '160px',
    '&:hover': {
      backgroundColor: 'rgba(255,255,255,0.1)'
    }
  },
  proceedButton: {
    backgroundColor: '#fff',
    color: '#151532',
    padding: '10px 40px',
    fontWeight: 800,
    width: '160px',
    '&:hover': {
      backgroundColor: '#e6e6e6'
    }
  },
  proceedDisabled: {
    backgroundColor: '#fff !important',
    color: '#151532 !important',
    opacity: 0.5
  }
}));

export default function BookingCheckout(props) {
  const classes = useStyles(props);
  const { selectedSeats, onBookSeats, onHideSeatSelection, ticketCount } = props;

  const isProceedDisabled = selectedSeats !== ticketCount;

  return (
    <Box className={classes.footer}>
      {/* Legend */}
      <div className={classes.legendBar}>
        <div className={classes.legendItem}>
          <div className={classes.legendBox} style={{ backgroundColor: '#00cc66' }}></div>
          Selected
        </div>
        <div className={classes.legendItem}>
          <div className={classes.legendBox} style={{ border: '1px solid rgba(255,255,255,0.4)' }}></div>
          Available
        </div>
        <div className={classes.legendItem}>
          <div className={classes.legendBox} style={{ backgroundColor: '#e63946' }}></div>
          Occupied
        </div>
        <div className={classes.legendItem}>
          <div className={classes.legendBox} style={{ backgroundColor: '#4a4a5a' }}></div>
          Unavailable
        </div>
      </div>

      {/* Buttons */}
      <div className={classes.buttonRow}>
        <Button className={classes.backButton} onClick={onHideSeatSelection}>
          BACK
        </Button>
        <Button 
          classes={{ root: classes.proceedButton, disabled: classes.proceedDisabled }}
          onClick={onBookSeats}
          disabled={isProceedDisabled}
        >
          PROCEED
        </Button>
      </div>
    </Box>
  );
}
