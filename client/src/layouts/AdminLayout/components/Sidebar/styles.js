export default theme => ({
  root: {
    backgroundColor: '#0c101c',
    background: 'linear-gradient(180deg, #0d1222 0%, #080b14 100%)',
    borderRight: '1px solid rgba(255, 255, 255, 0.06)',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    padding: theme.spacing(2, 1.5)
  },
  listSubheader: {
    color: '#64748b',
    fontSize: '11px',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '1.2px',
    lineHeight: '32px',
    padding: theme.spacing(1, 1.5, 0.5)
  },
  listItem: {
    cursor: 'pointer',
    borderRadius: '12px',
    padding: theme.spacing(1.2, 1.8),
    margin: '3px 0',
    transition: 'all 0.22s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.04)',
      transform: 'translateX(4px)',
      '& $listItemIcon': {
        color: '#00C6FF'
      },
      '& $listItemText': {
        color: '#ffffff'
      }
    }
  },
  activeListItem: {
    background: 'linear-gradient(90deg, rgba(0, 198, 255, 0.16) 0%, rgba(121, 40, 202, 0.08) 100%) !important',
    borderLeft: '3px solid #00C6FF !important',
    boxShadow: '0 4px 20px rgba(0, 198, 255, 0.15)',
    '& $listItemIcon': {
      color: '#00C6FF !important'
    },
    '& $listItemText': {
      color: '#ffffff !important',
      fontWeight: 700
    }
  },
  listItemIcon: {
    minWidth: '38px',
    color: '#64748b',
    transition: 'color 0.2s ease',
    '& svg': {
      fontSize: '20px'
    }
  },
  listItemText: {
    fontSize: '13px',
    fontWeight: 500,
    color: '#94a3b8',
    letterSpacing: '0.3px',
    transition: 'color 0.2s ease'
  },
  listDivider: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    margin: theme.spacing(2, 1)
  }
});
