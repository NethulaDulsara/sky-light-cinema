export default theme => ({
  topbar: {
    position: 'fixed',
    width: '100%',
    top: 0,
    left: 0,
    right: 'auto',
    zIndex: theme.zIndex.appBar + 1
  },
  drawerPaper: {
    borderRight: '1px solid rgba(255, 255, 255, 0.06)',
    backgroundColor: '#0c101c',
    zIndex: theme.zIndex.appBar - 1,
    width: '270px',
    top: theme.topBar.height,
    height: `calc(100vh - ${theme.topBar.height})`,
    overflowY: 'auto'
  },
  drawerPaperMobile: {
    borderRight: '1px solid rgba(255, 255, 255, 0.1)',
    backgroundColor: '#0c101c',
    zIndex: 1400,
    width: '270px',
    height: '100%',
    overflowY: 'auto'
  },
  sidebar: {
    width: '270px'
  },
  content: {
    minHeight: '100vh',
    padding: theme.spacing(3),
    paddingTop: `calc(${theme.topBar.height} + ${theme.spacing(3)}px)`,
    marginLeft: '270px',
    backgroundColor: theme.palette.background.default,
    transition: 'margin-left 0.2s ease',
    [theme.breakpoints.down('sm')]: {
      marginLeft: 0,
      padding: theme.spacing(2),
      paddingTop: `calc(${theme.topBar.height} + ${theme.spacing(2)}px)`
    }
  }
});
