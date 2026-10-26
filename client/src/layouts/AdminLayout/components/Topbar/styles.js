export default theme => ({
  root: {
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.4)',
    backgroundColor: 'rgba(11, 16, 27, 0.85)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    display: 'flex',
    alignItems: 'center',
    height: theme.topBar.height,
    zIndex: theme.zIndex.appBar
  },
  toolbar: {
    minHeight: 'auto',
    width: '100%',
    paddingLeft: 0,
    paddingRight: theme.spacing(3)
  },
  brandWrapper: {
    background: 'linear-gradient(135deg, rgba(0, 198, 255, 0.06) 0%, rgba(121, 40, 202, 0.06) 100%)',
    borderRight: '1px solid rgba(255, 255, 255, 0.08)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '270px',
    height: theme.topBar.height,
    flexShrink: 0,
    padding: theme.spacing(0, 2)
  },
  logo: {
    fontFamily: 'Montserrat, sans-serif',
    fontSize: '17px',
    fontWeight: 800,
    letterSpacing: '1.5px',
    background: 'linear-gradient(135deg, #00C6FF 0%, #0072FF 50%, #7928CA 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    textTransform: 'uppercase'
  },
  title: {
    marginLeft: theme.spacing(3),
    textTransform: 'uppercase',
    textDecoration: 'none',
    fontSize: '11px',
    letterSpacing: '1.5px',
    color: '#00C6FF',
    fontWeight: 700,
    background: 'rgba(0, 198, 255, 0.08)',
    border: '1px solid rgba(0, 198, 255, 0.25)',
    borderRadius: '20px',
    padding: '4px 14px'
  },
  menuButton: {
    color: '#94a3b8',
    padding: '8px',
    borderRadius: '10px',
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    transition: 'all 0.2s ease',
    '&:hover': {
      color: '#00C6FF',
      background: 'rgba(0, 198, 255, 0.1)',
      borderColor: 'rgba(0, 198, 255, 0.3)'
    },
    [theme.breakpoints.up('md')]: {
      display: 'none'
    }
  },
  notificationsButton: {
    marginLeft: 'auto',
    color: '#94a3b8',
    padding: '8px',
    borderRadius: '10px',
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    transition: 'all 0.2s ease',
    marginRight: theme.spacing(1),
    '&:hover': {
      color: '#00C6FF',
      background: 'rgba(0, 198, 255, 0.1)',
      borderColor: 'rgba(0, 198, 255, 0.3)'
    }
  },
  signOutButton: {
    color: '#f87171',
    padding: '8px',
    borderRadius: '10px',
    background: 'rgba(239, 68, 68, 0.06)',
    border: '1px solid rgba(239, 68, 68, 0.15)',
    transition: 'all 0.2s ease',
    '&:hover': {
      color: '#ffffff',
      background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
      borderColor: '#ef4444',
      boxShadow: '0 4px 15px rgba(239, 68, 68, 0.4)'
    }
  }
});
