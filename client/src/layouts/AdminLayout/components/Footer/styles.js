import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(theme => ({
  root: {
    padding: theme.spacing(3),
    background: 'transparent',
    color: theme.palette.contrastText
  },
  copyright: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(0.5)
  }
}));
