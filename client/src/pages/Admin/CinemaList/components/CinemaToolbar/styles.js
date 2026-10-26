export default theme => ({
  root: {
    marginBottom: theme.spacing(3)
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing(2),
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
      alignItems: 'stretch'
    }
  },
  searchInput: {
    flex: '1 1 320px',
    maxWidth: '450px'
  },
  addButton: {
    background: 'linear-gradient(135deg, #00C6FF 0%, #0072FF 100%)',
    color: '#ffffff',
    borderRadius: '12px',
    padding: '8px 24px',
    fontWeight: 700,
    fontSize: '13px',
    letterSpacing: '0.5px',
    boxShadow: '0 4px 15px rgba(0, 198, 255, 0.35)',
    '&:hover': {
      background: 'linear-gradient(135deg, #00d2ff 0%, #1e88e5 100%)',
      boxShadow: '0 6px 20px rgba(0, 198, 255, 0.55)',
      transform: 'translateY(-1px)'
    }
  }
});
