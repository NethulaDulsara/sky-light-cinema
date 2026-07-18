import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(theme => ({
  container: {
    position: 'relative',
    minHeight: '600px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: theme.spacing(10, 5),
    color: theme.palette.common.white,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    transition: 'background-image 0.5s ease-in-out',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(to right, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.2) 100%)',
      zIndex: 1
    }
  },
  content: {
    position: 'relative',
    zIndex: 2,
    maxWidth: '600px',
    marginBottom: theme.spacing(6)
  },
  subtitle: {
    textTransform: 'uppercase',
    letterSpacing: '2px',
    marginBottom: theme.spacing(2),
    color: 'rgba(255,255,255,0.7)',
    fontWeight: 600
  },
  title: {
    fontWeight: 800,
    marginBottom: theme.spacing(3),
    fontSize: '4rem',
    textTransform: 'uppercase'
  },
  description: {
    marginBottom: theme.spacing(4),
    lineHeight: 1.8,
    color: 'rgba(255,255,255,0.8)'
  },
  button: {
    padding: theme.spacing(1, 4),
    borderColor: theme.palette.common.white,
    color: theme.palette.common.white,
    '&:hover': {
      backgroundColor: theme.palette.common.white,
      color: theme.palette.common.black
    }
  },
  selectorContainer: {
    position: 'relative',
    zIndex: 2,
    marginTop: 'auto',
    padding: theme.spacing(0, 5)
  },
  selectorCard: {
    margin: theme.spacing(0, 2),
    height: '100px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(255,255,255,0.1)',
    backdropFilter: 'blur(5px)',
    border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    '&:hover': {
      background: 'rgba(255,255,255,0.2)',
      transform: 'scale(1.05)'
    }
  },
  activeCard: {
    background: 'rgba(255,255,255,0.2)',
    border: '2px solid white',
    boxShadow: '0 0 15px rgba(255,255,255,0.5)'
  },
  cardTitle: {
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '1px'
  }
}));
