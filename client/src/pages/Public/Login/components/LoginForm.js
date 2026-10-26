import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Button, TextField, Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';
import FacebookLogin from 'react-facebook-login';
import GoogleLogin from 'react-google-login';
import { login, facebookLogin, googleLogin } from '../../../../store/actions';
import { history } from '../../../../utils';

const useStyles = makeStyles(theme => ({
  form: {
    paddingLeft: '100px',
    paddingRight: '100px',
    paddingBottom: '125px',
    flexBasis: '700px',
    [theme.breakpoints.down('sm')]: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2)
    }
  },
  title: {
    color: theme.palette.common.contrastText,
    marginTop: theme.spacing(3)
  },
  socialLogin: {
    margin: theme.spacing(4, 0)
  },
  fields: {
    marginTop: theme.spacing(2)
  },
  textField: {
    width: '100%',
    '& + & ': {
      marginTop: theme.spacing(2)
    }
  },
  progress: {
    display: 'block',
    marginTop: theme.spacing(2),
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  loginButton: {
    marginTop: theme.spacing(2),
    width: '100%'
  },
  register: {
    marginTop: theme.spacing(2),
    color: theme.palette.text.secondary
  },
  registerUrl: {
    color: theme.palette.primary.main,
    fontWeight: 'bold',
    '&:hover': {
      color: theme.palette.primary.main
    }
  },
  fieldError: {
    color: theme.palette.danger.main,
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(1)
  },
  submitError: {
    color: theme.palette.danger.main,
    alignText: 'center',
    marginBottom: theme.spacing(1),
    marginTop: theme.spacing(2)
  }
}));

function LoginForm(props) {
  const { facebookLogin, googleLogin, isAuthenticated, user, redirect, loading } = props;
  const classes = useStyles();
  const [values, setValues] = useState({ username: '', password: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated && redirect) {
      if (user && user.role === 'superadmin')
        return history.push('/admin/dashboard');
      return history.push('/');
    }
  }, [isAuthenticated, user, redirect]);

  const handleFieldChange = e =>
    setValues({
      ...values,
      [e.target.name]: e.target.value
    });

  const handleSubmit = e => {
    if (e) e.preventDefault();
    if (!values.username || !values.password) return;
    setSubmitting(true);
    props.login(values.username, values.password);
  };

  const hasGoogle = process.env.REACT_APP_GOOGLE_CLIENT_ID && process.env.REACT_APP_GOOGLE_CLIENT_ID !== '...';
  const hasFacebook = process.env.REACT_APP_FACEBOOK_APP_ID && process.env.REACT_APP_FACEBOOK_APP_ID !== '...';

  return (
    <form className={classes.form} onSubmit={handleSubmit}>
      <Typography className={classes.title} variant="h2">
        Sign in
      </Typography>

      {(hasGoogle || hasFacebook) && (
        <div className={classes.socialLogin}>
          {hasGoogle && (
            <GoogleLogin
              clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
              onSuccess={googleLogin}
              onFailure={googleLogin}
              cookiePolicy={'single_host_origin'}
              render={renderProps => (
                <Button
                  onClick={renderProps.onClick}
                  disabled={renderProps.disabled}
                  fullWidth
                  variant="contained"
                  style={{
                    borderRadius: 8,
                    background: '#fff',
                    color: '#de5246',
                    marginBottom: 10,
                    height: 50,
                    fontSize: '14px',
                    fontWeight: 700
                  }}>
                  Login With Google
                </Button>
              )}
            />
          )}
          {hasFacebook && (
            <FacebookLogin
              buttonStyle={{ width: '100%', height: 50, borderRadius: 8 }}
              appId={process.env.REACT_APP_FACEBOOK_APP_ID}
              fields="name,email,picture"
              callback={facebookLogin}
            />
          )}
        </div>
      )}

      <div className={classes.fields}>
        <TextField
          className={classes.textField}
          label="Username"
          name="username"
          onChange={event => handleFieldChange(event)}
          type="text"
          value={values.username}
          variant="outlined"
          autoComplete="username"
          required
        />
        <TextField
          className={classes.textField}
          label="Password"
          name="password"
          onChange={event => handleFieldChange(event)}
          type="password"
          value={values.password}
          variant="outlined"
          autoComplete="current-password"
          required
        />
      </div>

      <Button
        className={classes.loginButton}
        color="primary"
        type="submit"
        size="large"
        variant="contained"
        disabled={submitting && loading}>
        {submitting && loading ? 'Signing in...' : 'Login now'}
      </Button>
      <Typography className={classes.register} variant="body1">
        Don't have an account?{' '}
        <Link className={classes.registerUrl} to="/register">
          register
        </Link>
      </Typography>
    </form>
  );
}

const mapStateToProps = state => ({
  isAuthenticated: state.authState.isAuthenticated,
  user: state.authState.user,
  loading: state.authState.loading
});
export default connect(mapStateToProps, { login, facebookLogin, googleLogin })(
  LoginForm
);
