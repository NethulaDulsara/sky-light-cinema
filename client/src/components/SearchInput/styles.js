export default theme => ({
  root: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '30px',
    display: 'flex',
    flexBasis: '420px',
    padding: theme.spacing(0.6, 2),
    transition: 'all 0.25s ease',
    '&:hover': {
      borderColor: 'rgba(0, 198, 255, 0.4)',
      backgroundColor: 'rgba(255, 255, 255, 0.06)'
    },
    '&:focus-within': {
      borderColor: '#00C6FF',
      backgroundColor: 'rgba(0, 198, 255, 0.06)',
      boxShadow: '0 0 20px rgba(0, 198, 255, 0.25)',
      '& $icon': {
        color: '#00C6FF'
      }
    }
  },
  icon: {
    marginRight: theme.spacing(1.2),
    color: '#94a3b8',
    fontSize: '20px',
    transition: 'color 0.2s ease'
  },
  input: {
    flexGrow: 1,
    fontSize: '14px',
    fontWeight: 500,
    color: '#f8fafc',
    '& input::placeholder': {
      color: '#64748b',
      opacity: 1
    }
  }
});
