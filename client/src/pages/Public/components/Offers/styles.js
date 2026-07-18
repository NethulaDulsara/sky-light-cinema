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
    alignItems: 'center',
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '16px',
    overflow: 'hidden',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    transition: 'transform 0.3s',
    '&:hover': {
      transform: 'translateY(-10px)'
    }
  },
  imagePlaceholder: {
    width: '100%',
    height: '350px',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundColor: '#1a1a3a',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  },
  offerText: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    fontWeight: 800,
    fontSize: '1.5rem',
    textShadow: '0 2px 4px rgba(0,0,0,0.8)'
  },
  exploreButton: {
    margin: theme.spacing(3),
    padding: theme.spacing(1, 4),
    backgroundColor: theme.palette.common.white,
    color: '#010025',
    fontWeight: 600,
    '&:hover': {
      backgroundColor: 'rgba(255,255,255,0.8)'
    }
  }
}));
