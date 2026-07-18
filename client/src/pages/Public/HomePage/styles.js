export default theme => ({
  grid: {
    height: '100%'
  },
  carousel: { marginBottom: theme.spacing(6) },
  cinemaSection: {
    position: 'relative',
    padding: theme.spacing(8, 0),
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
    backgroundImage: 'url("https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(to bottom, rgba(1, 0, 37, 1) 0%, rgba(1, 0, 37, 0.4) 50%, rgba(1, 0, 37, 1) 100%)',
      zIndex: 1
    },
    '& > div': {
      position: 'relative',
      zIndex: 2
    }
  }
});
