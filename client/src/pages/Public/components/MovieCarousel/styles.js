export default theme => ({
  container: {
    display: 'flex',
    alignItems: 'baseline'
  },
  h2: {
    fontSize: '2rem',
    color: theme.palette.common.white,
    margin: theme.spacing(3),
    textTransform: 'capitalize'
  },
  button: {},
  carousel: {
    width: '85%',
    height: '100%',
    margin: 'auto'
  },
  arrow: {
    cursor: 'pointer',
    position: 'absolute',
    top: 0,
    bottom: 60,
    width: '10%',
    display: 'flex',
    alignItems: 'center',
    background: 'rgba(0,0,0,.5)',
    color: theme.palette.common.white,
    zIndex: 2,
    transition: 'opacity 0.25s ease',
    '&.prevArrow': {
      left: 0,
      justifyContent: 'flex-start',
      background:
        'linear-gradient(90deg, rgba(0,0,0,0.85) 0%, rgba(0,0,37,0) 100%)',
      opacity: ({ currentSlide, infinite }) => (infinite ? 0.7 : (currentSlide ? 0.8 : 0)),
      '&:hover': {
        opacity: 1
      }
    },
    '&.nextArrow': {
      right: 0,
      justifyContent: 'flex-end',
      background:
        'linear-gradient(90deg, rgba(0,0,37,0) 0%, rgba(0,0,0,0.85) 100%)',
      opacity: ({ currentSlide, slideCount, infinite }) =>
        infinite ? 0.7 : (currentSlide === slideCount ? 0 : 0.8),
      '&:hover': {
        opacity: 1
      }
    }
  },

  slider: {
    // Side cards shrink; the center stays at natural size so its button is
    // never clipped by the slick-list overflow.
    '& .slick-slide': {
      padding: theme.spacing(1),
      transition: 'transform 0.4s ease, opacity 0.4s ease',
      transform: 'scale(0.86)',
      transformOrigin: 'center top',
      opacity: 0.55
    },
    '& .slick-center': {
      transform: 'scale(1)',
      opacity: 1,
      zIndex: 2
    },
    '& .slick-list': { padding: theme.spacing(1, 0) }
  },
  trailerPaper: {
    backgroundColor: '#05070c',
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 14
  },
  trailerClose: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 3,
    color: '#fff',
    background: 'rgba(0,0,0,0.5)',
    '&:hover': { background: 'rgba(0,0,0,0.75)' }
  },
  trailerFrameWrap: {
    position: 'relative',
    width: '100%',
    paddingTop: '56.25%' // 16:9
  },
  trailerFrame: {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    border: 0
  }
});
