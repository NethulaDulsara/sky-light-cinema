import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Dialog, Button, CircularProgress } from '@material-ui/core';
import LocalAtmIcon from '@material-ui/icons/LocalAtmOutlined';
import CreditCardIcon from '@material-ui/icons/CreditCardOutlined';
import BackspaceIcon from '@material-ui/icons/BackspaceOutlined';

const ACCENT = 'linear-gradient(135deg, #00C6FF 0%, #0072FF 100%)';

const useStyles = makeStyles(theme => ({
  paper: { background: '#0a0e17', color: '#fff', borderRadius: 16, width: 420, maxWidth: '95vw' },
  wrap: { padding: theme.spacing(3) },
  methodRow: { display: 'flex', gap: theme.spacing(1.5), marginBottom: theme.spacing(2.5) },
  methodBtn: {
    flex: 1,
    borderRadius: 10,
    textTransform: 'none',
    fontWeight: 700,
    border: '1px solid rgba(255,255,255,0.18)',
    color: '#cbd5e1',
    padding: theme.spacing(1.1, 0)
  },
  methodActive: { border: '1px solid transparent', background: ACCENT, color: '#fff' },
  readout: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 12,
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2)
  },
  line: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 },
  lineLabel: { color: '#94a3b8', fontSize: 13 },
  total: { fontWeight: 700, fontSize: '1.05rem' },
  tendered: { fontWeight: 800, fontSize: '1.6rem', color: '#9bdcff' },
  change: { fontWeight: 800, fontSize: '1.3rem', color: '#5de6a0' },
  short: { fontWeight: 800, fontSize: '1.1rem', color: '#ef7a7a' },
  quickRow: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: theme.spacing(1.5) },
  quick: {
    borderRadius: 10,
    textTransform: 'none',
    fontWeight: 700,
    color: '#cbd5e1',
    border: '1px solid rgba(0,198,255,0.3)',
    padding: theme.spacing(1, 0),
    minWidth: 0
  },
  pad: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 },
  key: {
    borderRadius: 10,
    fontWeight: 800,
    fontSize: '1.25rem',
    color: '#fff',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    padding: theme.spacing(1.6, 0),
    minWidth: 0
  },
  actions: { display: 'flex', gap: theme.spacing(1.5), marginTop: theme.spacing(2.5) },
  cancel: { flex: 1, color: '#94a3b8', textTransform: 'none', fontWeight: 700 },
  confirm: {
    flex: 2,
    background: ACCENT,
    color: '#fff',
    fontWeight: 800,
    borderRadius: 10,
    textTransform: 'none',
    padding: theme.spacing(1.3, 0),
    '&:disabled': { background: 'rgba(255,255,255,0.1)', color: '#64748b' }
  }
}));

const money = n => `LKR ${Number(n || 0).toFixed(2)}`;

export default function CashPaymentDialog({ open, total, initialMethod, submitting, onClose, onConfirm }) {
  const classes = useStyles();
  const [method, setMethod] = useState('cash');
  const [tendered, setTendered] = useState(0);

  useEffect(() => {
    if (open) {
      setMethod(initialMethod || 'cash');
      setTendered(0);
    }
  }, [open, initialMethod]);

  const change = tendered - Number(total || 0);
  const canConfirm = method === 'card' || change >= 0;

  const press = d => setTendered(t => Number(`${Math.round(t)}${d}`)); // append digit(s)
  const backspace = () => setTendered(t => Math.floor(t / 10));
  const addNote = amt => setTendered(t => Math.round(t) + amt);
  const exact = () => setTendered(Number(total || 0));

  return (
    <Dialog open={open} onClose={onClose} classes={{ paper: classes.paper }}>
      <div className={classes.wrap}>
        <div className={classes.methodRow}>
          <Button
            className={`${classes.methodBtn} ${method === 'cash' ? classes.methodActive : ''}`}
            startIcon={<LocalAtmIcon />}
            onClick={() => setMethod('cash')}>
            Cash
          </Button>
          <Button
            className={`${classes.methodBtn} ${method === 'card' ? classes.methodActive : ''}`}
            startIcon={<CreditCardIcon />}
            onClick={() => setMethod('card')}>
            Card
          </Button>
        </div>

        <div className={classes.readout}>
          <div className={classes.line}>
            <span className={classes.lineLabel}>Total due</span>
            <span className={classes.total}>{money(total)}</span>
          </div>
          {method === 'cash' && (
            <>
              <div className={classes.line}>
                <span className={classes.lineLabel}>Cash received</span>
                <span className={classes.tendered}>{money(tendered)}</span>
              </div>
              <div className={classes.line} style={{ marginBottom: 0 }}>
                <span className={classes.lineLabel}>{change >= 0 ? 'Change due' : 'Short by'}</span>
                <span className={change >= 0 ? classes.change : classes.short}>
                  {money(Math.abs(change))}
                </span>
              </div>
            </>
          )}
        </div>

        {method === 'cash' && (
          <>
            <div className={classes.quickRow}>
              <Button className={classes.quick} onClick={exact}>Exact</Button>
              <Button className={classes.quick} onClick={() => addNote(500)}>+500</Button>
              <Button className={classes.quick} onClick={() => addNote(1000)}>+1000</Button>
              <Button className={classes.quick} onClick={() => addNote(5000)}>+5000</Button>
            </div>
            <div className={classes.pad}>
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(d => (
                <Button key={d} className={classes.key} onClick={() => press(d)}>
                  {d}
                </Button>
              ))}
              <Button className={classes.key} onClick={() => press('00')}>00</Button>
              <Button className={classes.key} onClick={() => press('0')}>0</Button>
              <Button className={classes.key} onClick={backspace} aria-label="Backspace">
                <BackspaceIcon />
              </Button>
            </div>
          </>
        )}

        <div className={classes.actions}>
          <Button className={classes.cancel} onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button
            className={classes.confirm}
            disabled={!canConfirm || submitting}
            onClick={() =>
              onConfirm({
                method,
                tendered: method === 'cash' ? tendered : null,
                change: method === 'cash' ? change : null
              })
            }>
            {submitting ? (
              <CircularProgress size={22} style={{ color: '#fff' }} />
            ) : method === 'cash' ? (
              `Take payment · change ${money(change >= 0 ? change : 0)}`
            ) : (
              'Confirm card payment'
            )}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
