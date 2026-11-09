import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import logo from '../../../assets/logo.jpg';

// Thermal (80mm) receipt. Hidden off-screen normally; a global print stylesheet
// hides the rest of the app and prints only this node.
const useStyles = makeStyles({
  '@global': {
    '@media print': {
      'body *': { visibility: 'hidden !important' },
      '.pos-receipt, .pos-receipt *': { visibility: 'visible !important' },
      '.pos-receipt': {
        position: 'absolute !important',
        left: '0 !important',
        top: '0 !important',
        width: '80mm !important',
        padding: '4mm !important'
      }
    }
  },
  receipt: {
    position: 'absolute',
    left: -10000,
    top: 0,
    width: 300,
    padding: 16,
    background: '#fff',
    color: '#000',
    fontFamily: "'Courier New', monospace",
    fontSize: 12,
    lineHeight: 1.5
  },
  center: { textAlign: 'center' },
  logo: { width: 68, height: 68, margin: '0 auto 6px', display: 'block' },
  brand: { fontSize: 15, fontWeight: 800, letterSpacing: 1.5 },
  cinema: { fontSize: 12, fontWeight: 700 },
  tag: { fontSize: 10, letterSpacing: 2, marginTop: 2 },
  hr: { border: 'none', borderTop: '1px dashed #000', margin: '10px 0' },
  row: { display: 'flex', justifyContent: 'space-between' },
  label: { color: '#000' },
  movie: { fontSize: 13, fontWeight: 800, marginBottom: 2 },
  // Prominent seats block
  seatsBox: {
    border: '2px solid #000',
    borderRadius: 6,
    padding: '8px 6px',
    margin: '10px 0',
    textAlign: 'center'
  },
  seatsLabel: { fontSize: 10, letterSpacing: 2, fontWeight: 700 },
  seatsValue: {
    fontSize: 20,
    fontWeight: 800,
    letterSpacing: 1,
    marginTop: 3,
    wordSpacing: 4
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: 15,
    fontWeight: 800,
    borderTop: '2px solid #000',
    borderBottom: '2px solid #000',
    padding: '6px 0',
    margin: '6px 0'
  },
  qr: { width: 120, height: 120, margin: '8px auto', display: 'block' },
  muted: { fontSize: 10 },
  ref: { fontSize: 13, fontWeight: 800, letterSpacing: 2 }
});

const money = n => Number(n || 0).toFixed(2);

export default function POSReceipt({ data }) {
  const classes = useStyles();
  if (!data) return null;

  const {
    cinemaName,
    movieTitle,
    date,
    startAt,
    format,
    seatLabels,
    seatCount,
    subtotal,
    convenienceFee,
    vat,
    total,
    paymentMethod,
    tendered,
    change,
    ref,
    QRCode,
    cashierName
  } = data;

  const dateStr = date ? new Date(date).toLocaleDateString() : '';
  const seatsText =
    seatLabels && seatLabels.length ? seatLabels.join('  ') : `${seatCount || 0} SEAT(S)`;

  return (
    <div className={`pos-receipt ${classes.receipt}`}>
      <div className={classes.center}>
        <img className={classes.logo} src={logo} alt="Sky Lights Cinema" />
        <div className={classes.brand}>SKY LIGHTS CINEMA</div>
        {cinemaName && <div className={classes.cinema}>{cinemaName}</div>}
        <div className={classes.tag}>BOX OFFICE TICKET</div>
      </div>

      <hr className={classes.hr} />

      <div className={classes.movie}>{movieTitle || 'Movie'}</div>
      <div className={classes.row}>
        <span>{dateStr}</span>
        <span>{startAt}</span>
        <span>{format}</span>
      </div>

      {/* Seats — the most important line, made large and boxed */}
      <div className={classes.seatsBox}>
        <div className={classes.seatsLabel}>SEAT{(seatLabels || []).length > 1 ? 'S' : ''}</div>
        <div className={classes.seatsValue}>{seatsText}</div>
      </div>

      <div className={classes.row}>
        <span className={classes.label}>Subtotal</span>
        <span>{money(subtotal)}</span>
      </div>
      <div className={classes.row}>
        <span className={classes.label}>Convenience fee</span>
        <span>{money(convenienceFee)}</span>
      </div>
      <div className={classes.row}>
        <span className={classes.label}>VAT</span>
        <span>{money(vat)}</span>
      </div>

      <div className={classes.totalRow}>
        <span>TOTAL</span>
        <span>LKR {money(total)}</span>
      </div>

      <div className={classes.row}>
        <span className={classes.label}>Payment</span>
        <span style={{ textTransform: 'capitalize', fontWeight: 700 }}>{paymentMethod}</span>
      </div>
      {paymentMethod === 'cash' && tendered != null && (
        <>
          <div className={classes.row}>
            <span className={classes.label}>Cash received</span>
            <span>{money(tendered)}</span>
          </div>
          <div className={classes.row}>
            <span className={classes.label}>Change</span>
            <span>{money(change)}</span>
          </div>
        </>
      )}

      <hr className={classes.hr} />

      {ref && <div className={classes.center}>Booking Ref</div>}
      {ref && <div className={`${classes.center} ${classes.ref}`}>{ref}</div>}
      {QRCode && <img className={classes.qr} src={QRCode} alt="Ticket QR" />}
      <div className={`${classes.center} ${classes.muted}`}>
        Scan at entry · {cashierName ? `Served by ${cashierName}` : ''}
      </div>
      <div className={`${classes.center} ${classes.muted}`}>{new Date().toLocaleString()}</div>

      <hr className={classes.hr} />

      <div className={classes.center} style={{ fontWeight: 700 }}>
        Thank you! Enjoy the show.
      </div>
      <div className={`${classes.center} ${classes.muted}`}>
        Tickets are non-refundable within 3h of showtime.
      </div>
    </div>
  );
}
