import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { logout } from '../../../../store/actions';
import classnames from 'classnames';
import {
  withStyles,
  Typography,
  List,
  ListItem,
  IconButton,
  Tooltip
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';

// Component styles
import styles from './styles';
import logo from '../../../../assets/logo.jpg';
import UserPopover from './components/UserPopover/UserPopover';

class Navbar extends Component {
  state = { showMenu: false, scrollPos: window.pageYOffset };

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll = () => {
    this.setState({
      scrollPos: window.pageYOffset
    });
  };

  render() {
    const { showMenu, scrollPos } = this.state;
    const { classes, isAuth, user, logout } = this.props;
    return (
      <Fragment>
        <nav
          className={classnames({
            [classes.navbar]: true,
            [classes.navbarColor]: scrollPos > 30
          })}>
          <Link
            className={classes.logoLink}
            to="/"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <img
              src={logo}
              alt="Sky Lights Cinema"
              style={{
                height: 46,
                width: 46,
                borderRadius: 10,
                background: '#fff',
                objectFit: 'cover',
                marginRight: 12,
                flexShrink: 0
              }}
            />
            <Typography className={classes.logo} variant="h2">
              Sky Lights <span className={classes.logoThin}>Cinema</span>
            </Typography>
          </Link>
          <div className={classes.navLinks}>
            <Link
              className={classes.navLink}
              to="/"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              Home
            </Link>
            <Link className={classes.navLink} to="/movie/category/nowShowing">
              Now Showing
            </Link>
            <Link className={classes.navLink} to="/movie/category/comingSoon">
              Coming Soon
            </Link>
            <Link className={classes.navLink} to="/cinemas">
              Cinemas
            </Link>
          </div>

          <div className={classes.navAccount}>
            <Tooltip title="Search movies">
              <IconButton
                className={classes.iconBtn}
                component={Link}
                to="/search"
                aria-label="Search movies">
                <SearchIcon />
              </IconButton>
            </Tooltip>
            <UserPopover logout={logout}>
              <List component="nav">
                {user && (
                  <ListItem>
                    <Link
                      className={classes.navLink}
                      to={
                        user.role !== 'guest'
                          ? '/admin/dashboard'
                          : '/mydashboard'
                      }>
                      Dashboard
                    </Link>
                  </ListItem>
                )}

                {isAuth ? (
                  <ListItem>
                    <Link className={classes.navLink} onClick={logout} to="/">
                      Logout
                    </Link>
                  </ListItem>
                ) : (
                  <ListItem>
                    <Link className={classes.navLink} to="/login">
                      Login
                    </Link>
                  </ListItem>
                )}
              </List>
            </UserPopover>
          </div>

          <div className={classes.navMobile}>
            <div
              className={classes.navIcon}
              onClick={() => this.setState({ showMenu: !this.state.showMenu })}>
              <div
                className={classnames(
                  classes.navIconLine,
                  classes.navIconLine__left
                )}
              />
              <div className={classes.navIconLine} />
              <div
                className={classnames(
                  classes.navIconLine,
                  classes.navIconLine__right
                )}
              />
            </div>
          </div>
        </nav>
        <div
          className={classnames({
            [classes.navActive]: showMenu,
            [classes.nav]: true
          })}>
          <div className={classes.navContent}>
            <div className={classes.currentPageShadow}>Movies</div>
            <ul
              className={classes.innerNav}
              onClick={() => this.setState({ showMenu: !this.state.showMenu })}>
              <li className={classes.innerNavListItem}>
                <Link
                  className={classes.innerNavLink}
                  to="/"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                  Home
                </Link>
              </li>
              <li className={classes.innerNavListItem}>
                <Link
                  className={classes.innerNavLink}
                  to="/movie/category/nowShowing">
                  Now Showing
                </Link>
              </li>
              <li className={classes.innerNavListItem}>
                <Link
                  className={classes.innerNavLink}
                  to="/movie/category/comingSoon">
                  Coming Soon
                </Link>
              </li>
              <li className={classes.innerNavListItem}>
                <Link className={classes.innerNavLink} to="/cinemas">
                  Cinemas
                </Link>
              </li>
              <li className={classes.innerNavListItem}>
                <Link className={classes.innerNavLink} to="/search">
                  Search
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  isAuth: state.authState.isAuthenticated,
  user: state.authState.user
});

const mapDispatchToProps = {
  logout
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Navbar));
