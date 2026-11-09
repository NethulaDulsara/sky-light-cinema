import React, { useEffect, useState, useMemo } from 'react';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TextField,
  InputAdornment,
  IconButton,
  Typography,
  Chip,
  TablePagination
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import RefreshIcon from '@material-ui/icons/Refresh';
import ReceiptIcon from '@material-ui/icons/ReceiptOutlined';

import { getPosReservations } from '../../../store/actions';

const useStyles = makeStyles(theme => ({
  panel: {
    background: '#0a0e17',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 14,
    overflow: 'hidden'
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing(2, 2.5),
    gap: theme.spacing(2),
    borderBottom: '1px solid rgba(255,255,255,0.07)'
  },
  title: { fontWeight: 800, display: 'flex', alignItems: 'center', gap: 8 },
  search: {
    flex: 1,
    maxWidth: 360,
    '& .MuiOutlinedInput-root': { color: '#fff', borderRadius: 10 },
    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.18)' },
    '& .MuiSvgIcon-root': { color: '#94a3b8' }
  },
  tableWrap: { overflowX: 'auto' },
  th: {
    color: '#94a3b8',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
    borderBottom: '1px solid rgba(255,255,255,0.08)',
    whiteSpace: 'nowrap'
  },
  td: { color: '#e2e8f0', borderBottom: '1px solid rgba(255,255,255,0.05)', whiteSpace: 'nowrap' },
  ref: { fontFamily: 'monospace', color: '#9bdcff', fontWeight: 700 },
  amount: { fontWeight: 800 },
  method: { textTransform: 'capitalize', fontWeight: 700, height: 22 },
  methodCash: { background: 'rgba(0,204,102,0.15)', color: '#5de6a0' },
  methodCard: { background: 'rgba(0,198,255,0.15)', color: '#7bd4ff' },
  empty: { color: '#94a3b8', textAlign: 'center', padding: theme.spacing(8) },
  pagination: { color: '#94a3b8' }
}));

const money = n => `LKR ${Number(n || 0).toFixed(2)}`;
const fmtDate = d => (d ? new Date(d).toLocaleDateString() : '—');
const fmtDateTime = d => (d ? new Date(d).toLocaleString() : '—');

function POSBookings({ reservations, getPosReservations }) {
  const classes = useStyles();
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(0);
  const rowsPerPage = 10;

  useEffect(() => {
    getPosReservations();
  }, [getPosReservations]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return reservations;
    return (reservations || []).filter(r => {
      const movie = (r.movieId && r.movieId.title) || '';
      const cinema = (r.cinemaId && r.cinemaId.name) || '';
      const cashier = (r.cashierId && r.cashierId.name) || '';
      return [
        r.username,
        r.phone,
        movie,
        cinema,
        cashier,
        String(r._id).slice(-8)
      ]
        .join(' ')
        .toLowerCase()
        .includes(q);
    });
  }, [reservations, query]);

  const paged = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <div className={classes.panel}>
      <div className={classes.toolbar}>
        <Typography className={classes.title}>
          <ReceiptIcon /> Walk-in bookings
        </Typography>
        <TextField
          className={classes.search}
          variant="outlined"
          size="small"
          placeholder="Search customer, phone, movie, ref…"
          value={query}
          onChange={e => {
            setQuery(e.target.value);
            setPage(0);
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            )
          }}
        />
        <IconButton onClick={() => getPosReservations()} style={{ color: '#94a3b8' }} aria-label="Refresh">
          <RefreshIcon />
        </IconButton>
      </div>

      {filtered.length === 0 ? (
        <div className={classes.empty}>
          <ReceiptIcon style={{ fontSize: 48, color: '#334155' }} />
          <Typography style={{ marginTop: 8 }}>
            {query ? 'No bookings match your search.' : 'No walk-in bookings yet.'}
          </Typography>
        </div>
      ) : (
        <>
          <div className={classes.tableWrap}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  {['Ref', 'Movie', 'Cinema', 'Date', 'Time', 'Seats', 'Customer', 'Phone', 'Amount', 'Method', 'Cashier', 'Booked at'].map(h => (
                    <TableCell key={h} className={classes.th}>
                      {h}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {paged.map(r => (
                  <TableRow key={r._id} hover>
                    <TableCell className={`${classes.td} ${classes.ref}`}>
                      {String(r._id).slice(-8).toUpperCase()}
                    </TableCell>
                    <TableCell className={classes.td}>{(r.movieId && r.movieId.title) || '—'}</TableCell>
                    <TableCell className={classes.td}>{(r.cinemaId && r.cinemaId.name) || '—'}</TableCell>
                    <TableCell className={classes.td}>{fmtDate(r.date)}</TableCell>
                    <TableCell className={classes.td}>{r.startAt}</TableCell>
                    <TableCell className={classes.td}>{Array.isArray(r.seats) ? r.seats.length : 0}</TableCell>
                    <TableCell className={classes.td}>{r.username}</TableCell>
                    <TableCell className={classes.td}>{r.phone !== '0000000000' ? r.phone : '—'}</TableCell>
                    <TableCell className={`${classes.td} ${classes.amount}`}>{money(r.total)}</TableCell>
                    <TableCell className={classes.td}>
                      <Chip
                        size="small"
                        label={r.paymentMethod || 'cash'}
                        className={`${classes.method} ${
                          r.paymentMethod === 'card' ? classes.methodCard : classes.methodCash
                        }`}
                      />
                    </TableCell>
                    <TableCell className={classes.td}>{(r.cashierId && r.cashierId.name) || '—'}</TableCell>
                    <TableCell className={classes.td}>{fmtDateTime(r.createdAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <TablePagination
            className={classes.pagination}
            component="div"
            count={filtered.length}
            page={page}
            onChangePage={(e, p) => setPage(p)}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[rowsPerPage]}
          />
        </>
      )}
    </div>
  );
}

const mapStateToProps = state => ({
  reservations: state.posState.reservations
});

export default connect(mapStateToProps, { getPosReservations })(POSBookings);
