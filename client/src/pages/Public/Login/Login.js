import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, Grid, Typography, IconButton } from '@material-ui/core';
import { ArrowBack as ArrowBackIcon } from '@material-ui/icons';
import ConfirmationNumberIcon from '@material-ui/icons/ConfirmationNumberOutlined';
import HistoryIcon from '@material-ui/icons/HistoryOutlined';
import StarIcon from '@material-ui/icons/StarBorderOutlined';
import FlashOnIcon from '@material-ui/icons/FlashOnOutlined';
import LoginForm from './components/LoginForm';
import logo from '../../../assets/logo.jpg';

const BENEFITS = [
  { icon: FlashOnIcon, title: 'Faster checkout', text: 'Your details are pre-filled every time.' },
  { icon: HistoryIcon, title: 'Booking history & e-tickets', text: 'All your bookings and QR codes in one place.' },
  { icon: ConfirmationNumberIcon, title: 'Manage your bookings', text: 'Cancel or request refunds right from your dashboard.' },
  { icon: StarIcon, title: 'Personalised picks', text: 'Seat suggestions and recommendations made for you.' }
];

const styles = theme => ({
  root: {
    backgroundColor: '#07080f',
    minHeight: '100vh'
  },
  grid: { minHeight: '100vh' },
  bgWrapper: {
    position: 'relative',
    [theme.breakpoints.down('sm')]: { display: 'none' }
  },
  bg: {
    position: 'relative',
    height: '100%',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: theme.spacing(8),
    color: '#fff',
    backgroundImage:
      'linear-gradient(135deg, rgba(7,8,15,0.55) 0%, rgba(7,8,15,0.92) 100%), url(https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1400&q=80)',
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  },
  brand: {
    fontSize: '2rem',
    fontWeight: 800,
    letterSpacing: '0.5px',
    marginBottom: theme.spacing(1),
    background: 'linear-gradient(90deg,#00C6FF 0%,#7b61ff 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  },
  tagline: {
    fontSize: '1.05rem',
    color: '#cbd5e1',
    maxWidth: 420,
    marginBottom: theme.spacing(5),
    lineHeight: 1.6
  },
  benefitsTitle: {
    fontSize: '0.8rem',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    color: '#00C6FF',
    marginBottom: theme.spacing(2)
  },
  benefit: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: theme.spacing(2),
    marginBottom: theme.spacing(2.5),
    maxWidth: 440
  },
  benefitIcon: {
    color: '#00C6FF',
    background: 'rgba(0,198,255,0.1)',
    borderRadius: 10,
    padding: 8,
    fontSize: 36
  },
  benefitTitle: { fontWeight: 700, fontSize: '0.95rem' },
  benefitText: { fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.4 },
  formSide: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh'
  },
  contentHeader: {
    paddingTop: theme.spacing(4),
    paddingLeft: theme.spacing(3)
  },
  backButton: { color: '#94a3b8' },
  contentBody: {
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  formCard: {
    width: '100%',
    maxWidth: 460
  }
});

class Login extends Component {
  handleBack = () => this.props.history.goBack();

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Grid className={classes.grid} container>
          <Grid className={classes.bgWrapper} item md={6}>
            <div className={classes.bg}>
              <img
                src={logo}
                alt="Sky Lights Cinema"
                style={{
                  width: 132,
                  height: 132,
                  borderRadius: 18,
                  background: '#fff',
                  objectFit: 'cover',
                  marginBottom: 20,
                  boxShadow: '0 12px 30px rgba(0,0,0,0.45)'
                }}
              />
              <Typography className={classes.tagline}>
                Sign in to book faster, keep your tickets together, and get more out
                of every visit.
              </Typography>
              <Typography className={classes.benefitsTitle}>Member benefits</Typography>
              {BENEFITS.map(({ icon: Icon, title, text }) => (
                <div className={classes.benefit} key={title}>
                  <Icon className={classes.benefitIcon} />
                  <div>
                    <Typography className={classes.benefitTitle}>{title}</Typography>
                    <Typography className={classes.benefitText}>{text}</Typography>
                  </div>
                </div>
              ))}
            </div>
          </Grid>

          <Grid className={classes.formSide} item md={6} xs={12}>
            <div className={classes.contentHeader}>
              <IconButton className={classes.backButton} onClick={this.handleBack} aria-label="Go back">
                <ArrowBackIcon />
              </IconButton>
            </div>
            <div className={classes.contentBody}>
              <div className={classes.formCard}>
                <LoginForm redirect />
              </div>
            </div>
          </Grid>
        </Grid>
      </div>
    );
  }
}

Login.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

export default withStyles(styles)(Login);
