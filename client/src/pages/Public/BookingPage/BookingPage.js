import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles, Grid, Container, Typography, Button } from '@material-ui/core';
import {
  getMovie,
  getCinemasUserModeling,
  getCinema,
  getCinemas,
  getShowtimes,
  getReservations,
  getSuggestedReservationSeats,
  setSelectedSeats,
  setSelectedCinema,
  setSelectedDate,
  setSelectedTime,
  setInvitation,
  toggleLoginPopup,
  showInvitationForm,
  resetCheckout,
  setAlert,
  addReservation,
  setSuggestedSeats,
  setQRCode
} from '../../../store/actions';
import { ResponsiveDialog } from '../../../components';
import { getSessionId } from '../../../utils';
import LoginForm from '../Login/components/LoginForm';
import styles from './styles';
import MovieInfo from './components/MovieInfo/MovieInfo';
import BookingForm from './components/BookingForm/BookingForm';
import BookingSeats from './components/BookingSeats/BookingSeats';
import BookingCheckout from './components/BookingCheckout/BookingCheckout';
import BookingInvitation from './components/BookingInvitation/BookingInvitation';
import TicketTypeModal from './components/TicketTypeModal/TicketTypeModal';
import TermsAndConditionsModal from './components/TermsAndConditionsModal/TermsAndConditionsModal';

import jsPDF from 'jspdf';

class BookingPage extends Component {
  state = {
    isSeatSelectionVisible: false,
    ticketCount: 1,
    isTicketTypeModalOpen: false,
    isTermsModalOpen: false,
    pendingCheckout: null,
    // "row-col" keys that are unavailable (booked or held by other sessions)
    takenSeats: []
  };

  didSetSuggestion = false;
  sessionId = getSessionId();
  seatPollTimer = null;

  componentDidMount() {
    const {
      user,
      match,
      getMovie,
      getCinemas,
      getCinemasUserModeling,
      getShowtimes,
      getReservations,
      getSuggestedReservationSeats
    } = this.props;
    getMovie(match.params.id);
    user ? getCinemasUserModeling(user.username) : getCinemas();
    getShowtimes();
    getReservations();
    if (user) getSuggestedReservationSeats(user.username);
  }

  componentDidUpdate(prevProps) {
    const { selectedCinema, selectedDate, selectedTime, getCinema } = this.props;
    if (
      (selectedCinema && prevProps.selectedCinema !== selectedCinema) ||
      (selectedCinema && prevProps.selectedDate !== selectedDate)
    ) {
      getCinema(selectedCinema);
    }
    // Refresh seat availability whenever the chosen showtime changes.
    if (
      selectedCinema &&
      selectedTime &&
      (prevProps.selectedCinema !== selectedCinema ||
        prevProps.selectedTime !== selectedTime ||
        prevProps.selectedDate !== selectedDate)
    ) {
      this.refreshSeatAvailability();
      this.startSeatPolling();
    }
  }

  componentWillUnmount() {
    this.stopSeatPolling();
    this.releaseSeatLocks();
  }

  // Resolve the showtime document for the current cinema + time selection.
  getCurrentShowtime = () => {
    const { showtimes, selectedCinema, selectedTime } = this.props;
    if (!showtimes || !selectedCinema || !selectedTime) return null;
    return showtimes.find(
      s => s.cinemaId === selectedCinema && s.startAt === selectedTime
    );
  };

  startSeatPolling = () => {
    this.stopSeatPolling();
    this.seatPollTimer = setInterval(this.refreshSeatAvailability, 8000);
  };

  stopSeatPolling = () => {
    if (this.seatPollTimer) {
      clearInterval(this.seatPollTimer);
      this.seatPollTimer = null;
    }
  };

  // Fetch booked + other-session-held seats for the current showtime.
  refreshSeatAvailability = async () => {
    const showtime = this.getCurrentShowtime();
    if (!showtime) return;
    try {
      const res = await fetch(`/showtimes/${showtime._id}/seats`);
      if (!res.ok) return;
      const { booked = [], held = [] } = await res.json();
      const keys = new Set();
      booked.forEach(s => keys.add(`${s[0]}-${s[1]}`));
      held
        .filter(h => h.sessionId !== this.sessionId)
        .forEach(h => keys.add(h.seat));
      this.setState({ takenSeats: Array.from(keys) });
    } catch (e) {
      /* non-fatal: keep last known availability */
    }
  };

  // Hold the currently selected seats for this browser session.
  syncSeatLocks = async seats => {
    const showtime = this.getCurrentShowtime();
    if (!showtime || !seats || !seats.length) return true;
    try {
      const res = await fetch('/seatlocks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          showtimeId: showtime._id,
          sessionId: this.sessionId,
          seats
        })
      });
      if (res.status === 409) {
        this.props.setAlert('Some of those seats were just taken. Please choose again.', 'error', 4000);
        this.refreshSeatAvailability();
        return false;
      }
      return res.ok;
    } catch (e) {
      return true; // best effort
    }
  };

  releaseSeatLocks = () => {
    const showtime = this.getCurrentShowtime();
    if (!showtime) return;
    // Fire-and-forget; keepalive lets it run during navigation/unload.
    try {
      fetch('/seatlocks', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ showtimeId: showtime._id, sessionId: this.sessionId }),
        keepalive: true
      });
    } catch (e) {
      /* ignore */
    }
  };

  onShowSeatSelection = (ticketCount) => {
    this.setState({ isSeatSelectionVisible: true, ticketCount });
  };

  onHideSeatSelection = () => {
    this.setState({ isSeatSelectionVisible: false });
  };

  // JSpdf Generator For generating the PDF
  jsPdfGenerator = () => {
    const { movie, cinema, selectedDate, selectedTime, QRCode } = this.props;
    const doc = new jsPDF();
    doc.setFont('helvetica');
    doc.setFontType('bold');
    doc.setFontSize(22);
    doc.text(movie.title, 20, 20);
    doc.setFontSize(16);
    doc.text(cinema.name, 20, 30);
    doc.text(
      `Date: ${new Date(
        selectedDate
      ).toLocaleDateString()} - Time: ${selectedTime}`,
      20,
      40
    );
    doc.addImage(QRCode, 'JPEG', 15, 40, 160, 160);
    doc.save(`${movie.title}-${cinema.name}.pdf`);
  };

  onSelectSeat = (row, seat) => {
    const { setSelectedSeats, selectedSeats } = this.props;
    const { ticketCount } = this.state;
    const seats = this.onGetReservedSeats();
    
    // If the seat is already occupied or doesn't exist, do nothing
    if (!seats || !seats[row] || seats[row][seat] === 1) return;

    const currentSelected = selectedSeats || [];

    // Check if the seat is currently selected
    const isSelected = currentSelected.some(s => s[0] === row && s[1] === seat);

    // At the ticket limit and clicking a new (unselected) seat:
    if (!isSelected && currentSelected.length >= ticketCount) {
      // For a single ticket, MOVE the selection to the newly clicked seat
      // (deselect the old one, select the new one) instead of doing nothing.
      if (ticketCount === 1 && currentSelected.length === 1) {
        setSelectedSeats(currentSelected[0]); // remove previous seat
        setSelectedSeats([row, seat]); // select the new seat
        this.syncSeatLocks([[row, seat]]);
        return;
      }
      // For multiple tickets, prompt the user to free a seat first.
      this.props.setAlert(
        `You have selected all ${ticketCount} seats. Click a green seat to deselect it before choosing another.`,
        'info',
        3500
      );
      return;
    }

    setSelectedSeats([row, seat]);

    // Compute the resulting selection and hold those seats for this session.
    const newSelection = isSelected
      ? currentSelected.filter(s => !(s[0] === row && s[1] === seat))
      : [...currentSelected, [row, seat]];
    if (newSelection.length) {
      this.syncSeatLocks(newSelection);
    } else {
      this.releaseSeatLocks();
    }
  };

  onOpenTicketTypeModal = () => {
    this.setState({ isTicketTypeModalOpen: true });
  };

  onCloseTicketTypeModal = () => {
    this.setState({ isTicketTypeModalOpen: false });
  };

  onProceedTicketTypeModal = (adultCount, childCount) => {
    this.setState({
      isTicketTypeModalOpen: false,
      isTermsModalOpen: true,
      pendingCheckout: { adultCount, childCount }
    });
  };

  onCloseTermsModal = () => {
    this.setState({ isTermsModalOpen: false, pendingCheckout: null });
  };

  onAgreeTermsModal = () => {
    const { pendingCheckout } = this.state;
    if (pendingCheckout) {
      this.checkout(pendingCheckout.adultCount, pendingCheckout.childCount);
    }
    this.setState({ isTermsModalOpen: false, pendingCheckout: null });
  };

  async checkout(adultCount, childCount) {
    const {
      user,
      movie,
      cinema,
      cinemas,
      selectedCinema,
      selectedSeats,
      selectedDate,
      selectedTime,
      getReservations,
      addReservation,
      setQRCode,
      setAlert
    } = this.props;

    const currentCinema = cinema || (cinemas && cinemas.find(c => c._id === selectedCinema));

    if (!selectedSeats || selectedSeats.length === 0) return;

    const showtime = this.getCurrentShowtime();
    const format = showtime ? showtime.format || '2D' : '2D';

    this.setState({ isTicketTypeModalOpen: false });

    // The server computes the authoritative price (base + format + dynamic
    // pricing + fees + VAT). Client amounts are not trusted.
    const response = await addReservation({
      date: selectedDate,
      startAt: selectedTime,
      seats: this.bookSeats(),
      format,
      showtimeId: showtime ? showtime._id : undefined,
      sessionId: this.sessionId,
      movieId: movie ? movie._id : '',
      cinemaId: currentCinema ? currentCinema._id : selectedCinema,
      // Associate the booking with the signed-in account (if any) so it appears
      // in their dashboard; guests remain anonymous.
      userId: user ? user._id : undefined,
      username: user ? user.name : 'Guest',
      email: user ? user.email : undefined,
      phone: user ? (user.phone || '0000000000') : '0000000000'
    });
    if (response && response.status === 'success') {
      const { data } = response;
      const r = data.reservation;
      setQRCode(data.QRCode);
      getReservations();
      // Seats are now held by the pending reservation; drop the session locks.
      this.releaseSeatLocks();
      this.stopSeatPolling();

      this.props.history.push({
        pathname: '/payment/' + r._id,
        state: {
          movieTitle: movie ? movie.title : '',
          cinemaName: currentCinema ? currentCinema.name : '',
          date: selectedDate,
          time: selectedTime,
          format,
          seats: this.bookSeats(),
          totalPrice: r.total,
          breakdown: {
            subtotal: r.subtotal,
            convenienceFee: r.convenienceFee,
            vat: r.vat,
            total: r.total
          },
          holdExpiresAt: r.holdExpiresAt,
          adultCount,
          childCount
        }
      });
    } else if (response && response.status === 'error') {
      setAlert(response.message || 'Could not create booking. Please try again.', 'error', 5000);
      this.refreshSeatAvailability();
    }
  }

  bookSeats() {
    const { selectedSeats } = this.props;
    if (!selectedSeats || selectedSeats.length === 0) return [];
    
    // selectedSeats is already an array of [row, seat] pairs, so we can just return it.
    return selectedSeats;
  }

  onFilterCinema() {
    const { cinemas, showtimes, selectedCinema, selectedTime } = this.props;
    const initialReturn = { uniqueCinemas: [], uniqueTimes: [] };
    if (!showtimes || !cinemas) return initialReturn;

    const uniqueCinemasId = showtimes
      .filter(showtime =>
        selectedTime ? showtime.startAt === selectedTime : true
      )
      .map(showtime => showtime.cinemaId)
      .filter((value, index, self) => self.indexOf(value) === index);

    const uniqueCinemas = cinemas.filter(cinema =>
      uniqueCinemasId.includes(cinema._id)
    );

    const uniqueTimes = showtimes
      .filter(showtime =>
        selectedCinema ? selectedCinema === showtime.cinemaId : true
      )
      .map(showtime => showtime.startAt)
      .filter((value, index, self) => self.indexOf(value) === index)
      .sort(
        (a, b) => new Date('1970/01/01 ' + a) - new Date('1970/01/01 ' + b)
      );

    return { ...initialReturn, uniqueCinemas, uniqueTimes };
  }

  onGetReservedSeats = () => {
    const { cinema, cinemas, selectedCinema } = this.props;
    const currentCinema = cinema || (cinemas && cinemas.find(c => c._id === selectedCinema));

    let newSeats = currentCinema && currentCinema.seats && currentCinema.seats.length
      ? currentCinema.seats.map(row => [...row])
      : [];

    // If cinema has no seats or is not loaded yet, generate a default 10x10 seat map (100 seats)
    if (newSeats.length === 0) {
      newSeats = Array.from({ length: 10 }, () => Array(10).fill(0));
    }

    // Mark seats that are booked or held by other sessions (scoped to THIS
    // showtime via the server availability endpoint — fixes the old bug where
    // seats from a different movie/cinema at the same time appeared taken).
    const { takenSeats } = this.state;
    if (takenSeats && takenSeats.length) {
      takenSeats.forEach(key => {
        const [row, seat] = key.split('-').map(Number);
        if (newSeats[row] && newSeats[row][seat] !== undefined) {
          newSeats[row][seat] = 1;
        }
      });
    }

    // Admin-frozen seats: hall-level (cinema) + per-showtime, shown as blocked.
    const showtime = this.getCurrentShowtime();
    const frozen = [
      ...((currentCinema && currentCinema.frozenSeats) || []),
      ...((showtime && showtime.frozenSeats) || [])
    ];
    frozen.forEach(key => {
      const [row, seat] = key.split('-').map(Number);
      if (newSeats[row] && newSeats[row][seat] !== undefined && newSeats[row][seat] !== 1) {
        newSeats[row][seat] = 4;
      }
    });

    return newSeats;
  };

  onGetSuggestedSeats = (seats, suggestedSeats) => {
    const { numberOfTickets, positions } = suggestedSeats;

    const positionsArray = Object.keys(positions).map(key => {
      return [String(key), positions[key]];
    });

    positionsArray.sort((a, b) => {
      return b[1] - a[1];
    });

    if (positionsArray.every(position => position[1] === 0)) return;

    const step = Math.round(seats.length / 3);
    let indexArr = [];
    let suggested;
    for (let position of positionsArray) {
      switch (position[0]) {
        case 'front':
          indexArr = [0, step];
          suggested = this.checkSeats(indexArr, seats, numberOfTickets);
          break;
        case 'center':
          indexArr = [step, step * 2];
          suggested = this.checkSeats(indexArr, seats, numberOfTickets);
          break;
        case 'back':
          indexArr = [step * 2, step * 3];
          suggested = this.checkSeats(indexArr, seats, numberOfTickets);
          break;
        default:
          break;
      }
      if (suggested) this.getSeat(suggested, seats, numberOfTickets);
      break;
    }
  };

  checkSeats = (indexArr, seats, numberOfTickets) => {
    for (let i = indexArr[0]; i < indexArr[1]; i++) {
      for (let seat in seats[i]) {
        let seatNum = Number(seat);

        if (
          !seats[i][seatNum] &&
          seatNum + (numberOfTickets - 1) <= seats[i].length
        ) {
          let statusAvailability = [];
          for (let y = 1; y < numberOfTickets; y++) {
            //check the next seat if available
            if (!seats[i][seatNum + y]) {
              statusAvailability.push(true);
            } else {
              statusAvailability.push(false);
            }
          }
          if (statusAvailability.every(Boolean)) return [i, seatNum];
        }
      }
    }
    return null;
  };

  getSeat = (suggested, seats, numberOfTickets) => {
    const { setSuggestedSeats } = this.props;
    for (let i = suggested[1]; i < suggested[1] + numberOfTickets; i++) {
      const seat = [suggested[0], i];
      setSuggestedSeats(seat);
    }
  };

  onChangeCinema = event => this.props.setSelectedCinema(event.target.value);
  onChangeDate = date => this.props.setSelectedDate(date);
  onChangeTime = event => this.props.setSelectedTime(event.target.value);

  sendInvitations = async () => {
    const invitations = this.createInvitations();
    if (!invitations) return;
    try {
      const token = localStorage.getItem('jwtToken');
      const url = '/invitations';
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(invitations)
      });
      if (response.ok) {
        this.props.resetCheckout();
        this.props.setAlert('invitations Send', 'success', 5000);
        return { status: 'success', message: 'invitations Send' };
      }
    } catch (error) {
      this.props.setAlert(error.message, 'error', 5000);
      return {
        status: 'error',
        message: ' invitations have not send, try again.'
      };
    }
  };

  createInvitations = () => {
    const {
      user,
      movie,
      cinema,
      selectedDate,
      selectedTime,
      invitations
    } = this.props;

    const invArray = Object.keys(invitations)
      .map(key => ({
        to: invitations[key],
        host: user.name,
        movie: movie.title,
        time: selectedTime,
        date: new Date(selectedDate).toDateString(),
        cinema: cinema.name,
        image: cinema.image,
        seat: key
      }))
      .filter(inv => inv.to !== '');
    return invArray;
  };

  setSuggestionSeats = (seats, suggestedSeats) => {
    if (!seats || !seats.length || !suggestedSeats || !Array.isArray(suggestedSeats)) return seats;
    suggestedSeats.forEach(suggestedSeat => {
      if (
        Array.isArray(suggestedSeat) &&
        seats[suggestedSeat[0]] &&
        seats[suggestedSeat[0]][suggestedSeat[1]] !== undefined
      ) {
        seats[suggestedSeat[0]][suggestedSeat[1]] = 3;
      }
    });
    return seats;
  };

  render() {
    const {
      classes,
      user,
      movie,
      cinema,
      cinemas,
      showtimes,
      selectedSeats,
      selectedCinema,
      selectedDate,
      selectedTime,
      showLoginPopup,
      toggleLoginPopup,
      showInvitation,
      invitations,
      setInvitation,
      resetCheckout,
      suggestedSeats,
      suggestedSeat
    } = this.props;

    const currentCinema = cinema || (cinemas && cinemas.find(c => c._id === selectedCinema));

    const { uniqueCinemas, uniqueTimes } = this.onFilterCinema();
    let seats = this.onGetReservedSeats();

    if (suggestedSeat && suggestedSeat.length && !this.didSetSuggestion) {
      seats = this.setSuggestionSeats(seats, suggestedSeat);
      this.didSetSuggestion = true;
    }

    // Apply selectedSeats to the seats array
    if (selectedSeats && selectedSeats.length && seats && seats.length) {
      selectedSeats.forEach(seatCoord => {
        if (Array.isArray(seatCoord) && seatCoord.length >= 2) {
          const [row, seat] = seatCoord;
          if (seats[row] && seats[row][seat] !== undefined) {
            seats[row][seat] = 2; // 2 = Selected
          }
        }
      });
    }

    const { isSeatSelectionVisible, ticketCount, isTicketTypeModalOpen, isTermsModalOpen } = this.state;

    return (
      <div className={classes.root}>
        {currentCinema && (
          <TicketTypeModal
            open={isTicketTypeModalOpen}
            onClose={this.onCloseTicketTypeModal}
            totalTickets={selectedSeats ? selectedSeats.length : 0}
            adultPrice={currentCinema.ticketPrice || 1500}
            onProceed={this.onProceedTicketTypeModal}
          />
        )}
        {currentCinema && (
          <TermsAndConditionsModal
            open={isTermsModalOpen}
            onClose={this.onCloseTermsModal}
            onAgree={this.onAgreeTermsModal}
          />
        )}
        <ResponsiveDialog
          id="Edit-cinema"
          open={showLoginPopup}
          handleClose={() => toggleLoginPopup()}
          maxWidth="sm">
          <LoginForm />
        </ResponsiveDialog>
        {isSeatSelectionVisible ? (
          <>
            {currentCinema && (
              <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1200, backgroundColor: '#0a0a20', color: '#fff', overflowY: 'auto', paddingBottom: '100px' }}>
                <BookingSeats
                  seats={seats}
                  cinema={currentCinema}
                  selectedTime={selectedTime}
                  ticketCount={ticketCount}
                  onHideSeatSelection={this.onHideSeatSelection}
                  onSelectSeat={(indexRow, index) =>
                    this.onSelectSeat(indexRow, index)
                  }
                />
                <BookingCheckout
                  user={user}
                  ticketPrice={currentCinema.ticketPrice || 1500}
                  seatsAvailable={currentCinema.seatsAvailable || 100}
                  selectedSeats={selectedSeats ? selectedSeats.length : 0}
                  ticketCount={ticketCount}
                  onHideSeatSelection={this.onHideSeatSelection}
                  onBookSeats={this.onOpenTicketTypeModal}
                />
              </div>
            )}
            {!currentCinema && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', color: '#fff' }}>
                <Typography variant="h5" style={{ color: '#00C6FF', marginBottom: '20px' }}>Loading seat map...</Typography>
                <Button variant="outlined" style={{ color: '#fff', borderColor: '#00C6FF' }} onClick={this.onHideSeatSelection}>Back to Movie</Button>
              </div>
            )}
            {showInvitation && !!(selectedSeats && selectedSeats.length) && (
              <BookingInvitation
                selectedSeats={selectedSeats}
                sendInvitations={this.sendInvitations}
                ignore={resetCheckout}
                invitations={invitations}
                onSetInvitation={setInvitation}
                onDownloadPDF={this.jsPdfGenerator}
              />
            )}
          </>
        ) : (
          <>
            <MovieInfo movie={movie} />
            <Container maxWidth="xl" className={classes.container}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <BookingForm
                    cinemas={uniqueCinemas}
                    times={uniqueTimes}
                    showtimes={showtimes}
                    selectedCinema={selectedCinema}
                    selectedDate={selectedDate}
                    selectedTime={selectedTime}
                    onChangeCinema={this.onChangeCinema}
                    onChangeDate={this.onChangeDate}
                    onChangeTime={this.onChangeTime}
                    onShowSeatSelection={this.onShowSeatSelection}
                  />
                </Grid>
              </Grid>
            </Container>
          </>
        )}
      </div>
    );
  }
}

BookingPage.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

const mapStateToProps = (
  {
    authState,
    movieState,
    cinemaState,
    showtimeState,
    reservationState,
    checkoutState
  },
  ownProps
) => ({
  isAuth: authState.isAuthenticated,
  user: authState.user,
  movie: movieState.selectedMovie,
  cinema: cinemaState.selectedCinema,
  cinemas: cinemaState.cinemas,
  showtimes: showtimeState.showtimes.filter(
    showtime => showtime.movieId === ownProps.match.params.id
  ),
  reservations: reservationState.reservations,
  selectedSeats: checkoutState.selectedSeats,
  suggestedSeat: checkoutState.suggestedSeat,
  selectedCinema: checkoutState.selectedCinema,
  selectedDate: checkoutState.selectedDate,
  selectedTime: checkoutState.selectedTime,
  showLoginPopup: checkoutState.showLoginPopup,
  showInvitation: checkoutState.showInvitation,
  invitations: checkoutState.invitations,
  QRCode: checkoutState.QRCode,
  suggestedSeats: reservationState.suggestedSeats
});

const mapDispatchToProps = {
  getMovie,
  getCinema,
  getCinemasUserModeling,
  getCinemas,
  getShowtimes,
  getReservations,
  getSuggestedReservationSeats,
  addReservation,
  setSelectedSeats,
  setSuggestedSeats,
  setSelectedCinema,
  setSelectedDate,
  setSelectedTime,
  setInvitation,
  toggleLoginPopup,
  showInvitationForm,
  resetCheckout,
  setAlert,
  setQRCode
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(BookingPage));
