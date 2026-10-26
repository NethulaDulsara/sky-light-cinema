import React, { Component, Fragment } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Hidden, Drawer } from '@material-ui/core';
import PropTypes from 'prop-types';
import { Footer, Sidebar, Topbar } from './components';
import styles from './styles';

class AdminLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isMobileOpen: false
    };
  }

  static propTypes = {
    children: PropTypes.node,
    classes: PropTypes.object.isRequired,
    title: PropTypes.string
  };

  handleToggleMobile = () => {
    this.setState(prevState => ({ isMobileOpen: !prevState.isMobileOpen }));
  };

  handleCloseMobile = () => {
    this.setState({ isMobileOpen: false });
  };

  render() {
    const { isMobileOpen } = this.state;
    const { title, children, classes } = this.props;

    return (
      <Fragment>
        <Topbar
          title={title}
          ToolbarClasses={classes.topbar}
          isSidebarOpen={isMobileOpen}
          onToggleSidebar={this.handleToggleMobile}
        />

        {/* Desktop Drawer - Permanently visible, fixed, and stable */}
        <Hidden smDown>
          <Drawer
            anchor="left"
            classes={{ paper: classes.drawerPaper }}
            open={true}
            variant="permanent">
            <Sidebar className={classes.sidebar} />
          </Drawer>
        </Hidden>

        {/* Mobile Drawer - Toggleable for smaller screens */}
        <Hidden mdUp>
          <Drawer
            anchor="left"
            classes={{ paper: classes.drawerPaperMobile }}
            open={isMobileOpen}
            onClose={this.handleCloseMobile}
            variant="temporary">
            <Sidebar className={classes.sidebar} />
          </Drawer>
        </Hidden>

        <main className={classes.content}>
          {children}
          <Footer />
        </main>
      </Fragment>
    );
  }
}

export default withStyles(styles)(AdminLayout);
