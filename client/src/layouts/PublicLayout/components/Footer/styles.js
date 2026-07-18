import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(theme => ({
  root: {
    padding: theme.spacing(8, 4),
    background: '#010025',
    color: theme.palette.common.white,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  appText: {
    fontWeight: 600,
    marginBottom: theme.spacing(3)
  },
  appBadges: {
    display: 'flex',
    justifyContent: 'center',
    gap: theme.spacing(3),
    marginBottom: theme.spacing(6),
    '& img': {
      height: 40,
      cursor: 'pointer',
      transition: 'transform 0.2s',
      '&:hover': {
        transform: 'scale(1.05)'
      }
    }
  },
  divider: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginBottom: theme.spacing(4)
  },
  navContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: theme.spacing(4),
    marginBottom: theme.spacing(4),
    maxWidth: 1000
  },
  navLink: {
    color: theme.palette.common.white,
    fontWeight: 600,
    fontSize: '0.85rem',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    cursor: 'pointer',
    transition: 'color 0.2s',
    '&:hover': {
      color: theme.palette.primary.main
    }
  },
  bottomBar: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: theme.spacing(3),
    fontSize: '0.75rem',
    color: 'rgba(255,255,255,0.6)'
  },
  bottomLink: {
    color: 'inherit',
    textDecoration: 'none',
    cursor: 'pointer',
    '&:hover': {
      color: theme.palette.common.white
    }
  }
}));
