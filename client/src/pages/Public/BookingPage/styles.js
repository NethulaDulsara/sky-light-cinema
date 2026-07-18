export default theme => ({
  root: { paddingTop: theme.spacing(10) },
  container: { height: '100%' },
  [theme.breakpoints.down('md')]: {
    root: { height: '100%', paddingTop: theme.spacing(10) }
  }
});
