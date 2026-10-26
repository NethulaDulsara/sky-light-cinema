import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles, Container, Grid, Typography, Box, TextField, Checkbox, FormControlLabel, Button } from '@material-ui/core';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import { Redirect } from 'react-router-dom';
import { setAlert } from '../../../store/actions/alert';
import { updateReservation } from '../../../store/actions/reservations';
import MockPaymentGateway from './components/MockPaymentGateway/MockPaymentGateway';

const MastercardLogo = () => (
  <svg width="36" height="24" viewBox="0 0 36 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="36" height="24" rx="4" fill="#FFFFFF" />
    <circle cx="13" cy="12" r="7.5" fill="#EB001B" />
    <circle cx="23" cy="12" r="7.5" fill="#F79E1B" />
    <path d="M18 7.3a7.4 7.4 0 00-2.7 4.7 7.4 7.4 0 002.7 4.7 7.4 7.4 0 002.7-4.7A7.4 7.4 0 0018 7.3z" fill="#FF5F00" />
  </svg>
);

const VisaLogo = () => (
  <svg width="44" height="24" viewBox="0 0 44 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="44" height="24" rx="4" fill="#FFFFFF" />
    <path d="M17 6.5l-4.5 11H9.8L7.6 8.5c-.1-.5-.3-.7-.7-.9-.6-.3-1.6-.6-2.5-.8l.1-.3h4.5c.6 0 1.1.4 1.2 1l1.1 5.8 2.7-7.3H17zm10.7 7.3c0-2.6-3.6-2.8-3.6-4 0-.4.4-.7 1.2-.7.4 0 1.4 0 2.5.5l.3-1.8c-.5-.2-1.3-.3-2.1-.3-2.6 0-4.4 1.3-4.5 3.3 0 1.5 1.3 2.3 2.4 2.8 1 .5 1.4.8 1.4 1.3 0 .7-.8 1-1.7 1-1.3 0-2-.3-2.6-.6l-.3 1.8c.6.3 1.7.5 2.8.5 2.8 0 4.6-1.3 4.2-3.9zm6.7 3.5h2.4l-2.2-11h-2.2c-.5 0-1 .3-1.2.8l-4 10.2h2.7l.6-1.6h3.4l.5 1.6zm-3-3.5l1.4-3.8.7 3.8h-2.1zm-13.5-7.5l-2.2 11h-2.5l2.2-11h2.5z" fill="#1A1F71" />
  </svg>
);

const AmexLogo = () => (
  <svg width="34" height="24" viewBox="0 0 34 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="34" height="24" rx="4" fill="#006FCF" />
    <text x="17" y="15" fill="#FFFFFF" fontSize="8" fontWeight="bold" fontFamily="Arial, Helvetica, sans-serif" textAnchor="middle">
      AMEX
    </text>
  </svg>
);

const styles = theme => ({
  root: {
    backgroundColor: '#0a0b1a',
    minHeight: '100vh',
    paddingTop: theme.spacing(10),
    paddingBottom: theme.spacing(8),
    fontFamily: '"Montserrat", sans-serif',
    color: '#fff'
  },
  topBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#2a265f',
    padding: theme.spacing(2, 4),
    marginBottom: theme.spacing(4)
  },
  topBarTitle: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '18px',
    fontWeight: 700,
    cursor: 'pointer',
    color: '#f6b83f',
    textTransform: 'uppercase'
  },
  timerText: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '18px',
    fontWeight: 600,
    color: '#f6b83f'
  },
  card: {
    backgroundColor: '#ffffff',
    color: '#0f172a',
    borderRadius: '12px',
    padding: theme.spacing(4),
    marginBottom: theme.spacing(3),
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.25)',
    border: '1px solid rgba(0, 0, 0, 0.08)'
  },
  sectionTitle: {
    fontSize: '17px',
    fontWeight: 800,
    textTransform: 'uppercase',
    color: '#0f172a',
    marginBottom: theme.spacing(0.5)
  },
  subText: {
    fontSize: '13px',
    color: '#64748b',
    marginBottom: theme.spacing(3)
  },
  inputLabel: {
    fontSize: '13px',
    fontWeight: 700,
    marginBottom: theme.spacing(0.75),
    color: '#1e293b'
  },
  textField: {
    marginBottom: theme.spacing(2.5),
    '& .MuiInputBase-root': {
      backgroundColor: '#f8fafc',
      borderRadius: '8px',
      color: '#0f172a !important'
    },
    '& .MuiOutlinedInput-input': {
      color: '#0f172a !important',
      WebkitTextFillColor: '#0f172a !important',
      fontSize: '14px',
      fontWeight: 600,
      padding: '12px 14px'
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: '#cbd5e1 !important',
      borderWidth: '1.5px'
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: '#94a3b8 !important'
    },
    '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#2a265f !important',
      borderWidth: '2px !important'
    },
    '& input::placeholder': {
      color: '#94a3b8 !important',
      opacity: '1 !important',
      WebkitTextFillColor: '#94a3b8 !important',
      fontWeight: 400
    }
  },
  customInput: {
    color: '#0f172a !important',
    WebkitTextFillColor: '#0f172a !important',
    fontSize: '14px !important',
    fontWeight: '600 !important'
  },
  paymentMethodContainer: {
    display: 'flex',
    gap: '16px',
    marginBottom: theme.spacing(3),
    marginTop: theme.spacing(1.5)
  },
  paymentMethodBox: {
    border: '2px solid #e2e8f0',
    backgroundColor: '#f8fafc',
    borderRadius: '10px',
    padding: theme.spacing(1, 2),
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '62px',
    minWidth: '150px',
    transition: 'all 0.2s ease',
    '&:hover': {
      borderColor: '#94a3b8',
      backgroundColor: '#f1f5f9'
    },
    '&.selected': {
      borderColor: '#2a265f',
      backgroundColor: '#ede9fe',
      boxShadow: '0 0 0 1px #2a265f'
    }
  },
  promoBox: {
    border: '1px solid #cbd5e1',
    borderRadius: '10px',
    padding: theme.spacing(2),
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(3),
    cursor: 'pointer',
    fontWeight: 700,
    fontSize: '14px',
    backgroundColor: '#fff',
    color: '#0f172a',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
  },
  movieTitle: {
    fontSize: '18px',
    fontWeight: 800,
    textTransform: 'uppercase',
    marginBottom: theme.spacing(1)
  },
  movieDetails: {
    fontSize: '12px',
    color: '#444',
    lineHeight: 1.6,
    textTransform: 'uppercase',
    marginBottom: theme.spacing(3)
  },
  summaryTitle: {
    fontSize: '16px',
    fontWeight: 700,
    marginBottom: theme.spacing(2)
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '13px',
    marginBottom: theme.spacing(1),
    color: '#333'
  },
  subTotalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '16px',
    fontWeight: 700,
    marginTop: theme.spacing(2),
    paddingTop: theme.spacing(2),
    borderTop: '1px solid #ccc'
  },
  payableBox: {
    backgroundColor: '#2a265f',
    color: '#fff',
    padding: theme.spacing(2),
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: '4px',
    marginTop: theme.spacing(2),
    fontSize: '18px',
    fontWeight: 700
  },
  payButton: {
    backgroundColor: '#2a265f',
    color: '#fff',
    padding: theme.spacing(1.5),
    fontSize: '16px',
    fontWeight: 700,
    width: '100%',
    marginTop: theme.spacing(2),
    '&:hover': {
      backgroundColor: '#1d1947'
    },
    '&.Mui-disabled': {
      backgroundColor: '#ccc',
      color: '#666'
    }
  }
});

class PaymentPage extends Component {
  state = {
    timeLeft: 300, // 5 minutes
    selectedPayment: 'visa',
    agreedToTerms: false,
    isMockGatewayOpen: false,
    formData: {
      name: '',
      email: '',
      mobile: ''
    }
  };

  componentDidMount() {
    if (!window.payhere) {
      const script = document.createElement('script');
      script.src = 'https://www.payhere.lk/lib/payhere.js';
      script.async = true;
      document.body.appendChild(script);
    }

    this.timer = setInterval(() => {
      this.setState(prevState => {
        if (prevState.timeLeft <= 1) {
          clearInterval(this.timer);
          this.props.setAlert('Payment session expired. Please book again.', 'error', 5000);
          this.props.history.push('/');
          return { timeLeft: 0 };
        }
        return { timeLeft: prevState.timeLeft - 1 };
      });
    }, 1000);

    // Pre-fill user data if available
    const { user } = this.props;
    if (user) {
      this.setState({
        formData: {
          name: user.name || '',
          email: user.email || '',
          mobile: user.phone || ''
        }
      });
    }
  }

  componentWillUnmount() {
    if (this.timer) clearInterval(this.timer);
  }

  formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  handleInputChange = (e) => {
    const { name, value } = e.target;
    this.setState(prevState => ({
      formData: { ...prevState.formData, [name]: value }
    }));
  };

  handlePayment = async () => {
    const { formData, agreedToTerms } = this.state;
    const { match, updateReservation, setAlert, history, location } = this.props;
    
    if (!formData.name || !formData.email || !formData.mobile) {
      return setAlert('Please fill in all details', 'error', 3000);
    }
    if (!agreedToTerms) {
      return setAlert('Please agree to the Terms & Conditions', 'error', 3000);
    }

    const reservationId = match.params.reservationId;
    
    // 1. Update reservation with guest details first
    const result = await updateReservation({
      username: formData.name,
      email: formData.email,
      phone: formData.mobile
    }, reservationId);

    if (!result || result.status !== 'success') {
      return setAlert('Failed to update booking details. Please try again.', 'error', 5000);
    }

    // 2. Fetch the secure hash from the backend
    const totalPrice = location.state.totalPrice;
    try {
      const response = await fetch('/reservations/payhere/hash', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_id: reservationId,
          amount: totalPrice,
          currency: 'LKR'
        })
      });
      const data = await response.json();

      // 3. Setup PayHere object
      const payment = {
        sandbox: true,
        merchant_id: data.merchant_id,
        return_url: window.location.origin,
        cancel_url: window.location.origin,
        notify_url: 'http://localhost:8080/reservations/payhere/notify', // Localhost won't receive webhooks from outside, but works for frontend flow
        order_id: reservationId,
        items: 'Movie Tickets',
        amount: parseFloat(totalPrice).toFixed(2),
        currency: 'LKR',
        hash: data.hash,
        first_name: formData.name.split(' ')[0] || 'Guest',
        last_name: formData.name.split(' ').slice(1).join(' ') || 'User',
        email: formData.email,
        phone: formData.mobile,
        address: 'No 1, Galle Road',
        city: 'Colombo',
        country: 'Sri Lanka'
      };

      // 4. Handle Callbacks
      window.payhere.onCompleted = function onCompleted(orderId) {
        setAlert('Payment Successful & Booking Confirmed!', 'success', 5000);
        history.push('/');
      };

      window.payhere.onDismissed = function onDismissed() {
        setAlert('Payment popup closed by user', 'error', 3000);
      };

      window.payhere.onError = function onError(error) {
        setAlert('Error processing payment: ' + error, 'error', 3000);
      };

      // 5. Start Checkout
      window.payhere.startPayment(payment);

    } catch (e) {
      console.error("Payment initiation error:", e);
      setAlert(`Error: ${e.message}`, 'error', 5000);
    }
  };

  render() {
    const { classes, location } = this.props;
    const { timeLeft, selectedPayment, agreedToTerms, formData } = this.state;

    const bookingData = location.state;
    
    // If someone visits /payment without coming from booking, redirect back
    if (!bookingData) {
      return <Redirect to="/" />;
    }

    const {
      movieTitle,
      cinemaName,
      date,
      time,
      seats,
      totalPrice,
      adultCount,
      childCount
    } = bookingData;

    const formatPrice = (price) => {
      return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    const getSeatLabels = () => {
      // seats is an array of [row, col] coords
      // We need to convert them to e.g. A1, B2
      if (!seats || !seats.length) return '';
      // Assume cinema has a certain number of rows. Since we don't have total rows easily here,
      // we just show the raw numbers or a generic label.
      // In BookingSeats, rowLabel is String.fromCharCode(65 + seats.length - 1 - indexRow)
      // Since we don't have seats.length here, let's just show indices.
      return seats.map(s => `R${s[0]+1}C${s[1]+1}`).join(', ');
    };

    return (
      <div className={classes.root}>
        <div className={classes.topBar}>
          <div className={classes.topBarTitle} onClick={() => this.props.history.goBack()}>
            <ArrowBackIosIcon style={{ fontSize: '16px', marginRight: '8px' }} />
            MAKE YOUR PAYMENT
          </div>
          <div className={classes.timerText}>
            <AccessTimeIcon style={{ marginRight: '8px' }} />
            TIME LEFT: {this.formatTime(timeLeft)}
          </div>
        </div>

        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {/* Left Column */}
            <Grid item xs={12} md={7}>
              <Box className={classes.card}>
                <Typography className={classes.sectionTitle}>ENTER YOUR DETAILS HERE</Typography>
                <Typography className={classes.subText}>Please provide your contact information to complete your booking</Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Typography className={classes.inputLabel}>First & Last name *</Typography>
                    <TextField 
                      fullWidth 
                      variant="outlined" 
                      size="small" 
                      className={classes.textField}
                      InputProps={{ classes: { input: classes.customInput } }}
                      placeholder="Enter your full name"
                      name="name"
                      value={formData.name || ''}
                      onChange={this.handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography className={classes.inputLabel}>Email address *</Typography>
                    <TextField 
                      fullWidth 
                      variant="outlined" 
                      size="small" 
                      className={classes.textField}
                      InputProps={{ classes: { input: classes.customInput } }}
                      placeholder="Enter your email address"
                      name="email"
                      value={formData.email || ''}
                      onChange={this.handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography className={classes.inputLabel}>Mobile number *</Typography>
                    <TextField 
                      fullWidth 
                      variant="outlined" 
                      size="small" 
                      className={classes.textField}
                      InputProps={{ classes: { input: classes.customInput } }}
                      placeholder="Enter mobile number"
                      name="mobile"
                      value={formData.mobile || ''}
                      onChange={this.handleInputChange}
                    />
                  </Grid>
                </Grid>

                <Typography className={classes.sectionTitle} style={{ marginTop: '20px' }}>SELECT PAYMENT METHOD</Typography>
                <div className={classes.paymentMethodContainer}>
                  <div 
                    className={`${classes.paymentMethodBox} ${selectedPayment === 'visa' ? 'selected' : ''}`}
                    onClick={() => this.setState({ selectedPayment: 'visa' })}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <MastercardLogo />
                      <VisaLogo />
                    </div>
                  </div>
                  <div 
                    className={`${classes.paymentMethodBox} ${selectedPayment === 'ntb' ? 'selected' : ''}`}
                    onClick={() => this.setState({ selectedPayment: 'ntb' })}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <AmexLogo />
                      <Typography style={{ fontWeight: 800, color: '#00529b', fontSize: '13px' }}>
                        NTB Bank
                      </Typography>
                    </div>
                  </div>
                </div>

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={agreedToTerms}
                      onChange={(e) => this.setState({ agreedToTerms: e.target.checked })}
                      color="primary"
                    />
                  }
                  label={<Typography style={{ fontSize: '13px' }}>By clicking "Make Payment" you agree to the Terms & Conditions.</Typography>}
                />

                <Button 
                  className={classes.payButton}
                  disabled={!agreedToTerms || !formData.name || !formData.email || !formData.mobile}
                  onClick={this.handlePayment}
                >
                  PAY NOW LKR {formatPrice(totalPrice)}
                </Button>
              </Box>
            </Grid>

            {/* Right Column */}
            <Grid item xs={12} md={5}>
              <div className={classes.promoBox}>
                <span style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ marginRight: '8px' }}>🏷️</span> APPLY PROMO OR VOUCHER CODES
                </span>
                <span>&gt;</span>
              </div>

              <Box className={classes.card}>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                  <Typography className={classes.movieTitle}>{movieTitle}</Typography>
                  <Box textAlign="center">
                    <Typography style={{ fontSize: '24px', fontWeight: 700, lineHeight: 1 }}>{adultCount + childCount}</Typography>
                    <Typography style={{ fontSize: '10px', color: '#666' }}>TICKETS</Typography>
                  </Box>
                </Box>
                
                <Typography className={classes.movieDetails}>
                  DIGITAL 2D, {new Date(date).toDateString().toUpperCase()}, {time}<br/>
                  {cinemaName}<br/>
                  SEATS: {getSeatLabels()}<br/>
                  TICKETS: ODC ADULT x{adultCount} {childCount > 0 ? `, ODC CHILD x${childCount}` : ''}
                </Typography>

                <Typography className={classes.summaryTitle}>ORDER SUMMARY</Typography>
                
                <div className={classes.summaryRow}>
                  <span>Total Ticket(s) Price</span>
                  <span>LKR {formatPrice(totalPrice)}</span>
                </div>
                <div className={classes.summaryRow} style={{ fontSize: '11px', color: '#888' }}>
                  <span>Bank Charges & VAT Included</span>
                </div>

                <div className={classes.subTotalRow}>
                  <span>SUB TOTAL</span>
                  <span>LKR {formatPrice(totalPrice)}</span>
                </div>

                <div className={classes.payableBox}>
                  <span>PAYABLE AMOUNT</span>
                  <span>LKR {formatPrice(totalPrice)}</span>
                </div>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </div>
    );
  }
}

PaymentPage.propTypes = {
  classes: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  user: PropTypes.object,
  setAlert: PropTypes.func.isRequired,
  updateReservation: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  user: state.authState.user
});

const mapDispatchToProps = {
  setAlert,
  updateReservation
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(PaymentPage));
