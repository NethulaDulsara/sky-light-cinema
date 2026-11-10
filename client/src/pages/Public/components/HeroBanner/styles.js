import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(theme => ({
  hero: {
    position: 'relative',
    width: '100%',
    height: props => props.height || '85vh',
    overflow: 'hidden',
    backgroundColor: '#05070c',
    color: theme.palette.common.white
  },
  backdrop: {
    position: 'absolute',
    inset: 0,
    backgroundSize: 'cover',
    backgroundPosition: 'center 25%',
    backgroundRepeat: 'no-repeat',
    transform: 'scale(1.08)',
    filter: 'brightness(0.55)'
  },
  scrim: {
    position: 'absolute',
    inset: 0,
    background:
      'linear-gradient(to top, rgba(5,7,12,0.96) 0%, rgba(5,7,12,0.2) 45%, rgba(5,7,12,0.35) 100%), ' +
      'linear-gradient(to right, rgba(5,7,12,0.85) 0%, rgba(5,7,12,0.35) 55%, rgba(5,7,12,0.15) 100%)'
  },
  inner: {
    position: 'relative',
    zIndex: 2,
    height: '100%',
    maxWidth: 1240,
    margin: '0 auto',
    padding: theme.spacing(0, 6),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  content: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(5),
    marginBottom: theme.spacing(8)
  },
  posterLink: {
    flexShrink: 0,
    display: 'block',
    lineHeight: 0,
    borderRadius: 14,
    overflow: 'hidden',
    boxShadow: '0 24px 60px rgba(0,0,0,0.7)',
    transition: 'transform 0.3s ease',
    '&:hover': { transform: 'translateY(-4px)' }
  },
  poster: {
    width: 300,
    maxWidth: '32vw',
    aspectRatio: '2 / 3',
    objectFit: 'cover',
    display: 'block',
    backgroundColor: '#0c1022'
  },
  details: { flex: 1, maxWidth: 680, minWidth: 0 },
  title: {
    fontSize: '2.9rem',
    fontWeight: 800,
    lineHeight: 1.1,
    letterSpacing: '-0.5px',
    textShadow: '0 2px 24px rgba(0,0,0,0.6)',
    marginBottom: theme.spacing(2)
  },
  titleLink: { color: 'inherit', textDecoration: 'none' },
  description: {
    fontSize: '1.05rem',
    lineHeight: 1.65,
    color: 'rgba(255,255,255,0.85)',
    maxWidth: 620,
    marginBottom: theme.spacing(2.5)
  },
  genres: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing(1),
    marginBottom: theme.spacing(2)
  },
  chip: {
    padding: theme.spacing(0.5, 1.8),
    fontSize: '0.8rem',
    fontWeight: 600,
    letterSpacing: '0.3px',
    borderRadius: 8,
    color: 'rgba(255,255,255,0.9)',
    border: '1px solid rgba(255,255,255,0.22)',
    backgroundColor: 'rgba(255,255,255,0.06)',
    backdropFilter: 'blur(6px)',
    textTransform: 'capitalize'
  },
  meta: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    fontSize: '0.95rem',
    color: 'rgba(255,255,255,0.7)',
    fontWeight: 600
  },
  dot: { opacity: 0.5 },
  lang: { textTransform: 'capitalize' },
  footer: {
    position: 'absolute',
    left: theme.spacing(6),
    right: theme.spacing(6),
    bottom: theme.spacing(5),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing(2),
    padding: theme.spacing(2, 3),
    borderRadius: 14,
    background: 'rgba(0,0,0,0.42)',
    border: '1px solid rgba(255,255,255,0.08)',
    backdropFilter: 'blur(8px)'
  },
  footerInfo: { minWidth: 0 },
  footerPrimary: { fontSize: '1rem', fontWeight: 700, lineHeight: 1.3 },
  footerSecondary: {
    fontSize: '0.85rem',
    color: 'rgba(255,255,255,0.65)',
    marginTop: 2
  },
  buyBtn: {
    flexShrink: 0,
    minWidth: 150,
    height: 48,
    padding: theme.spacing(0, 3.5),
    borderRadius: 999,
    fontWeight: 700,
    letterSpacing: '0.4px',
    backgroundColor: '#00a0ee',
    color: '#fff',
    boxShadow: '0 2px 8px rgba(0, 160, 238, 0.25)',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease',
    '&:hover': {
      backgroundColor: '#008cd1',
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(0, 160, 238, 0.35)'
    }
  },

  // Slider pagination dots (react-slick) restyled as the reference dashes.
  '@global': {
    '.slick-dots': {
      bottom: 24,
      textAlign: 'right',
      paddingRight: 48,
      zIndex: 3
    },
    '.slick-dots li': { width: 'auto', height: 'auto', margin: '0 5px' },
    '.slick-dots li button': { width: 'auto', height: 'auto', padding: 0 },
    '.slick-dots li button:before': {
      content: '""',
      display: 'block',
      width: 26,
      height: 5,
      borderRadius: 3,
      opacity: 1,
      backgroundColor: 'rgba(255,255,255,0.35)',
      transition: 'all 0.25s ease'
    },
    '.slick-dots li.slick-active button:before': {
      width: 34,
      backgroundColor: '#00a0ee'
    }
  },

  [theme.breakpoints.down('sm')]: {
    inner: { padding: theme.spacing(0, 3) },
    content: { gap: theme.spacing(3), marginBottom: theme.spacing(10) },
    poster: { width: 150 },
    title: { fontSize: '1.7rem' },
    description: { fontSize: '0.9rem' },
    footer: {
      left: theme.spacing(2),
      right: theme.spacing(2),
      bottom: theme.spacing(3),
      flexDirection: 'column',
      alignItems: 'stretch',
      gap: theme.spacing(1.5)
    },
    buyBtn: { width: '100%' }
  },
  [theme.breakpoints.down('xs')]: {
    posterLink: { display: 'none' }
  }
}));
