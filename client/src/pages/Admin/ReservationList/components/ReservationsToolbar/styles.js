export default theme => ({
  root: {
    marginBottom: theme.spacing(3)
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    marginTop: theme.spacing(1),
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
  }
});
