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
    backgroundColor: '#fff',
    color: '#000',
    borderRadius: '4px',
    padding: theme.spacing(4),
    marginBottom: theme.spacing(3)
  },
  sectionTitle: {
    fontSize: '16px',
    fontWeight: 700,
    textTransform: 'uppercase',
    marginBottom: theme.spacing(1)
  },
  subText: {
    fontSize: '12px',
    color: '#666',
    marginBottom: theme.spacing(3)
  },
  inputLabel: {
    fontSize: '12px',
    fontWeight: 600,
    marginBottom: theme.spacing(0.5),
    color: '#333'
  },
  textField: {
    marginBottom: theme.spacing(3),
    '& .MuiOutlinedInput-root': {
      color: '#000',
      '& fieldset': {
        borderColor: '#ccc',
      },
      '&:hover fieldset': {
        borderColor: '#999',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#2a265f',
      },
    },
    '& input::placeholder': {
      color: '#888',
      opacity: 1
    }
  },
  paymentMethodContainer: {
    display: 'flex',
    gap: '16px',
    marginBottom: theme.spacing(3)
  },
  paymentMethodBox: {
    border: '2px solid #ccc',
    borderRadius: '8px',
    padding: theme.spacing(1, 2),
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '60px',
    width: '140px',
    '&.selected': {
      borderColor: '#2a265f',
      backgroundColor: '#f5f5ff'
    }
  },
  promoBox: {
    border: '1px solid #ccc',
    borderRadius: '4px',
    padding: theme.spacing(2),
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(3),
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: '14px',
    backgroundColor: '#fff',
    color: '#000'
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
    const { setAlert } = this.props;
    
    if (!formData.name || !formData.email || !formData.mobile) {
      return setAlert('Please fill in all details', 'error', 3000);
    }
    if (!agreedToTerms) {
      return setAlert('Please agree to the Terms & Conditions', 'error', 3000);
    }

    // Open Mock Payment Gateway instead of submitting immediately
    this.setState({ isMockGatewayOpen: true });
  };

  processActualPayment = async () => {
    const { formData } = this.state;
    const { match, updateReservation, setAlert, history } = this.props;

    const reservationId = match.params.reservationId;
    
    // Update reservation with guest details
    const result = await updateReservation({
      username: formData.name,
      email: formData.email,
      phone: formData.mobile
    }, reservationId);

    this.setState({ isMockGatewayOpen: false });

    if (result && result.status === 'success') {
      setAlert('Payment Successful & Booking Confirmed!', 'success', 5000);
      history.push('/');
    } else {
      setAlert('Failed to confirm booking, please try again.', 'error', 5000);
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
                      placeholder="Enter your full name"
                      name="name"
                      value={formData.name}
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
                      placeholder="Enter your email address"
                      name="email"
                      value={formData.email}
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
                      placeholder="Enter mobile number"
                      name="mobile"
                      value={formData.mobile}
                      onChange={this.handleInputChange}
                    />
                  </Grid>
                </Grid>

                <Typography className={classes.sectionTitle} style={{ marginTop: '16px' }}>SELECT PAYMENT METHOD</Typography>
                <div className={classes.paymentMethodContainer}>
                  <div 
                    className={`${classes.paymentMethodBox} ${selectedPayment === 'visa' ? 'selected' : ''}`}
                    onClick={() => this.setState({ selectedPayment: 'visa' })}
                  >
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1200px-Mastercard-logo.svg.png" alt="Mastercard" style={{ height: '32px', marginRight: '8px', objectFit: 'contain' }} />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Visa_Logo.png/600px-Visa_Logo.png" alt="Visa" style={{ height: '20px', objectFit: 'contain' }} />
                  </div>
                  <div 
                    className={`${classes.paymentMethodBox} ${selectedPayment === 'ntb' ? 'selected' : ''}`}
                    onClick={() => this.setState({ selectedPayment: 'ntb' })}
                  >
                    <Typography style={{ fontWeight: 800, color: '#00529b', fontSize: '14px', display: 'flex', alignItems: 'center' }}>
                      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/American_Express_logo_%282018%29.svg/1200px-American_Express_logo_%282018%29.svg.png" alt="Amex" style={{ height: '24px', marginRight: '6px' }} />
                      NTB Bank
                    </Typography>
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
        <MockPaymentGateway 
          open={this.state.isMockGatewayOpen} 
          onClose={() => this.setState({ isMockGatewayOpen: false })}
          amount={totalPrice}
          onSuccess={this.processActualPayment}
        />
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
