import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination
} from '@material-ui/core';

import { Portlet, PortletContent } from '../../../../../components';
import styles from './styles';

class ReservationsTable extends Component {
  state = {
    rowsPerPage: 10,
    page: 0
  };

  static propTypes = {
    className: PropTypes.string,
    classes: PropTypes.object.isRequired,
    onSelect: PropTypes.func,
    onShowDetails: PropTypes.func,
    reservations: PropTypes.array.isRequired,
    movies: PropTypes.array.isRequired,
    cinemas: PropTypes.array.isRequired
  };

  static defaultProps = {
    reservations: [],
    movies: [],
    cinemas: [],
    onSelect: () => {},
    onShowDetails: () => {}
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  onFindAttr = (id, list, attr) => {
    const item = list.find(item => item._id === id);
    return item ? item[attr] : `Not ${attr} Found`;
  };

  getCreatedAt = (reservation) => {
    if (reservation.createdAt) return new Date(reservation.createdAt);
    return new Date(parseInt(reservation._id.substring(0, 8), 16) * 1000);
  };

  render() {
    const { classes, className, reservations, movies, cinemas } = this.props;
    const { rowsPerPage, page } = this.state;
    const rootClassName = classNames(classes.root, className);

    return (
      <Portlet className={rootClassName}>
        <PortletContent noPadding>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="left">User</TableCell>
                <TableCell align="left">Phone</TableCell>
                <TableCell align="left">Purchased At</TableCell>
                <TableCell align="left">Start At</TableCell>
                <TableCell align="left">Movie</TableCell>
                <TableCell align="left">Cinema</TableCell>
                <TableCell align="left">Ticket Price</TableCell>
                <TableCell align="left">Total</TableCell>
                <TableCell align="left">Checkin</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reservations
                .sort((a, b) => this.getCreatedAt(b) - this.getCreatedAt(a))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(reservation => (
                  <TableRow
                    className={classes.tableRow}
                    hover
                    key={reservation._id}>
                    <TableCell className={classes.tableCell}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #00C6FF 0%, #7928CA 100%)',
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: '12px'
                        }}>
                          {(reservation.username || 'G').charAt(0).toUpperCase()}
                        </div>
                        <span style={{ fontWeight: 600, color: '#f8fafc' }}>
                          {reservation.username}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      <span style={{ color: '#94a3b8', fontFamily: 'monospace' }}>
                        {reservation.phone}
                      </span>
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      <span style={{ color: '#94a3b8', fontSize: '12px' }}>
                        {this.getCreatedAt(reservation).toLocaleDateString()}
                      </span>
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      <span style={{
                        color: '#00C6FF',
                        background: 'rgba(0, 198, 255, 0.08)',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: 600
                      }}>
                        {reservation.startAt}
                      </span>
                    </TableCell>

                    <TableCell className={classes.tableCell}>
                      {(() => {
                        const title = this.onFindAttr(reservation.movieId, movies, 'title');
                        if (title && title !== 'Not title Found') {
                          return <span style={{ fontWeight: 600, color: '#f8fafc' }}>{title}</span>;
                        }
                        return (
                          <span style={{ color: '#94a3b8', fontStyle: 'italic', background: 'rgba(255,255,255,0.04)', padding: '2px 8px', borderRadius: '6px', fontSize: '11px' }}>
                            Past Screening
                          </span>
                        );
                      })()}
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      <span style={{ color: '#cbd5e1' }}>
                        {this.onFindAttr(reservation.cinemaId, cinemas, 'name')}
                      </span>
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      <span style={{ color: '#94a3b8' }}>
                        LKR {reservation.ticketPrice}
                      </span>
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      <span style={{ color: '#10b981', fontWeight: 700 }}>
                        LKR {reservation.total}
                      </span>
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '11px',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        background: reservation.checkin ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.12)',
                        color: reservation.checkin ? '#34d399' : '#fbbf24',
                        border: reservation.checkin ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(245, 158, 11, 0.25)'
                      }}>
                        <span style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          backgroundColor: reservation.checkin ? '#34d399' : '#fbbf24'
                        }} />
                        {reservation.checkin ? 'Checked In' : 'Pending'}
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
            count={reservations.length}
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

export default withStyles(styles)(ReservationsTable);
