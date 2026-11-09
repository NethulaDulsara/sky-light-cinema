import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Loading from '../components/Loading';

const STAFF_ROLES = ['cashier', 'admin', 'superadmin'];

// Gate for box-office (POS) screens: requires an authenticated staff user
// (cashier/admin/superadmin). While the session is still loading the user we
// render a loader rather than bouncing a valid staff member to the home page.
const StaffRoute = ({
  layout: Layout,
  component: Component,
  isAuthenticated,
  user,
  loading,
  ...rest
}) => (
  <Route
    {...rest}
    render={props => {
      if (!isAuthenticated) {
        return <Redirect to={{ pathname: '/login', state: { from: props.location } }} />;
      }
      if (!user) {
        // Token present but profile not resolved yet.
        return loading ? <Loading /> : <Redirect to="/login" />;
      }
      if (!STAFF_ROLES.includes(user.role)) {
        return <Redirect to="/" />;
      }
      const content = <Component {...props} />;
      return Layout ? <Layout>{content}</Layout> : content;
    }}
  />
);

StaffRoute.propTypes = {
  isAuthenticated: PropTypes.bool,
  user: PropTypes.object,
  loading: PropTypes.bool
};
StaffRoute.defaultProps = {
  isAuthenticated: false
};

const mapStateToProps = state => ({
  isAuthenticated: state.authState.isAuthenticated,
  user: state.authState.user,
  loading: state.authState.loading
});

export default connect(mapStateToProps)(StaffRoute);
