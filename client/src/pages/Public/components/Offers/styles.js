import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(theme => ({
  container: {
    padding: theme.spacing(8, 2),
    backgroundColor: '#010025',
    color: theme.palette.common.white,
    textAlign: 'center'
  },
  header: {
    fontWeight: 700,
    marginBottom: theme.spacing(6),
    textTransform: 'uppercase',
    letterSpacing: '2px'
  },
  sliderContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: theme.spacing(0, 4)
  },
  offerCard: {
    margin: theme.spacing(0, 2),
    display: 'flex',
    flexDirection: 'column',
    background: 'rgba(255, 255, 255, 0.04)',
    borderRadius: '16px',
    overflow: 'hidden',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
    '&:hover': {
      transform: 'translateY(-10px)',
      borderColor: 'rgba(0,198,255,0.4)',
      boxShadow: '0 18px 40px rgba(0,0,0,0.45)'
    }
  },
  imagePlaceholder: {
    width: '100%',
    height: '300px',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundColor: '#1a1a3a',
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    position: 'relative',
    '&:after': {
      content: '""',
      position: 'absolute',
      inset: 0,
      background:
        'linear-gradient(to top, rgba(1,0,37,0.95) 0%, rgba(1,0,37,0.35) 45%, rgba(1,0,37,0) 75%)'
    }
  },
  badge: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 2,
    padding: theme.spacing(0.5, 1.8),
    borderRadius: 999,
    fontWeight: 800,
    fontSize: '0.8rem',
    letterSpacing: '0.5px',
    color: '#fff',
    background: 'linear-gradient(135deg, #00C6FF 0%, #0072FF 100%)',
    boxShadow: '0 4px 14px rgba(0,114,255,0.45)'
  },
  offerText: {
    position: 'absolute',
    zIndex: 2,
    bottom: 18,
    left: 20,
    right: 20,
    textAlign: 'left',
    fontWeight: 800,
    fontSize: '1.35rem',
    lineHeight: 1.2,
    textShadow: '0 2px 6px rgba(0,0,0,0.8)'
  },
  offerBody: {
    flex: 1,
    padding: theme.spacing(2.5, 2.5, 1),
    textAlign: 'left'
  },
  offerDescription: {
    color: 'rgba(255,255,255,0.72)',
    fontSize: '0.92rem',
    lineHeight: 1.6
  },
  exploreButton: {
    margin: theme.spacing(0, 2.5, 3),
    padding: theme.spacing(1, 4),
    alignSelf: 'flex-start',
    borderRadius: 999,
    background: 'linear-gradient(135deg, #00C6FF 0%, #0072FF 100%)',
    color: '#fff',
    fontWeight: 700,
    letterSpacing: '0.3px',
    boxShadow: '0 8px 22px rgba(0,114,255,0.35)',
    '&:hover': {
      background: 'linear-gradient(135deg, #1ad2ff 0%, #1a82ff 100%)'
    }
  }
}));
