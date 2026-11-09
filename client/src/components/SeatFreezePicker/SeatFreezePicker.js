import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, Typography, Button } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  wrap: { marginTop: theme.spacing(1) },
  legend: {
    display: 'flex',
    gap: theme.spacing(2),
    alignItems: 'center',
    marginBottom: theme.spacing(2),
    color: '#94a3b8',
    fontSize: '0.8rem',
    flexWrap: 'wrap'
  },
  swatch: { display: 'inline-flex', alignItems: 'center', gap: 6 },
  box: { width: 16, height: 16, borderRadius: 4, display: 'inline-block' },
  grid: { overflowX: 'auto', paddingBottom: theme.spacing(1) },
  row: { display: 'flex', alignItems: 'center', marginBottom: theme.spacing(0.75) },
  rowLabel: { width: 24, color: '#94a3b8', fontSize: 12, fontWeight: 700 },
  rowBtn: {
    minWidth: 0,
    padding: theme.spacing(0, 1),
    marginRight: theme.spacing(1),
    fontSize: 10,
    color: '#00C6FF',
    textTransform: 'none',
    whiteSpace: 'nowrap'
  },
  seat: {
    width: 26,
    height: 26,
    margin: 2,
    borderRadius: 5,
    fontSize: 9,
    fontWeight: 600,
    color: '#fff',
    border: '1px solid rgba(255,255,255,0.3)',
    background: 'transparent',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all .15s ease',
    '&:hover': { borderColor: '#00C6FF' }
  },
  frozen: {
    background: '#4a4a5a',
    borderColor: '#4a4a5a',
    color: '#cbd5e1'
  },
  count: { marginTop: theme.spacing(1.5), color: '#94a3b8', fontSize: '0.82rem' }
}));

function SeatFreezePicker({ seats, value, onChange }) {
  const classes = useStyles();
  const frozen = new Set(value || []);
  const rows = Array.isArray(seats) ? seats.length : 0;

  if (!rows) {
    return (
      <Typography style={{ color: '#94a3b8' }}>
        This hall has no seat layout yet, so there's nothing to freeze.
      </Typography>
    );
  }

  const keysOfRow = r =>
    (Array.isArray(seats[r]) ? seats[r] : []).map((_, c) => `${r}-${c}`);

  const emit = set => onChange(Array.from(set));

  const toggleSeat = key => {
    const next = new Set(frozen);
    next.has(key) ? next.delete(key) : next.add(key);
    emit(next);
  };

  const rowAllFrozen = r => {
    const keys = keysOfRow(r);
    return keys.length > 0 && keys.every(k => frozen.has(k));
  };

  const toggleRow = r => {
    const keys = keysOfRow(r);
    const next = new Set(frozen);
    if (rowAllFrozen(r)) keys.forEach(k => next.delete(k));
    else keys.forEach(k => next.add(k));
    emit(next);
  };

  return (
    <div className={classes.wrap}>
      <div className={classes.legend}>
        <span className={classes.swatch}>
          <span className={classes.box} style={{ border: '1px solid rgba(255,255,255,0.3)' }} />{' '}
          Available
        </span>
        <span className={classes.swatch}>
          <span className={classes.box} style={{ background: '#4a4a5a' }} /> Frozen (blocked)
        </span>
        <span>Click a seat to toggle, or freeze a whole row.</span>
      </div>

      <div className={classes.grid}>
        {seats.map((seatRow, r) => {
          const rowLabel = String.fromCharCode(65 + rows - 1 - r);
          return (
            <div className={classes.row} key={r}>
              <span className={classes.rowLabel}>{rowLabel}</span>
              <Button
                className={classes.rowBtn}
                size="small"
                onClick={() => toggleRow(r)}>
                {rowAllFrozen(r) ? 'Unfreeze' : 'Freeze'} row
              </Button>
              {(Array.isArray(seatRow) ? seatRow : []).map((_, c) => {
                const key = `${r}-${c}`;
                const isFrozen = frozen.has(key);
                return (
                  <button
                    type="button"
                    key={key}
                    className={`${classes.seat} ${isFrozen ? classes.frozen : ''}`}
                    onClick={() => toggleSeat(key)}
                    aria-pressed={isFrozen}
                    aria-label={`Seat ${rowLabel}${c + 1} ${isFrozen ? 'frozen' : 'available'}`}>
                    {rowLabel}
                    {c + 1}
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>

      <div className={classes.count}>{frozen.size} seat(s) frozen.</div>
    </div>
  );
}

SeatFreezePicker.propTypes = {
  seats: PropTypes.array,
  value: PropTypes.array,
  onChange: PropTypes.func.isRequired
};

export default SeatFreezePicker;
