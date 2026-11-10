import React, { useState } from 'react';
import { Grid, Box, Typography, Button, IconButton, Modal } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import CloseIcon from '@material-ui/icons/Close';
import RemoveIcon from '@material-ui/icons/Remove';
import AddIcon from '@material-ui/icons/Add';
import ConfirmationNumberOutlinedIcon from '@material-ui/icons/ConfirmationNumberOutlined';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: '#0a0a20',
    minHeight: '400px',
    padding: theme.spacing(4, 0),
    color: '#fff'
  },
  dateBar: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#12122b',
    padding: theme.spacing(1, 2),
    borderBottom: '1px solid #1f1f3a'
  },
  dateItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(1, 2),
    cursor: 'pointer',
    color: '#9ba0b5',
    minWidth: '60px',
    transition: 'all 0.2s',
    '&:hover': {
      color: '#fff'
    }
  },
  dateItemActive: {
    color: '#fff',
    backgroundColor: '#e63946',
    borderRadius: '4px'
  },
  dateMonth: { fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' },
  dateDay: { fontSize: '20px', fontWeight: 800 },
  dateDayName: { fontSize: '12px', fontWeight: 600 },
  filters: {
    marginLeft: 'auto',
    display: 'flex',
    gap: theme.spacing(3)
  },
  filterText: {
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    color: '#fff'
  },
  cinemaSection: {
    padding: theme.spacing(4)
  },
  cinemaName: {
    fontSize: '16px',
    fontWeight: 700,
    textTransform: 'uppercase',
    marginBottom: theme.spacing(3)
  },
  experienceRow: {
    display: 'flex',
    alignItems: 'center',
    background: 'linear-gradient(145deg, #1a1a3a 0%, #15152e 100%)',
    padding: theme.spacing(3),
    marginBottom: theme.spacing(2),
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.05)'
  },
  experienceName: {
    width: '200px',
    fontSize: '22px',
    fontWeight: 'bold',
    color: '#f8f9fa',
    letterSpacing: '0.5px'
  },
  timeButton: {
    border: '1px solid rgba(255,255,255,0.35)',
    borderRadius: '10px',
    padding: theme.spacing(1, 3),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    minWidth: '110px',
    marginRight: theme.spacing(2),
    marginBottom: theme.spacing(1),
    transition: 'all 0.2s',
    '&:hover': {
      backgroundColor: 'rgba(0,198,255,0.12)',
      borderColor: '#00C6FF',
      transform: 'translateY(-2px)'
    }
  },
  timeValue: { fontSize: '16px', fontWeight: 800 },
  timeType: { fontSize: '10px', fontWeight: 600, color: '#00C6FF', marginTop: '2px' },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  modalPaper: {
    background: 'linear-gradient(145deg, #161d31 0%, #0c101c 100%)',
    borderRadius: '20px',
    border: '1px solid rgba(0, 198, 255, 0.25)',
    boxShadow: '0 25px 60px rgba(0,0,0,0.8), 0 0 30px rgba(0,198,255,0.12)',
    padding: theme.spacing(5, 6),
    width: '420px',
    maxWidth: '90vw',
    textAlign: 'center',
    outline: 'none',
    position: 'relative',
    color: '#f8fafc',
    fontFamily: 'Montserrat, sans-serif'
  },
  modalClose: {
    position: 'absolute',
    top: theme.spacing(2),
    right: theme.spacing(2),
    backgroundColor: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: '#94a3b8',
    padding: '6px',
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: 'rgba(239,68,68,0.2)',
      color: '#ef4444',
      borderColor: 'rgba(239,68,68,0.4)',
      transform: 'rotate(90deg)'
    }
  },
  modalTitle: {
    fontWeight: 700,
    letterSpacing: '1px',
    textTransform: 'uppercase',
    color: '#fff'
  },
  ticketIcon: {
    fontSize: '56px',
    margin: '18px 0 8px',
    color: '#00C6FF',
    transform: 'rotate(-20deg)'
  },
  counterRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '30px',
    margin: '20px 0 30px'
  },
  counterBtn: {
    border: '2px solid rgba(255,255,255,0.25)',
    padding: '6px',
    color: '#cbd5e1',
    transition: 'all 0.2s',
    '&:hover': {
      color: '#00C6FF',
      borderColor: '#00C6FF'
    }
  },
  counterValue: { fontSize: '22px', fontWeight: 800, color: '#ff4d6d', minWidth: '32px' },
  selectSeatsBtn: {
    backgroundColor: '#00a0ee',
    color: '#fff',
    width: '100%',
    padding: '12px',
    fontWeight: 700,
    fontSize: '14px',
    letterSpacing: '1px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 160, 238, 0.25)',
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: '#008cd1',
      boxShadow: '0 4px 12px rgba(0, 160, 238, 0.35)',
      transform: 'translateY(-1px)'
    }
  }
}));

export default function BookingForm(props) {
  const classes = useStyles();
  const {
    cinemas,
    showtimes,
    selectedDate,
    onChangeDate,
    onChangeCinema,
    onChangeTime,
    onShowSeatSelection
  } = props;

  const [modalOpen, setModalOpen] = useState(false);
  const [ticketCount, setTicketCount] = useState(1);
  const [pendingSelection, setPendingSelection] = useState(null);

  // Generate 7 days for carousel
  const dates = [];
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    dates.push(d);
  }

  // Ensure a default date is selected if none provided
  React.useEffect(() => {
    if (!selectedDate && dates.length > 0) {
      onChangeDate(dates[0]);
    }
  }, [selectedDate, dates, onChangeDate]);

  const handleTimeClick = (cinemaId, time) => {
    setPendingSelection({ cinemaId, time });
    setModalOpen(true);
  };

  const handleSelectSeats = () => {
    if (pendingSelection) {
      onChangeCinema({ target: { value: pendingSelection.cinemaId } });
      onChangeTime({ target: { value: pendingSelection.time } });
      if (onShowSeatSelection) onShowSeatSelection(ticketCount);
    }
    setModalOpen(false);
  };

  const isShowtimeOnDate = (showtime, date) => {
    const stStart = new Date(showtime.startDate);
    stStart.setHours(0,0,0,0);
    const stEnd = new Date(showtime.endDate);
    stEnd.setHours(23,59,59,999);
    const d = new Date(date);
    return d >= stStart && d <= stEnd;
  };

  return (
    <div className={classes.root}>
      {/* Date Carousel */}
      <div className={classes.dateBar}>
        <IconButton size="small" style={{ color: '#fff', marginRight: '10px' }}>
          <ArrowBackIosIcon fontSize="small" />
        </IconButton>
        {dates.map((d, i) => {
          const isActive = selectedDate && new Date(selectedDate).toDateString() === d.toDateString();
          return (
            <div
              key={i}
              className={`${classes.dateItem} ${isActive ? classes.dateItemActive : ''}`}
              onClick={() => onChangeDate(d)}>
              <div className={classes.dateMonth}>
                {d.toLocaleString('default', { month: 'short' })}
              </div>
              <div className={classes.dateDay}>{d.getDate()}</div>
              <div className={classes.dateDayName}>
                {i === 0 ? 'Today' : i === 1 ? 'Tmrw' : d.toLocaleString('default', { weekday: 'short' })}
              </div>
            </div>
          );
        })}
        <IconButton size="small" style={{ color: '#fff', marginLeft: '10px' }}>
          <ArrowForwardIosIcon fontSize="small" />
        </IconButton>

        <div className={classes.filters}>
          <div className={classes.filterText}>
            ALL EXPERIENCES <KeyboardArrowDownIcon fontSize="small" />
          </div>
          <div className={classes.filterText}>
            ALL LOCATIONS <KeyboardArrowDownIcon fontSize="small" />
          </div>
        </div>
      </div>

      {/* Cinemas & Showtimes */}
      <div className={classes.cinemaSection}>
        {cinemas.map(cinema => {
          // Find showtimes for this cinema on the selected date
          const cShowtimes = showtimes.filter(
            st => st.cinemaId === cinema._id && selectedDate && isShowtimeOnDate(st, selectedDate)
          );

          if (cShowtimes.length === 0) return null;

          // Group showtimes by screen format so each experience (2D/3D/IMAX/4DX)
          // is shown on its own row with the correct label.
          const byFormat = {};
          cShowtimes.forEach(st => {
            const f = st.format || '2D';
            (byFormat[f] = byFormat[f] || new Set()).add(st.startAt);
          });

          return (
            <div key={cinema._id}>
              <Typography className={classes.cinemaName}>{cinema.name}</Typography>
              {Object.keys(byFormat).sort().map(fmt => {
                const times = [...byFormat[fmt]].sort();
                return (
                  <div key={fmt} className={classes.experienceRow}>
                    <div className={classes.experienceName}>
                      {fmt === '2D' ? 'DIGITAL 2D' : fmt}
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                      {times.map(t => (
                        <div key={t} className={classes.timeButton} onClick={() => handleTimeClick(cinema._id, t)}>
                          <div className={classes.timeValue}>{t}</div>
                          <div className={classes.timeType}>{fmt}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
        {(!cinemas || cinemas.length === 0) && (
          <Typography variant="h5" align="center" style={{ marginTop: '40px' }}>
            No showtimes available on this date.
          </Typography>
        )}
      </div>

      {/* Ticket Selection Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} className={classes.modal}>
        <div className={classes.modalPaper}>
          <IconButton className={classes.modalClose} onClick={() => setModalOpen(false)}>
            <CloseIcon fontSize="small" />
          </IconButton>
          <Typography variant="h6" className={classes.modalTitle}>How Many Tickets?</Typography>
          <ConfirmationNumberOutlinedIcon className={classes.ticketIcon} />
          <Typography variant="body2" style={{ fontWeight: 700, fontSize: '13px', color: '#f8fafc' }}>No. of Tickets</Typography>
          <Typography variant="caption" style={{ fontSize: '11px', color: '#94a3b8' }}>(Max 10)</Typography>
          <div className={classes.counterRow}>
            <IconButton className={classes.counterBtn} onClick={() => setTicketCount(Math.max(1, ticketCount - 1))}>
              <RemoveIcon fontSize="small" />
            </IconButton>
            <div className={classes.counterValue}>{ticketCount}</div>
            <IconButton className={classes.counterBtn} onClick={() => setTicketCount(Math.min(10, ticketCount + 1))}>
              <AddIcon fontSize="small" />
            </IconButton>
          </div>
          <Button className={classes.selectSeatsBtn} onClick={handleSelectSeats}>
            SELECT SEATS
          </Button>
        </div>
      </Modal>
    </div>
  );
}
