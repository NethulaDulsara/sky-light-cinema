import React, { Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Typography, IconButton, Button } from '@material-ui/core';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import CreateIcon from '@material-ui/icons/Create';

const useStyles = makeStyles(theme => ({
  topBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#35297e',
    padding: theme.spacing(1, 4),
    color: '#fff'
  },
  backButton: {
    color: '#f6b83f',
    fontSize: '14px',
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    textTransform: 'uppercase'
  },
  timeHighlight: {
    backgroundColor: '#fff',
    color: '#000',
    padding: '8px 16px',
    borderRadius: '4px',
    fontWeight: 800,
    fontSize: '14px',
    marginLeft: theme.spacing(4)
  },
  ticketInfo: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer'
  },
  pricingBar: {
    textAlign: 'center',
    padding: theme.spacing(2),
    borderBottom: '1px solid #1a1a3a',
    fontSize: '12px',
    color: '#9ba0b5'
  },
  seatMapContainer: {
    padding: theme.spacing(6, 2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  row: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing(1),
    width: '100%'
  },
  rowLabel: {
    color: '#fff',
    fontWeight: 600,
    width: '40px',
    textAlign: 'center',
    fontSize: '12px'
  },
  seat: {
    cursor: 'pointer',
    borderRadius: '7px',
    padding: '6px',
    margin: '0 4px',
    fontSize: '10px',
    fontWeight: 600,
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid rgba(255,255,255,0.35)',
    color: '#fff',
    transition: 'all 0.18s ease',
    outline: 'none',
    '&:hover': {
      borderColor: '#00C6FF',
      backgroundColor: 'rgba(0,198,255,0.12)',
      transform: 'translateY(-1px)'
    },
    '&:focus-visible': {
      borderColor: '#00C6FF',
      boxShadow: '0 0 0 2px rgba(0,198,255,0.6)'
    }
  },
  seatOccupied: {
    backgroundColor: '#e63946',
    borderColor: '#e63946',
    color: '#fff',
    cursor: 'not-allowed',
    '&:hover': { transform: 'none', backgroundColor: '#e63946', borderColor: '#e63946' }
  },
  seatSelected: {
    backgroundColor: '#00cc66',
    borderColor: '#00cc66',
    color: '#fff',
    boxShadow: '0 0 12px rgba(0,204,102,0.55)',
    '&:hover': { backgroundColor: '#00cc66', borderColor: '#00cc66' }
  },
  seatUnavailable: {
    backgroundColor: '#4a4a5a',
    borderColor: '#4a4a5a',
    color: '#ccc',
    cursor: 'not-allowed'
  },
  screenGraphic: {
    marginTop: theme.spacing(10),
    width: '80%',
    maxWidth: '800px',
    height: '40px',
    borderBottom: '6px solid #f6b83f',
    borderRadius: '50%',
    textAlign: 'center',
    color: '#fff',
    fontWeight: 800,
    fontSize: '14px',
    lineHeight: '60px',
    position: 'relative',
    boxShadow: '0 10px 20px rgba(0,0,0,0.5)'
  },
  screenOverlay: {
    position: 'absolute',
    bottom: '-12px',
    left: '0',
    width: '100%',
    height: '10px',
    background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.2), transparent)'
  }
}));

export default function BookingSeats(props) {
  const classes = useStyles(props);
  const { seats, cinema, selectedTime, ticketCount, onHideSeatSelection, onSelectSeat } = props;

  // Render seats with styles:
  // 0 = Available
  // 1 = Occupied (Reserved)
  // 2 = Selected
  // 3 = Recommended (Fallback to selected or available styling)
  
  const getSeatClass = (seatValue) => {
    switch(seatValue) {
      case 1: return classes.seatOccupied;
      case 2: return classes.seatSelected;
      case 3: return classes.seatSelected; // Using selected style for recommended
      case 4: return classes.seatUnavailable; // Frozen / blocked by admin
      default: return ''; // Available (default outline)
    }
  };

  // Accessible seat button: keyboard operable, labelled by seat + state.
  const renderSeat = (seat, indexRow, realIndex, rowLabel, keyPrefix) => {
    const occupied = seat === 1;
    const frozen = seat === 4;
    const blocked = occupied || frozen;
    const selected = seat === 2 || seat === 3;
    const label = `Seat ${rowLabel}${realIndex + 1}, ${
      frozen ? 'unavailable' : occupied ? 'unavailable' : selected ? 'selected' : 'available'
    }`;
    const activate = () => {
      if (!blocked) onSelectSeat(indexRow, realIndex);
    };
    return (
      <div
        key={`${keyPrefix}-${realIndex}`}
        role="button"
        aria-label={label}
        aria-pressed={selected}
        aria-disabled={blocked}
        tabIndex={blocked ? -1 : 0}
        onClick={activate}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            activate();
          }
        }}
        className={`${classes.seat} ${getSeatClass(seat)}`}
      >
        {rowLabel}{realIndex + 1}
      </div>
    );
  };

  return (
    <Fragment>
      {/* Top Header */}
      <div className={classes.topBar}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div
            className={classes.backButton}
            role="button"
            tabIndex={0}
            aria-label="Back to available showtimes"
            onClick={onHideSeatSelection}
            onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && onHideSeatSelection()}>
            <ArrowBackIosIcon style={{ fontSize: '14px', marginRight: '4px' }} />
            Available Showtimes
          </div>
          <div className={classes.timeHighlight}>
            {selectedTime}
          </div>
        </div>
        <div className={classes.ticketInfo} onClick={onHideSeatSelection}>
          <CreateIcon style={{ fontSize: '18px', marginRight: '8px' }} />
          {ticketCount} {ticketCount > 1 ? 'TICKETS' : 'TICKET'}
        </div>
      </div>

      {/* Pricing Info */}
      <div className={classes.pricingBar}>
        Odc | Adult: LKR {cinema ? (cinema.ticketPrice || 1500).toFixed(2) : '1500.00'} | Child: LKR {cinema ? ((cinema.ticketPrice || 1500) - 100).toFixed(2) : '1400.00'}
      </div>

      {/* Seat Map */}
      <div
        className={classes.seatMapContainer}
        role="group"
        aria-label="Seat selection. Use Tab to move between seats and Enter or Space to select.">
        {seats.length > 0 &&
          seats.map((seatRows, indexRow) => {
            const rowLabel = String.fromCharCode(65 + seats.length - 1 - indexRow);
            const half = Math.ceil(seatRows.length / 2);
            return (
              <div key={indexRow} className={classes.row} role="row">
                <div className={classes.rowLabel} aria-hidden="true">{rowLabel}</div>
                <div style={{ display: 'flex', paddingRight: '20px' }}>
                  {seatRows
                    .slice(0, half)
                    .map((seat, index) => renderSeat(seat, indexRow, index, rowLabel, 'seat-left'))}
                </div>
                <div style={{ display: 'flex', paddingLeft: '20px' }}>
                  {seatRows.slice(half).map((seat, index) =>
                    renderSeat(seat, indexRow, half + index, rowLabel, 'seat-right')
                  )}
                </div>
                <div className={classes.rowLabel} aria-hidden="true">{rowLabel}</div>
              </div>
            );
          })}

        <div className={classes.screenGraphic}>
          SCREEN
          <div className={classes.screenOverlay}></div>
        </div>
      </div>
    </Fragment>
  );
}
