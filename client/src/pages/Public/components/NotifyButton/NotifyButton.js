import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  makeStyles
} from '@material-ui/core';
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive';
import CheckIcon from '@material-ui/icons/Check';
import { setAlert } from '../../../../store/actions';

const useStyles = makeStyles(theme => ({
  btn: {
    borderRadius: 8,
    fontWeight: 700,
    letterSpacing: '0.3px',
    textTransform: 'none',
    color: '#fff',
    border: '1px solid rgba(0,198,255,0.5)',
    background: 'rgba(0,198,255,0.1)',
    '&:hover': { background: 'rgba(0,198,255,0.2)' }
  },
  btnDone: {
    borderRadius: 8,
    fontWeight: 700,
    textTransform: 'none',
    color: '#4ade80',
    border: '1px solid rgba(74,222,128,0.4)',
    background: 'rgba(74,222,128,0.08)',
    cursor: 'default'
  },
  dialogPaper: { background: '#121725', color: '#fff', borderRadius: 14 },
  input: { color: '#fff' }
}));

function NotifyButton({ movie, user, setAlert, fullWidth, className, size = 'small' }) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async emailToSend => {
    setLoading(true);
    try {
      const token = localStorage.getItem('jwtToken');
      const res = await fetch('/notify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ movieId: movie._id, email: emailToSend })
      });
      if (res.ok) {
        setDone(true);
        setOpen(false);
        setAlert(`We'll notify you when "${movie.title}" tickets open.`, 'success', 4000);
      } else {
        const d = await res.json().catch(() => ({}));
        setAlert(d.error || 'Could not add to watchlist', 'error', 4000);
      }
    } catch (e) {
      setAlert(e.message, 'error', 4000);
    } finally {
      setLoading(false);
    }
  };

  const handleClick = e => {
    e.preventDefault();
    e.stopPropagation();
    if (done) return;
    if (user && user.email) submit(user.email);
    else {
      setEmail('');
      setOpen(true);
    }
  };

  const handleDialogSubmit = () => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(email)) {
      setAlert('Please enter a valid email', 'error', 3000);
      return;
    }
    submit(email);
  };

  return (
    <>
      <Button
        size={size}
        fullWidth={fullWidth}
        className={`${done ? classes.btnDone : classes.btn} ${className || ''}`}
        onClick={handleClick}
        startIcon={done ? <CheckIcon /> : <NotificationsActiveIcon />}>
        {done ? 'On your watchlist' : 'Notify Me'}
      </Button>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{ className: classes.dialogPaper }}>
        <DialogTitle>Get notified</DialogTitle>
        <DialogContent>
          <Typography variant="body2" style={{ opacity: 0.75, marginBottom: 12 }}>
            Enter your email and we'll let you know the moment tickets for{' '}
            <strong>{movie.title}</strong> go on sale.
          </Typography>
          <TextField
            autoFocus
            fullWidth
            variant="outlined"
            label="Email address"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleDialogSubmit()}
            InputProps={{ className: classes.input }}
            InputLabelProps={{ style: { color: '#94a3b8' } }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} style={{ color: '#94a3b8' }}>
            Cancel
          </Button>
          <Button
            onClick={handleDialogSubmit}
            disabled={loading}
            variant="contained"
            color="primary">
            {loading ? 'Adding…' : 'Notify Me'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

NotifyButton.propTypes = {
  movie: PropTypes.object.isRequired,
  fullWidth: PropTypes.bool,
  className: PropTypes.string,
  size: PropTypes.string
};

const mapStateToProps = state => ({ user: state.authState.user });

export default connect(mapStateToProps, { setAlert })(NotifyButton);
