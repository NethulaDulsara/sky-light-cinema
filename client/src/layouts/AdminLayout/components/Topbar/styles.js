export default theme => ({
  root: {
    borderBottom: `1px solid ${theme.palette.borderShadow}`,
    boxShadow: `0 0 35px 0  ${theme.palette.borderShadow}`,
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
    alignItems: 'center',
    height: theme.topBar.height,
    zIndex: theme.zIndex.appBar
  },
  toolbar: {
    minHeight: 'auto',
    width: '100%',
    paddingLeft: 0
  },
  brandWrapper: {
    background: theme.palette.default.dark,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '271px',
    height: theme.topBar.height,
    flexShrink: 0
  },
  logo: {
    fontFamily: 'Montserrat,sans-serif',
    fontSize: '20px',
    fontWeight: 700,
    letterSpacing: 2,
    color: theme.palette.common.white,
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2)
  },
  title: {
    marginLeft: theme.spacing(3),
    textTransform: 'uppercase',
    textDecoration: 'none',
    fontSize: '14px',
    color: theme.palette.text.primary,
    fontWeight: 700
  },
  menuButton: {
    color: theme.palette.common.white,
    marginLeft: '-4px'
  },
  notificationsButton: {
    marginLeft: 'auto'
  },
  signOutButton: {
    marginLeft: theme.spacing(1)
  }
});
