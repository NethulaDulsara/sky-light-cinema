import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import {
  TextField,
  MenuItem,
  Button,
  Typography,
  Divider,
  IconButton
} from '@material-ui/core';
import EventSeatIcon from '@material-ui/icons/EventSeatOutlined';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import LocalAtmIcon from '@material-ui/icons/LocalAtmOutlined';
import CreditCardIcon from '@material-ui/icons/CreditCardOutlined';
import PauseIcon from '@material-ui/icons/PauseCircleOutlineOutlined';
import CloseIcon from '@material-ui/icons/Close';

import BookingSeats from '../../Public/BookingPage/components/BookingSeats/BookingSeats';
import CashPaymentDialog from './CashPaymentDialog';
import POSReceipt from './POSReceipt';
import {
  getMovies,
  getCinemas,
  getShowtimes,
  getPosHeld,
  createPosReservation,
  holdPosReservation,
  settlePosReservation,
  voidPosReservation,
  getPosQuote
} from '../../../store/actions';

const ACCENT = 'linear-gradient(135deg, #00C6FF 0%, #0072FF 100%)';

const useStyles = makeStyles(theme => ({
  grid: {
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1fr) 360px',
    gap: theme.spacing(3),
    [theme.breakpoints.down('sm')]: { gridTemplateColumns: '1fr' }
  },
  panel: {
    background: '#0a0e17',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 14,
    overflow: 'hidden'
  },
  section: { padding: theme.spacing(2.5) },
  selectorRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: theme.spacing(2),
    [theme.breakpoints.down('xs')]: { gridTemplateColumns: '1fr' }
  },
  field: {
    '& .MuiOutlinedInput-root': { color: '#fff' },
    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.18)' },
    '& .MuiInputLabel-root': { color: '#94a3b8' },
    '& .MuiSvgIcon-root': { color: '#94a3b8' }
  },
  hint: { color: '#94a3b8', textAlign: 'center', padding: theme.spacing(8, 2) },
  // Held orders bar
  heldBar: {
    background: 'rgba(255,183,0,0.06)',
    border: '1px solid rgba(255,183,0,0.25)',
    borderRadius: 12,
    padding: theme.spacing(1.5, 2),
    marginBottom: theme.spacing(2)
  },
  heldTitle: { color: '#ffce6b', fontWeight: 700, fontSize: 13, marginBottom: 8, letterSpacing: 0.5 },
  heldList: { display: 'flex', gap: 10, flexWrap: 'wrap' },
  heldCard: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 10,
    padding: theme.spacing(1, 1.25)
  },
  heldInfo: { fontSize: 12.5, lineHeight: 1.25 },
  heldMovie: { fontWeight: 700, color: '#fff' },
  heldMeta: { color: '#94a3b8' },
  payHeld: {
    background: ACCENT,
    color: '#fff',
    textTransform: 'none',
    fontWeight: 700,
    borderRadius: 8,
    padding: theme.spacing(0.4, 1.5),
    minWidth: 0
  },
  summary: {
    background: '#0a0e17',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 14,
    padding: theme.spacing(2.5),
    position: 'sticky',
    top: 88,
    alignSelf: 'start'
  },
  summaryTitle: {
    fontWeight: 800,
    fontSize: '1rem',
    marginBottom: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    gap: 8
  },
  seatChips: { display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: theme.spacing(2) },
  seatChip: {
    background: 'rgba(0,198,255,0.12)',
    border: '1px solid rgba(0,198,255,0.3)',
    color: '#9bdcff',
    borderRadius: 6,
    padding: '2px 8px',
    fontSize: 12,
    fontWeight: 700
  },
  priceRow: {
    display: 'flex',
    justifyContent: 'space-between',
    color: '#cbd5e1',
    fontSize: 14,
    marginBottom: theme.spacing(1)
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontWeight: 800,
    fontSize: '1.15rem',
    marginTop: theme.spacing(1)
  },
  payToggle: { display: 'flex', gap: theme.spacing(1.5), margin: theme.spacing(1, 0, 2) },
  payBtn: {
    flex: 1,
    borderRadius: 10,
    textTransform: 'none',
    fontWeight: 700,
    border: '1px solid rgba(255,255,255,0.18)',
    color: '#cbd5e1',
    padding: theme.spacing(1.2, 0)
  },
  payBtnActive: { border: '1px solid transparent', background: ACCENT, color: '#fff' },
  actionsRow: { display: 'flex', gap: theme.spacing(1.5), marginTop: theme.spacing(2) },
  holdBtn: {
    flex: 1,
    borderRadius: 10,
    textTransform: 'none',
    fontWeight: 700,
    color: '#ffce6b',
    border: '1px solid rgba(255,183,0,0.4)',
    '&:disabled': { color: '#64748b', borderColor: 'rgba(255,255,255,0.1)' }
  },
  completeBtn: {
    flex: 2,
    background: ACCENT,
    color: '#fff',
    fontWeight: 800,
    borderRadius: 10,
    padding: theme.spacing(1.3, 0),
    textTransform: 'none',
    fontSize: '0.95rem',
    '&:disabled': { background: 'rgba(255,255,255,0.1)', color: '#64748b' }
  },
  muted: { color: '#94a3b8', fontSize: 13 },
  success: {
    background: '#0a0e17',
    border: '1px solid rgba(0,198,255,0.25)',
    borderRadius: 14,
    padding: theme.spacing(5),
    textAlign: 'center',
    maxWidth: 440,
    margin: '0 auto'
  },
  successIcon: { color: '#00cc66', fontSize: 64 },
  qr: { width: 180, height: 180, margin: theme.spacing(2, 'auto'), display: 'block' },
  ref: { fontFamily: 'monospace', color: '#9bdcff', fontWeight: 700, letterSpacing: 1 }
}));

const money = n => `LKR ${Number(n || 0).toFixed(2)}`;
const isMalabe = c => c && c.name && c.name.toLowerCase().includes('malabe');
const labelsFor = (seats, rows) =>
  (seats || []).map(([r, c]) => `${String.fromCharCode(65 + rows - 1 - r)}${c + 1}`);
const refOf = id => String(id || '').slice(-8).toUpperCase();

function POSNewSale(props) {
  const {
    movies,
    cinemas,
    showtimes,
    held,
    user,
    getMovies,
    getCinemas,
    getShowtimes,
    getPosHeld,
    createPosReservation,
    holdPosReservation,
    settlePosReservation,
    voidPosReservation
  } = props;
  const classes = useStyles();

  const [movieId, setMovieId] = useState('');
  const [cinemaId, setCinemaId] = useState('');
  const [startAt, setStartAt] = useState('');
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [taken, setTaken] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [quote, setQuote] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);
  const [receipt, setReceipt] = useState(null);
  // Payment dialog: { open, mode: 'sale'|'settle', total, reservationId }
  const [pay, setPay] = useState({ open: false, mode: 'sale', total: 0, reservationId: null });

  const today = useMemo(() => new Date(), []);

  useEffect(() => {
    if (!movies || !movies.length) getMovies();
    if (!cinemas || !cinemas.length) getCinemas();
    if (!showtimes || !showtimes.length) getShowtimes();
    getPosHeld();
  }, [getMovies, getCinemas, getShowtimes, getPosHeld]); // eslint-disable-line react-hooks/exhaustive-deps

  const cinemasForMovie = useMemo(() => {
    if (!movieId) return [];
    const ids = new Set(
      (showtimes || [])
        .filter(s => String(s.movieId) === String(movieId))
        .map(s => String(s.cinemaId))
    );
    return (cinemas || []).filter(c => ids.has(String(c._id)));
  }, [movieId, cinemas, showtimes]);

  // Default the cinema to Malabe (fallback: first available) once a movie is set.
  useEffect(() => {
    if (!cinemaId && cinemasForMovie.length) {
      const malabe = cinemasForMovie.find(isMalabe);
      setCinemaId((malabe || cinemasForMovie[0])._id);
    }
  }, [cinemasForMovie, cinemaId]);

  const timesForSelection = useMemo(() => {
    if (!movieId || !cinemaId) return [];
    return (showtimes || [])
      .filter(
        s =>
          String(s.movieId) === String(movieId) &&
          String(s.cinemaId) === String(cinemaId)
      )
      .map(s => s.startAt)
      .filter((v, i, self) => self.indexOf(v) === i)
      .sort((a, b) => new Date('1970/01/01 ' + a) - new Date('1970/01/01 ' + b));
  }, [movieId, cinemaId, showtimes]);

  const showtime = useMemo(
    () =>
      (showtimes || []).find(
        s =>
          String(s.movieId) === String(movieId) &&
          String(s.cinemaId) === String(cinemaId) &&
          s.startAt === startAt
      ),
    [showtimes, movieId, cinemaId, startAt]
  );

  const currentCinema = useMemo(
    () => (cinemas || []).find(c => String(c._id) === String(cinemaId)),
    [cinemas, cinemaId]
  );

  const loadSeats = useCallback(async stId => {
    if (!stId) return;
    try {
      const res = await fetch(`/showtimes/${stId}/seats`);
      if (!res.ok) return;
      const { booked = [], held: heldLocks = [] } = await res.json();
      const keys = [
        ...booked.map(s => (Array.isArray(s) ? `${s[0]}-${s[1]}` : String(s))),
        ...heldLocks.map(h => h.seat)
      ];
      setTaken(keys);
    } catch (e) {
      /* non-fatal */
    }
  }, []);

  useEffect(() => {
    setSelectedSeats([]);
    if (showtime) loadSeats(showtime._id);
    else setTaken([]);
  }, [showtime, loadSeats]);

  useEffect(() => {
    let active = true;
    if (showtime && selectedSeats.length > 0) {
      getPosQuote({
        cinemaId,
        seatCount: selectedSeats.length,
        format: showtime.format || '2D',
        date: today,
        startAt
      }).then(q => active && setQuote(q));
    } else {
      setQuote(null);
    }
    return () => {
      active = false;
    };
  }, [selectedSeats.length, showtime, cinemaId, startAt, today]);

  const seatMatrix = useMemo(() => {
    let m =
      currentCinema && currentCinema.seats && currentCinema.seats.length
        ? currentCinema.seats.map(r => [...r])
        : [];
    if (!m.length) m = Array.from({ length: 10 }, () => Array(10).fill(0));

    taken.forEach(key => {
      const [r, c] = key.split('-').map(Number);
      if (m[r] && m[r][c] !== undefined) m[r][c] = 1;
    });
    const frozen = [
      ...((currentCinema && currentCinema.frozenSeats) || []),
      ...((showtime && showtime.frozenSeats) || [])
    ];
    frozen.forEach(key => {
      const [r, c] = key.split('-').map(Number);
      if (m[r] && m[r][c] !== undefined && m[r][c] !== 1) m[r][c] = 4;
    });
    selectedSeats.forEach(([r, c]) => {
      if (m[r] && m[r][c] !== undefined && m[r][c] !== 1 && m[r][c] !== 4) m[r][c] = 2;
    });
    return m;
  }, [currentCinema, showtime, taken, selectedSeats]);

  const rows = seatMatrix.length;
  const seatLabel = ([r, c]) => `${String.fromCharCode(65 + rows - 1 - r)}${c + 1}`;

  const onSelectSeat = (row, seat) => {
    setSelectedSeats(prev => {
      const exists = prev.some(s => s[0] === row && s[1] === seat);
      return exists
        ? prev.filter(s => !(s[0] === row && s[1] === seat))
        : [...prev, [row, seat]];
    });
  };

  const resetSale = () => {
    setMovieId('');
    setCinemaId('');
    setStartAt('');
    setSelectedSeats([]);
    setTaken([]);
    setCustomerName('');
    setCustomerPhone('');
    setPaymentMethod('cash');
    setQuote(null);
    setSuccess(null);
    setReceipt(null);
  };

  const salePayload = () => ({
    showtimeId: showtime && showtime._id,
    cinemaId,
    movieId,
    seats: selectedSeats,
    format: showtime ? showtime.format || '2D' : '2D',
    date: today,
    startAt,
    customerName,
    customerPhone
  });

  // Park the current order as a hold for later recall.
  const holdOrder = async () => {
    if (!showtime || selectedSeats.length === 0) return;
    setSubmitting(true);
    const res = await holdPosReservation(salePayload());
    setSubmitting(false);
    if (res && res.status === 'success') resetSale();
    else if (showtime) loadSeats(showtime._id);
  };

  // Open the payment dialog for the current cart.
  const openPayment = () => {
    if (!showtime || selectedSeats.length === 0) return;
    setPay({ open: true, mode: 'sale', total: quote ? quote.total : 0, reservationId: null });
  };

  // Recall a held order into the payment dialog.
  const recall = h => {
    setPay({ open: true, mode: 'settle', total: h.total, reservationId: h._id });
  };

  const discardHeld = async h => {
    await voidPosReservation(h._id);
  };

  const buildReceiptFromReservation = (r, QRCode, method, tendered, change) => {
    const movieTitle =
      (movies.find(m => String(m._id) === String(r.movieId)) || {}).title || '';
    const cinema = cinemas.find(c => String(c._id) === String(r.cinemaId));
    const cinemaRows = cinema && cinema.seats ? cinema.seats.length : 0;
    return {
      cinemaName: cinema ? cinema.name : '',
      movieTitle,
      date: r.date,
      startAt: r.startAt,
      format: r.format,
      seatLabels: cinemaRows ? labelsFor(r.seats, cinemaRows) : [],
      seatCount: Array.isArray(r.seats) ? r.seats.length : 0,
      subtotal: r.subtotal,
      convenienceFee: r.convenienceFee,
      vat: r.vat,
      total: r.total,
      paymentMethod: method || r.paymentMethod,
      tendered,
      change,
      ref: refOf(r._id),
      QRCode,
      cashierName: user ? user.name : ''
    };
  };

  const onConfirmPayment = async ({ method, tendered, change }) => {
    setSubmitting(true);
    let response;
    if (pay.mode === 'sale') {
      response = await createPosReservation({ ...salePayload(), paymentMethod: method });
    } else {
      response = await settlePosReservation(pay.reservationId, method);
    }
    setSubmitting(false);
    if (response && response.status === 'success') {
      const r = response.data.reservation || {};
      const data = buildReceiptFromReservation(r, response.data.QRCode, method, tendered, change);
      setReceipt(data);
      setSuccess({ reservation: r, QRCode: response.data.QRCode, method, tendered, change });
      setPay({ open: false, mode: 'sale', total: 0, reservationId: null });
    } else {
      setPay(p => ({ ...p, open: false }));
      if (pay.mode === 'sale' && showtime) {
        loadSeats(showtime._id);
        setSelectedSeats([]);
      }
    }
  };

  if (success) {
    const r = success.reservation || {};
    const title = receipt ? receipt.movieTitle : '';
    return (
      <>
        <div className={classes.success}>
          <CheckCircleIcon className={classes.successIcon} />
          <Typography variant="h5" style={{ fontWeight: 800, marginTop: 8 }}>
            {success.method === 'card' ? 'Card payment complete' : 'Payment complete'}
          </Typography>
          <Typography className={classes.muted} style={{ marginTop: 4 }}>
            {title ? `${title} · ` : ''}
            {receipt && receipt.cinemaName ? `${receipt.cinemaName} · ` : ''}
            {r.startAt}
          </Typography>

          {/* Prominent seat numbers */}
          <div
            style={{
              margin: '16px auto 4px',
              padding: '10px 14px',
              borderRadius: 12,
              border: '1px solid rgba(0,198,255,0.35)',
              background: 'rgba(0,198,255,0.08)',
              display: 'inline-block'
            }}>
            <div style={{ fontSize: 11, letterSpacing: 2, color: '#94a3b8', marginBottom: 6 }}>
              {receipt && receipt.seatLabels && receipt.seatLabels.length > 1 ? 'SEATS' : 'SEAT'}
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
              {receipt && receipt.seatLabels && receipt.seatLabels.length ? (
                receipt.seatLabels.map(s => (
                  <span
                    key={s}
                    style={{
                      fontSize: 18,
                      fontWeight: 800,
                      color: '#fff',
                      background: ACCENT,
                      borderRadius: 8,
                      padding: '4px 12px',
                      letterSpacing: 1
                    }}>
                    {s}
                  </span>
                ))
              ) : (
                <span style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>
                  {Array.isArray(r.seats) ? r.seats.length : 0} seat(s)
                </span>
              )}
            </div>
          </div>

          {success.QRCode && <img className={classes.qr} src={success.QRCode} alt="Ticket QR code" />}
          <Typography className={classes.ref}>REF {refOf(r._id)}</Typography>
          <Typography style={{ fontWeight: 800, fontSize: '1.3rem', margin: '12px 0' }}>
            {money(r.total)}{' '}
            <span className={classes.muted} style={{ fontSize: 13 }}>· {success.method}</span>
          </Typography>
          {success.method === 'cash' && success.tendered != null && (
            <Typography className={classes.muted} style={{ marginBottom: 8 }}>
              Cash {money(success.tendered)} · Change {money(success.change)}
            </Typography>
          )}
          <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            <Button
              variant="outlined"
              style={{ flex: 1, color: '#cbd5e1', borderColor: 'rgba(255,255,255,0.2)', textTransform: 'none' }}
              onClick={() => window.print()}>
              Print bill
            </Button>
            <Button className={classes.completeBtn} style={{ flex: 1 }} onClick={resetSale}>
              New sale
            </Button>
          </div>
        </div>
        <POSReceipt data={receipt} />
      </>
    );
  }

  return (
    <div className={classes.grid}>
      <div>
        {held && held.length > 0 && (
          <div className={classes.heldBar}>
            <div className={classes.heldTitle}>
              <PauseIcon fontSize="small" style={{ verticalAlign: 'middle', marginRight: 4 }} />
              HELD ORDERS ({held.length}) — recall to take payment
            </div>
            <div className={classes.heldList}>
              {held.map(h => (
                <div key={h._id} className={classes.heldCard}>
                  <div className={classes.heldInfo}>
                    <div className={classes.heldMovie}>
                      {(h.movieId && h.movieId.title) || 'Movie'}
                    </div>
                    <div className={classes.heldMeta}>
                      {(h.cinemaId && h.cinemaId.name) || ''} · {h.startAt} ·{' '}
                      {Array.isArray(h.seats) ? h.seats.length : 0} seat(s) · {money(h.total)}
                    </div>
                  </div>
                  <Button className={classes.payHeld} onClick={() => recall(h)}>
                    Pay
                  </Button>
                  <IconButton size="small" style={{ color: '#94a3b8' }} onClick={() => discardHeld(h)} aria-label="Discard held order">
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className={classes.panel}>
          <div className={classes.section}>
            <div className={classes.selectorRow}>
              <TextField
                select
                className={classes.field}
                label="Movie"
                variant="outlined"
                value={movieId}
                onChange={e => {
                  setMovieId(e.target.value);
                  setCinemaId('');
                  setStartAt('');
                }}>
                {(movies || []).map(m => (
                  <MenuItem key={m._id} value={m._id}>
                    {m.title}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                className={classes.field}
                label="Cinema"
                variant="outlined"
                value={cinemaId}
                disabled={!movieId}
                onChange={e => {
                  setCinemaId(e.target.value);
                  setStartAt('');
                }}>
                {cinemasForMovie.map(c => (
                  <MenuItem key={c._id} value={c._id}>
                    {c.name}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                className={classes.field}
                label="Showtime"
                variant="outlined"
                value={startAt}
                disabled={!cinemaId}
                onChange={e => setStartAt(e.target.value)}>
                {timesForSelection.map(t => (
                  <MenuItem key={t} value={t}>
                    {t}
                  </MenuItem>
                ))}
              </TextField>
            </div>
          </div>

          {showtime ? (
            <BookingSeats
              seats={seatMatrix}
              cinema={currentCinema}
              selectedTime={startAt}
              ticketCount={selectedSeats.length}
              onHideSeatSelection={() => setStartAt('')}
              onSelectSeat={onSelectSeat}
            />
          ) : (
            <div className={classes.hint}>
              <EventSeatIcon style={{ fontSize: 48, color: '#334155' }} />
              <Typography style={{ marginTop: 8 }}>
                Pick a movie, cinema and showtime to open the seat map.
              </Typography>
            </div>
          )}
        </div>
      </div>

      <div className={classes.summary}>
        <Typography className={classes.summaryTitle}>
          <EventSeatIcon fontSize="small" /> Order summary
        </Typography>

        {selectedSeats.length > 0 ? (
          <div className={classes.seatChips}>
            {selectedSeats.map(s => (
              <span key={seatLabel(s)} className={classes.seatChip}>
                {seatLabel(s)}
              </span>
            ))}
          </div>
        ) : (
          <Typography className={classes.muted} style={{ marginBottom: 16 }}>
            No seats selected yet. Ask the customer how many seats and where they'd
            like to sit, then tap the seats on the map.
          </Typography>
        )}

        <Divider style={{ background: 'rgba(255,255,255,0.08)', marginBottom: 16 }} />

        <TextField
          className={classes.field}
          label="Customer name (optional)"
          variant="outlined"
          fullWidth
          size="small"
          style={{ marginBottom: 12 }}
          value={customerName}
          onChange={e => setCustomerName(e.target.value)}
        />
        <TextField
          className={classes.field}
          label="Customer phone (optional)"
          variant="outlined"
          fullWidth
          size="small"
          value={customerPhone}
          onChange={e => setCustomerPhone(e.target.value)}
        />

        <Typography className={classes.muted} style={{ margin: '18px 0 8px' }}>
          Payment method
        </Typography>
        <div className={classes.payToggle}>
          <Button
            className={`${classes.payBtn} ${paymentMethod === 'cash' ? classes.payBtnActive : ''}`}
            startIcon={<LocalAtmIcon />}
            onClick={() => setPaymentMethod('cash')}>
            Cash
          </Button>
          <Button
            className={`${classes.payBtn} ${paymentMethod === 'card' ? classes.payBtnActive : ''}`}
            startIcon={<CreditCardIcon />}
            onClick={() => setPaymentMethod('card')}>
            Card
          </Button>
        </div>

        <Divider style={{ background: 'rgba(255,255,255,0.08)', margin: '8px 0 16px' }} />

        <div className={classes.priceRow}>
          <span>Subtotal ({selectedSeats.length} × seat)</span>
          <span>{money(quote && quote.subtotal)}</span>
        </div>
        <div className={classes.priceRow}>
          <span>Convenience fee</span>
          <span>{money(quote && quote.convenienceFee)}</span>
        </div>
        <div className={classes.priceRow}>
          <span>VAT</span>
          <span>{money(quote && quote.vat)}</span>
        </div>
        <div className={classes.totalRow}>
          <span>Total</span>
          <span>{money(quote && quote.total)}</span>
        </div>

        <div className={classes.actionsRow}>
          <Button
            className={classes.holdBtn}
            startIcon={<PauseIcon />}
            disabled={!showtime || selectedSeats.length === 0 || submitting}
            onClick={holdOrder}>
            Hold
          </Button>
          <Button
            className={classes.completeBtn}
            disabled={!showtime || selectedSeats.length === 0 || !quote || submitting}
            onClick={openPayment}>
            {`Charge ${money(quote && quote.total)}`}
          </Button>
        </div>
      </div>

      <CashPaymentDialog
        open={pay.open}
        total={pay.total}
        initialMethod={paymentMethod}
        submitting={submitting}
        onClose={() => setPay(p => ({ ...p, open: false }))}
        onConfirm={onConfirmPayment}
      />
    </div>
  );
}

const mapStateToProps = state => ({
  movies: state.movieState.movies,
  cinemas: state.cinemaState.cinemas,
  showtimes: state.showtimeState.showtimes,
  held: state.posState.held,
  user: state.authState.user
});

export default connect(mapStateToProps, {
  getMovies,
  getCinemas,
  getShowtimes,
  getPosHeld,
  createPosReservation,
  holdPosReservation,
  settlePosReservation,
  voidPosReservation
})(POSNewSale);
