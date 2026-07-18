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
    backgroundColor: '#1a1a3a',
    padding: theme.spacing(3),
    marginBottom: theme.spacing(2),
    borderRadius: '4px'
  },
  experienceName: {
    width: '200px',
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#f8f9fa'
  },
  timeButton: {
    border: '1px solid #fff',
    borderRadius: '8px',
    padding: theme.spacing(1, 3),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    minWidth: '120px',
    marginRight: theme.spacing(2),
    transition: 'all 0.2s',
    '&:hover': {
      backgroundColor: 'rgba(255,255,255,0.1)'
    }
  },
  timeValue: { fontSize: '16px', fontWeight: 800 },
  timeType: { fontSize: '10px', fontWeight: 600 },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  modalPaper: {
    backgroundColor: '#fff',
    borderRadius: '16px',
    padding: theme.spacing(4, 6),
    width: '420px',
    textAlign: 'center',
    outline: 'none',
    position: 'relative',
    color: '#000',
    fontFamily: 'Montserrat, sans-serif'
  },
  modalClose: {
    position: 'absolute',
    top: '-15px',
    right: '-15px',
    backgroundColor: '#0a0a20',
    color: '#fff',
    padding: '8px',
    '&:hover': {
      backgroundColor: '#1a1a3a'
    }
  },
  ticketIcon: { 
    fontSize: '60px', 
    margin: '10px 0',
    color: '#000',
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
    border: '2px solid #ccc',
    padding: '6px',
    color: '#ccc',
    '&:hover': {
      color: '#000',
      borderColor: '#000'
    }
  },
  counterValue: { fontSize: '20px', fontWeight: 700, color: '#e63946' },
  selectSeatsBtn: {
    backgroundColor: '#35297e',
    color: '#fff',
    width: '100%',
    padding: '12px',
    fontWeight: 'bold',
    fontSize: '14px',
    letterSpacing: '1px',
    borderRadius: '4px',
    '&:hover': {
      backgroundColor: '#261c5c'
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

          // Deduplicate times just in case
          const times = [...new Set(cShowtimes.map(st => st.startAt))].sort();

          return (
            <div key={cinema._id}>
              <Typography className={classes.cinemaName}>{cinema.name}</Typography>
              <div className={classes.experienceRow}>
                <div className={classes.experienceName}>DIGITAL 2D</div>
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                  {times.map(t => (
                    <div key={t} className={classes.timeButton} onClick={() => handleTimeClick(cinema._id, t)}>
                      <div className={classes.timeValue}>{t}</div>
                      <div className={classes.timeType}>2D</div>
                    </div>
                  ))}
                </div>
              </div>
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
          <Typography variant="h6" style={{ fontWeight: 500, letterSpacing: '1px' }}>HOW MANY TICKETS ?</Typography>
          <ConfirmationNumberOutlinedIcon className={classes.ticketIcon} />
          <Typography variant="body2" style={{ fontWeight: 600, fontSize: '13px' }}>No. Of Tickets</Typography>
          <Typography variant="caption" color="textSecondary" style={{ fontSize: '10px' }}>(Max 10)</Typography>
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
