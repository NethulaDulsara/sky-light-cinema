import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core';
import {
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination
} from '@material-ui/core';

import { Portlet, PortletContent } from '../../../../../components';
import styles from './styles';

class UsersTable extends Component {
  state = {
    selectedUsers: [],
    rowsPerPage: 10,
    page: 0
  };

  static propTypes = {
    className: PropTypes.string,
    classes: PropTypes.object.isRequired,
    onSelect: PropTypes.func,
    users: PropTypes.array.isRequired
  };

  static defaultProps = {
    users: [],
    onSelect: () => {}
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  render() {
    const {
      classes,
      className,
      users,
      selectedUsers,
      onSelect,
      onSelectAll
    } = this.props;
    const { rowsPerPage, page } = this.state;

    const rootClassName = classNames(classes.root, className);
    return (
      <Portlet className={rootClassName}>
        <PortletContent noPadding>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="left">
                  <Checkbox
                    checked={selectedUsers.length === users.length}
                    color="primary"
                    indeterminate={
                      selectedUsers.length > 0 &&
                      selectedUsers.length < users.length
                    }
                    onChange={onSelectAll}
                  />
                  Name
                </TableCell>
                <TableCell align="left">Username</TableCell>
                <TableCell align="left">Role</TableCell>
                <TableCell align="left">Email</TableCell>
                <TableCell align="left">Registration date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users
                .filter(user => {
                  return user;
                })
                .slice(0, rowsPerPage)
                .map(user => (
                  <TableRow
                    className={classes.tableRow}
                    hover
                    key={user._id}
                    selected={selectedUsers.indexOf(user._id) !== -1}>
                    <TableCell className={classes.tableCell}>
                      <div className={classes.tableCellInner} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Checkbox
                          checked={selectedUsers.indexOf(user._id) !== -1}
                          color="primary"
                          onChange={() => onSelect(user._id)}
                          value="true"
                        />
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #00C6FF 0%, #0072FF 100%)',
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: '12px'
                        }}>
                          {(user.name || user.username || 'U').charAt(0).toUpperCase()}
                        </div>
                        <span style={{ fontWeight: 600, color: '#f8fafc' }}>
                          {user.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      <span style={{
                        fontFamily: 'monospace',
                        color: '#00C6FF',
                        background: 'rgba(0, 198, 255, 0.08)',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: 600
                      }}>
                        @{user.username}
                      </span>
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      <span style={{
                        display: 'inline-flex',
                        padding: '3px 10px',
                        borderRadius: '20px',
                        fontSize: '11px',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        background: user.role === 'superadmin' ? 'rgba(121, 40, 202, 0.15)' : 'rgba(0, 198, 255, 0.15)',
                        color: user.role === 'superadmin' ? '#c084fc' : '#38bdf8',
                        border: user.role === 'superadmin' ? '1px solid rgba(121, 40, 202, 0.3)' : '1px solid rgba(0, 198, 255, 0.3)'
                      }}>
                        {user.role || 'Guest'}
                      </span>
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      <span style={{ color: '#cbd5e1' }}>
                        {user.email}
                      </span>
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      <span style={{ color: '#94a3b8', fontSize: '12px' }}>
                        {moment(user.createdAt).format('MMM DD, YYYY')}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <TablePagination
            backIconButtonProps={{
              'aria-label': 'Previous Page'
            }}
            component="div"
            count={users.length}
            nextIconButtonProps={{
              'aria-label': 'Next Page'
            }}
            onChangePage={this.handleChangePage}
            onChangeRowsPerPage={this.handleChangeRowsPerPage}
            page={page}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </PortletContent>
      </Portlet>
    );
  }
}

export default withStyles(styles)(UsersTable);
