export default theme => ({
  root: {
    padding: theme.spacing(1, 0)
  },
  title: {
    display: 'none' // ResponsiveDialog renders the title
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2.5)
  },
  row: {
    display: 'flex',
    gap: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column'
    }
  },
  field: {
    width: '100%'
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
    marginTop: theme.spacing(3),
    paddingTop: theme.spacing(2),
    borderTop: '1px solid rgba(255, 255, 255, 0.06)'
  },
  submitButton: {
    padding: '10px 28px',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: 700
  },
  deleteButton: {
    padding: '10px 24px',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: 700
  }
});
