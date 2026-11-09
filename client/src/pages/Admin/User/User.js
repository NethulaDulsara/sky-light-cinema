import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles, CircularProgress, Tabs, Tab } from '@material-ui/core';
import styles from './styles';
import { UsersToolbar, UsersTable, AddUser } from './components';
import {
  getUsers,
  deleteUser,
  selectUser,
  selectAllUsers,
  toggleUserDialog,
  addUser,
  updateUser
} from '../../../store/actions';
import { ResponsiveDialog } from '../../../components';

// Staff = admins / super admins; Customers = guests who book tickets.
const isStaff = u => u.role && u.role !== 'guest';

class User extends Component {
  state = { tab: 0 };

  static propTypes = {
    className: PropTypes.string,
    classes: PropTypes.object.isRequired
  };

  componentDidMount() {
    this.props.getUsers();
  }

  handleSelect = selectedUsers => {
    this.setState({ selectedUsers });
  };

  renderUsers() {
    const {
      classes,
      users,
      selectedUsers,
      selectUser,
      selectAllUsers
    } = this.props;
    const { tab } = this.state;

    if (!users.length) {
      return (
        <div className={classes.progressWrapper}>
          <CircularProgress />
        </div>
      );
    }

    const staff = users.filter(isStaff);
    const customers = users.filter(u => !isStaff(u));
    const shown = tab === 0 ? staff : customers;

    return (
      <>
        <Tabs
          value={tab}
          onChange={(e, value) => this.setState({ tab: value })}
          indicatorColor="primary"
          textColor="primary"
          style={{ marginBottom: 16 }}>
          <Tab label={`Staff & Admins (${staff.length})`} />
          <Tab label={`Customers (${customers.length})`} />
        </Tabs>
        <UsersTable
          onSelect={selectUser}
          onSelectAll={selectAllUsers}
          users={shown}
          selectedUsers={selectedUsers}
        />
      </>
    );
  }
  render() {
    const {
      classes,
      users,
      selectedUsers,
      openDialog,
      toggleUserDialog,
      addUser,
      updateUser,
      deleteUser
    } = this.props;

    return (
      <div className={classes.root}>
        <UsersToolbar
          users={users}
          selectedUsers={selectedUsers}
          toggleDialog={toggleUserDialog}
          deleteUser={() => deleteUser(selectedUsers[0])}
        />
        <div className={classes.content}>{this.renderUsers()}</div>
        <ResponsiveDialog
          id="Add-user"
          title={selectedUsers.length === 1 ? 'Edit User Profile' : 'Add New User'}
          open={openDialog}
          handleClose={() => toggleUserDialog()}>
          <AddUser
            selectedUser={users.find(user => user._id === selectedUsers[0])}
            addUser={addUser}
            updateUser={updateUser}
          />
        </ResponsiveDialog>
      </div>
    );
  }
}

const mapStateToProps = ({ userState }) => ({
  users: userState.users,
  selectedUsers: userState.selectedUsers,
  openDialog: userState.openDialog
});
const mapDispatchToProps = {
  getUsers,
  selectUser,
  selectAllUsers,
  toggleUserDialog,
  addUser,
  updateUser,
  deleteUser
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(User));
