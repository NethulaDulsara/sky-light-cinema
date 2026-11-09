import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Chip } from '@material-ui/core';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { logout } from '../../store/actions';
import { history } from '../../utils';
import logo from '../../assets/logo.jpg';

const useStyles = makeStyles(theme => ({
  root: {
    minHeight: '100vh',
    background: '#070a10',
    color: '#fff',
    display: 'flex',
    flexDirection: 'column'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing(1.5, 3),
    background: '#0a0e17',
    borderBottom: '1px solid rgba(255,255,255,0.07)',
    position: 'sticky',
    top: 0,
    zIndex: 20
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1.5)
  },
  logoBadge: {
    width: 42,
    height: 42,
    borderRadius: 10,
    objectFit: 'cover',
    background: '#fff',
    flexShrink: 0
  },
  brandText: { lineHeight: 1.1 },
  brandTitle: { fontWeight: 800, fontSize: '1.05rem', letterSpacing: '0.3px' },
  brandSub: {
    fontSize: '0.68rem',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    color: '#00C6FF'
  },
  right: { display: 'flex', alignItems: 'center', gap: theme.spacing(2) },
  cashierChip: {
    background: 'rgba(0,198,255,0.12)',
    color: '#9bdcff',
    fontWeight: 600,
    border: '1px solid rgba(0,198,255,0.25)'
  },
  logout: {
    color: '#cbd5e1',
    textTransform: 'none',
    fontWeight: 600,
    '&:hover': { color: '#fff', background: 'rgba(255,255,255,0.06)' }
  },
  body: { flexGrow: 1, padding: theme.spacing(3), maxWidth: 1180, width: '100%', margin: '0 auto' }
}));

function POSLayout({ children, user, logout }) {
  const classes = useStyles();

  const handleLogout = async () => {
    await logout();
    history.push('/login');
  };

  const roleLabel =
    user && user.role === 'cashier'
      ? 'Cashier'
      : user && user.role
      ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
      : 'Staff';

  return (
    <div className={classes.root}>
      <header className={classes.header}>
        <div className={classes.brand}>
          <img className={classes.logoBadge} src={logo} alt="Sky Lights Cinema" />
          <div className={classes.brandText}>
            <div className={classes.brandTitle}>Sky Lights Cinema</div>
            <div className={classes.brandSub}>Box Office POS</div>
          </div>
        </div>
        <div className={classes.right}>
          <Chip
            className={classes.cashierChip}
            label={`${roleLabel}: ${user ? user.name : ''}`}
          />
          <Button
            className={classes.logout}
            startIcon={<ExitToAppIcon />}
            onClick={handleLogout}>
            Sign out
          </Button>
        </div>
      </header>
      <main className={classes.body}>{children}</main>
    </div>
  );
}

POSLayout.propTypes = {
  children: PropTypes.node,
  user: PropTypes.object,
  logout: PropTypes.func.isRequired
};

const mapStateToProps = state => ({ user: state.authState.user });

export default connect(mapStateToProps, { logout })(POSLayout);
