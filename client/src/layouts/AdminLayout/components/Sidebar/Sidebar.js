import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import {
  withStyles,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader
} from '@material-ui/core';
import DashboardIcon from '@material-ui/icons/DashboardOutlined';
import TheatersIcon from '@material-ui/icons/TheatersOutlined';
import StoreMallDirectoryIcon from '@material-ui/icons/StoreMallDirectoryOutlined';
import ScheduleIcon from '@material-ui/icons/ScheduleOutlined';
import ConfirmationNumberIcon from '@material-ui/icons/ConfirmationNumberOutlined';
import PeopleAltIcon from '@material-ui/icons/PeopleAltOutlined';
import AccountCircleIcon from '@material-ui/icons/AccountCircleOutlined';
import HeadsetMicIcon from '@material-ui/icons/HeadsetMicOutlined';

import styles from './styles';

class Sidebar extends Component {
  render() {
    const { classes, user } = this.props;
    return (
      <section className={classes.root}>
        <List
          component="div"
          disablePadding
          subheader={
            <ListSubheader className={classes.listSubheader}>
              Main Navigation
            </ListSubheader>
          }>
          <ListItem
            activeClassName={classes.activeListItem}
            className={classes.listItem}
            component={NavLink}
            to="/admin/dashboard">
            <ListItemIcon className={classes.listItemIcon}>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText
              classes={{ primary: classes.listItemText }}
              primary="Dashboard"
            />
          </ListItem>
          <ListItem
            activeClassName={classes.activeListItem}
            className={classes.listItem}
            component={NavLink}
            to="/admin/movies">
            <ListItemIcon className={classes.listItemIcon}>
              <TheatersIcon />
            </ListItemIcon>
            <ListItemText
              classes={{ primary: classes.listItemText }}
              primary="Movies"
            />
          </ListItem>
          <ListItem
            activeClassName={classes.activeListItem}
            className={classes.listItem}
            component={NavLink}
            to="/admin/cinemas">
            <ListItemIcon className={classes.listItemIcon}>
              <StoreMallDirectoryIcon />
            </ListItemIcon>
            <ListItemText
              classes={{ primary: classes.listItemText }}
              primary="Cinemas"
            />
          </ListItem>
          <ListItem
            activeClassName={classes.activeListItem}
            className={classes.listItem}
            component={NavLink}
            to="/admin/showtimes">
            <ListItemIcon className={classes.listItemIcon}>
              <ScheduleIcon />
            </ListItemIcon>
            <ListItemText
              classes={{ primary: classes.listItemText }}
              primary="Showtimes"
            />
          </ListItem>
          <ListItem
            activeClassName={classes.activeListItem}
            className={classes.listItem}
            component={NavLink}
            to="/admin/reservations">
            <ListItemIcon className={classes.listItemIcon}>
              <ConfirmationNumberIcon />
            </ListItemIcon>
            <ListItemText
              classes={{ primary: classes.listItemText }}
              primary="Reservations"
            />
          </ListItem>
        </List>

        <Divider className={classes.listDivider} />

        <List
          component="div"
          disablePadding
          subheader={
            <ListSubheader className={classes.listSubheader}>
              Administration
            </ListSubheader>
          }>
          {user && user.role === 'superadmin' && (
            <ListItem
              activeClassName={classes.activeListItem}
              className={classes.listItem}
              component={NavLink}
              to="/admin/users">
              <ListItemIcon className={classes.listItemIcon}>
                <PeopleAltIcon />
              </ListItemIcon>
              <ListItemText
                classes={{ primary: classes.listItemText }}
                primary="Users"
              />
            </ListItem>
          )}
          <ListItem
            activeClassName={classes.activeListItem}
            className={classes.listItem}
            component={NavLink}
            to="/admin/account">
            <ListItemIcon className={classes.listItemIcon}>
              <AccountCircleIcon />
            </ListItemIcon>
            <ListItemText
              classes={{ primary: classes.listItemText }}
              primary="Account"
            />
          </ListItem>
        </List>

        <Divider className={classes.listDivider} />

        <List
          component="div"
          disablePadding
          subheader={
            <ListSubheader className={classes.listSubheader}>
              Support
            </ListSubheader>
          }>
          <ListItem
            className={classes.listItem}
            component="a"
            href="mailto:support@skylightcinema.com">
            <ListItemIcon className={classes.listItemIcon}>
              <HeadsetMicIcon />
            </ListItemIcon>
            <ListItemText
              classes={{ primary: classes.listItemText }}
              primary="Customer support"
            />
          </ListItem>
        </List>
      </section>
    );
  }
}

const mapStateToProps = state => ({
  user: state.authState.user
});

export default connect(mapStateToProps)(withStyles(styles)(Sidebar));
