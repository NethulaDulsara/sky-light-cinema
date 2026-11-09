export default theme => ({
  navbar: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    padding: '1.1rem 34px',
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    transform: 'translate3d(0,0,0)',
    backfaceVisibility: 'hidden',
    zIndex: 999,
    background:
      'linear-gradient(to bottom, rgba(7,10,16,0.78) 0%, rgba(7,10,16,0) 100%)',
    transition: 'padding 300ms ease, background 300ms ease, box-shadow 300ms ease'
  },
  navbarColor: {
    padding: '0.65rem 34px',
    background: 'rgba(10, 14, 23, 0.82)',
    backdropFilter: 'blur(14px)',
    WebkitBackdropFilter: 'blur(14px)',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
    boxShadow: '0 10px 30px rgba(0,0,0,0.45)'
  },
  logoLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '12px',
    paddingTop: '.15rem',
    paddingBottom: '.15rem',
    marginRight: '20px',
    lineHeight: 'inherit',
    whiteSpace: 'nowrap',
    textDecoration: 'none'
  },
  logoIcon: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    fontSize: '1.5rem',
    borderRadius: 11,
    color: '#fff',
    background: 'linear-gradient(135deg, #00C6FF 0%, #0072FF 100%)',
    boxShadow: '0 4px 16px rgba(0,114,255,0.45)'
  },
  logo: {
    maxHeight: '2.4rem',
    width: 'auto',
    fontSize: '1.7rem',
    fontWeight: 800,
    letterSpacing: '0.4px',
    lineHeight: 1,
    color: theme.palette.common.white
  },
  logoThin: {
    fontWeight: 400,
    color: theme.palette.text.secondary
  },
  navLinks: {
    marginLeft: 'auto',
    display: 'flex'
  },
  navLink: {
    position: 'relative',
    color: 'rgba(255,255,255,0.82)',
    padding: '6px 2px',
    margin: '0 1.05rem',
    fontSize: '0.98rem',
    fontWeight: 600,
    letterSpacing: '0.3px',
    cursor: 'pointer',
    textDecoration: 'none',
    zIndex: 2,
    transition: 'color 200ms ease',
    '&:after': {
      content: '""',
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      margin: '0 auto',
      width: 0,
      height: '2px',
      borderRadius: 2,
      background: 'linear-gradient(135deg, #00C6FF 0%, #0072FF 100%)',
      transition: 'width 220ms ease',
      zIndex: 1
    },
    '&:hover': {
      color: '#fff'
    },
    '&:hover:after': {
      width: '100%'
    }
  },
  navAccount: {
    marginLeft: 'auto',
    marginRight: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(0.5),
    '& .MuiIconButton-root': {
      color: 'rgba(255,255,255,0.85)',
      transition: 'color 200ms ease, background-color 200ms ease'
    },
    '& .MuiIconButton-root:hover': {
      color: '#fff',
      backgroundColor: 'rgba(255,255,255,0.08)'
    }
  },
  iconBtn: {},
  navMobile: { marginRight: theme.spacing(1) },
  navIcon: {
    display: 'none',
    height: '30px',
    width: '30px',
    position: 'relative',
    zIndex: 2,
    cursor: 'pointer',
    '&:hover $navIconLine__left, &:hover $navIconLine__right': {
      width: '30px'
    }
  },
  navIconLine: {
    height: '2px',
    width: '30px',
    display: 'block',
    backgroundColor: theme.palette.common.white,
    marginBottom: '7px',
    transition: ' transform .2s ease, background-color .5s ease'
  },
  navIconLine__left: {
    width: '20px',
    transition: 'all 200ms linear'
  },
  navIconLine__right: {
    width: '20px',
    transition: 'all 200ms linear'
  },

  nav: {
    display: 'flex',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
    paddingLeft: 0,
    marginBottom: 0,
    '&:before, &:after': {
      content: '""',
      position: 'fixed',
      width: '100vw',
      height: '100vh',
      background: 'rgba(255, 255, 255, 0.1)',
      zIndex: '-1',
      transition: 'transform cubic-bezier(0.77, 0, 0.175, 1) 0.8s',
      transform: 'translateX(0%) translateY(-100%)'
    },
    '&:before': {
      background: theme.palette.common.black,
      transitionDelay: '0s'
    },
    '&:after': {
      transitionDelay: '.1s'
    }
  },
  navActive: {
    visibility: 'visible',
    zIndex: 9,
    '&:before': {
      transitionDelay: '0s',
      transform: 'translateX(0%) translateY(0%)'
    },
    '&:after': {
      transitionDelay: '.1s',
      transform: 'translateX(0%) translateY(0%)'
    },
    '& $navContent': {
      visibility: 'visible'
    },
    '& $navContent $currentPageShadow': {
      transitionDelay: '.5s',
      opacity: 0.03,
      marginTop: '0'
    },
    '& $navContent $innerNavListItem': {
      transitionDelay: '.5s',
      opacity: 1,
      transform: 'translateX(0%)',
      transition: 'opacity .3s ease, transform .3s ease, color .3s ease'
    }
  },
  navContent: {
    position: 'fixed',
    visibility: 'hidden',
    top: '50%',
    transform: 'translate(0%, -50%)',
    width: '100%'
  },
  currentPageShadow: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    fontFamily: 'sans-serif',
    fontSize: '10rem',
    fontWeight: 800,
    marginTop: '25px',
    color: '#fff',
    opacity: 0,
    transition: 'all 300ms linear'
  },
  innerNav: {
    position: 'relative',
    padding: 0,
    margin: 0,
    zIndex: 2
  },
  innerNavListItem: {
    opacity: 0,
    position: 'relative',
    display: 'block',
    textAlign: 'center',
    fontSize: '4rem',
    lineHeight: '1.05',
    letterSpacing: '3px',
    transform: 'translate(0%, 100%)',
    transition: 'opacity .2s ease, transform .3s ease'
  },
  innerNavLink: {
    position: 'relative',
    color: theme.palette.common.white,
    padding: '0 .5rem',
    margin: '0 1rem',
    fontSize: '2rem',
    fontWeight: 600,
    cursor: 'pointer',
    textDecoration: 'none',
    zIndex: 2,
    '&:after': {
      content: '""',
      position: 'absolute',
      bottom: 0,
      left: 0,
      width: '100%',
      opacity: 0,
      height: 0,
      marginTop: '3px',
      backgroundColor: 'rgba(255,255,255,0.5)',
      transition: 'all 200ms linear',
      zIndex: 1
    },
    '&:hover:after': {
      opacity: 1,
      height: 15
    }
  },
  [theme.breakpoints.down('sm')]: {
    navIcon: { display: 'block' },
    navLinks: { display: 'none' }
  }
});
