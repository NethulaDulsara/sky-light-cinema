export default theme => ({
  movieHero: {
    position: 'relative',
    height: props => (props.height ? props.height : '100%'),
    width: '100%',
    color: theme.palette.common.white,
    overflow: 'hidden',
    backgroundColor: theme.palette.background.dark,
    boxShadow: 'inset 0 -90px 110px -30px #070a10'
  },
  blurBackground: {
    position: 'absolute',
    top: 0,
    zIndex: 1,
    height: '100%',
    right: 0,
    backgroundSize: 'cover',
    backgroundPosition: 'center 22%',
    backgroundRepeat: 'no-repeat',
    width: '100%',
    transform: 'scale(1.02)'
  },
  infoSection: {
    position: 'relative',
    padding: theme.spacing(3),
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    background:
      'linear-gradient(to top, #070a10 1%, rgba(7,10,16,0.12) 40%, rgba(7,10,16,0) 70%), ' +
      'linear-gradient(to right, rgba(7,10,16,0.97) 0%, rgba(7,10,16,0.72) 32%, rgba(7,10,16,0.25) 62%, rgba(7,10,16,0.05) 85%)',
    zIndex: 2
  },
  movieHeader: {
    position: 'relative',
    padding: theme.spacing(3, 3, 3, 5),
    maxWidth: 640
  },
  tag: {
    display: 'inline-block',
    padding: theme.spacing(0.4, 2),
    marginRight: theme.spacing(1),
    fontSize: '0.78rem',
    fontWeight: 600,
    letterSpacing: '0.5px',
    color: '#fff',
    border: '1px solid rgba(255,255,255,0.22)',
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.06)',
    backdropFilter: 'blur(6px)',
    WebkitBackdropFilter: 'blur(6px)'
  },
  movieTitle: {
    maxWidth: '100%',
    fontSize: '3.4rem',
    lineHeight: 1.05,
    fontWeight: 800,
    letterSpacing: '-0.5px',
    textTransform: 'capitalize',
    textShadow: '0 2px 30px rgba(0,0,0,0.55)',
    marginBottom: theme.spacing(1.5)
  },
  director: {
    color: '#5bc4ff',
    fontWeight: 600,
    fontSize: '0.95rem',
    letterSpacing: '0.3px',
    marginTop: theme.spacing(1)
  },
  duration: {
    display: 'inline-block',
    marginTop: theme.spacing(2.5),
    padding: theme.spacing(0.6, 1.8),
    fontSize: '0.82rem',
    fontWeight: 700,
    letterSpacing: '0.5px',
    color: '#eaf7ff',
    borderRadius: 999,
    border: '1px solid rgba(0,198,255,0.4)',
    backgroundColor: 'rgba(0,198,255,0.08)'
  },
  genre: {
    display: 'inline-block',
    color: '#cee4fd',
    marginLeft: theme.spacing(2),
    fontSize: '0.9rem',
    letterSpacing: '0.4px',
    textTransform: 'capitalize'
  },
  descriptionText: {
    color: 'rgba(255,255,255,0.82)',
    fontSize: '1.02rem',
    lineHeight: 1.7,
    padding: theme.spacing(2.5, 0, 1),
    maxWidth: 520
  },
  footer: {
    position: 'absolute',
    left: theme.spacing(4),
    bottom: theme.spacing(2),
    zIndex: 2
  },
  icons: {
    display: 'inline-block',
    cursor: 'pointer',
    color: 'rgba(255, 255, 255, 0.4)',
    margin: theme.spacing(0, 1),
    transition: 'all 0.3s',
    '&:hover': {
      color: 'rgba(255, 255, 255, 0.8)',
      transform: 'scale(1.25)',
      transition: 'all 0.3s',
      transitionDelay: '0.15s'
    }
  },
  movieActions: {
    position: 'absolute',
    bottom: theme.spacing(5),
    right: theme.spacing(6),
    zIndex: 3
  },
  button: {
    minWidth: 190,
    height: 56,
    padding: theme.spacing(0, 3.5),
    borderRadius: 999,
    zIndex: 2,
    backgroundColor: '#00a0ee',
    color: '#fff',
    fontSize: '0.95rem',
    fontWeight: 700,
    letterSpacing: '0.5px',
    boxShadow: '0 2px 8px rgba(0, 160, 238, 0.25)',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease',
    '&:hover': {
      backgroundColor: '#008cd1',
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(0, 160, 238, 0.35)'
    }
  },
  learnMore: { color: '#fff' },
  buttonIcon: { marginLeft: theme.spacing(1.5) },
  [theme.breakpoints.down('sm')]: {
    infoSection: {
      background:
        'linear-gradient(to top, #070a10 2%, rgba(7,10,16,0.2) 45%, rgba(7,10,16,0) 75%), ' +
        'linear-gradient(to right, rgba(7,10,16,0.95) 55%, rgba(7,10,16,0.4) 100%)'
    },
    movieHeader: { maxWidth: '92%', padding: theme.spacing(2) },
    movieTitle: {
      maxWidth: '100%',
      fontSize: '1.9rem'
    },
    descriptionText: {
      maxWidth: '100%',
      fontSize: '0.9rem'
    },
    tag: { padding: theme.spacing(0.3, 1.2), margin: theme.spacing(1, 1, 1, 0) },
    movieActions: {
      left: theme.spacing(2),
      right: theme.spacing(2),
      bottom: theme.spacing(3)
    },
    button: {
      width: '100%',
      height: 50,
      fontSize: 14
    }
  }
});
