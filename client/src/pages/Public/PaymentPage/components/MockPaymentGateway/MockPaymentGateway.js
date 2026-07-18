import React, { Component } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Typography,
  Box,
  CircularProgress,
  withStyles
} from '@material-ui/core';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';

const styles = theme => ({
  dialogPaper: {
    borderRadius: '12px',
    padding: theme.spacing(3),
    minWidth: '350px',
    textAlign: 'center',
    backgroundColor: '#ffffff',
    color: '#333333'
  },
  header: {
    fontWeight: 'bold',
    fontSize: '20px',
    marginBottom: theme.spacing(1),
  },
  amount: {
    fontSize: '28px',
    fontWeight: '800',
    color: '#2a265f',
    marginBottom: theme.spacing(3),
  },
  input: {
    marginBottom: theme.spacing(2),
    '& .MuiOutlinedInput-root': {
      backgroundColor: '#f5f5f5',
    }
  },
  payButton: {
    marginTop: theme.spacing(2),
    backgroundColor: '#2a265f',
    color: '#fff',
    padding: theme.spacing(1.5),
    fontWeight: 'bold',
    '&:hover': {
      backgroundColor: '#1d1947'
    }
  },
  loadingBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '250px'
  },
  successBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '250px',
    color: '#4caf50'
  }
});

class MockPaymentGateway extends Component {
  state = {
    cardNumber: '',
    expiry: '',
    cvv: '',
    status: 'idle', // idle, loading, success
    error: ''
  };

  handleInputChange = (e) => {
    this.setState({ [e.target.name]: e.target.value, error: '' });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { cardNumber, expiry, cvv } = this.state;

    if (cardNumber.length < 15) {
      return this.setState({ error: 'Please enter a valid card number' });
    }
    if (expiry.length < 4) {
      return this.setState({ error: 'Please enter a valid expiry date' });
    }
    if (cvv.length < 3) {
      return this.setState({ error: 'Please enter a valid CVV' });
    }

    this.setState({ status: 'loading' });

    // Simulate network latency
    setTimeout(() => {
      this.setState({ status: 'success' });
      // Call parent success handler after a brief moment to show the success checkmark
      setTimeout(() => {
        this.props.onSuccess();
      }, 1500);
    }, 2000);
  };

  render() {
    const { classes, open, onClose, amount } = this.props;
    const { status, error, cardNumber, expiry, cvv } = this.state;

    return (
      <Dialog
        open={open}
        onClose={status === 'loading' ? null : onClose}
        classes={{ paper: classes.dialogPaper }}
      >
        <DialogTitle className={classes.header}>Secure Checkout</DialogTitle>
        <DialogContent>
          {status === 'loading' && (
            <Box className={classes.loadingBox}>
              <CircularProgress style={{ color: '#2a265f' }} size={60} />
              <Typography style={{ marginTop: '20px', fontWeight: 'bold' }}>Processing Payment...</Typography>
            </Box>
          )}

          {status === 'success' && (
            <Box className={classes.successBox}>
              <CheckCircleOutlineIcon style={{ fontSize: '80px' }} />
              <Typography style={{ marginTop: '20px', fontWeight: 'bold', fontSize: '20px' }}>Payment Successful!</Typography>
            </Box>
          )}

          {status === 'idle' && (
            <form onSubmit={this.handleSubmit}>
              <Typography className={classes.amount}>LKR {amount.toFixed(2)}</Typography>
              
              <TextField
                className={classes.input}
                fullWidth
                variant="outlined"
                label="Card Number"
                name="cardNumber"
                value={cardNumber}
                onChange={this.handleInputChange}
                inputProps={{ maxLength: 16 }}
                placeholder="0000 0000 0000 0000"
                required
              />
              
              <Box display="flex" justifyContent="space-between">
                <TextField
                  className={classes.input}
                  style={{ width: '48%' }}
                  variant="outlined"
                  label="MM/YY"
                  name="expiry"
                  value={expiry}
                  onChange={this.handleInputChange}
                  inputProps={{ maxLength: 5 }}
                  placeholder="MM/YY"
                  required
                />
                <TextField
                  className={classes.input}
                  style={{ width: '48%' }}
                  variant="outlined"
                  label="CVV"
                  name="cvv"
                  value={cvv}
                  onChange={this.handleInputChange}
                  type="password"
                  inputProps={{ maxLength: 4 }}
                  required
                />
              </Box>

              {error && (
                <Typography color="error" style={{ marginTop: '10px', fontSize: '14px' }}>
                  {error}
                </Typography>
              )}

              <Button
                type="submit"
                fullWidth
                className={classes.payButton}
              >
                Process Payment
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    );
  }
}

export default withStyles(styles)(MockPaymentGateway);
