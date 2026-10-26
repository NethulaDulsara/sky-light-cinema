export default theme => ({
  root: {
    marginBottom: theme.spacing(3)
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: theme.spacing(1)
  },
  deleteButton: {
    color: '#ef4444',
    background: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.25)',
    borderRadius: '10px',
    padding: '8px',
    transition: 'all 0.2s ease',
    '&:hover': {
      background: 'rgba(239, 68, 68, 0.2)',
      borderColor: '#ef4444',
      transform: 'scale(1.05)'
    }
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
