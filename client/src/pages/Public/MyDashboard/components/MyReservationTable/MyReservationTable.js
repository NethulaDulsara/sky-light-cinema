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
  TablePagination,
  Button,
  Chip
} from '@material-ui/core';

import { Portlet, PortletContent } from '../../../../../components';
import styles from './styles';

const statusColor = {
  paid: { background: '#e6f4ea', color: '#137333' },
  pending: { background: '#fef7e0', color: '#8a6d00' },
  refunded: { background: '#e8eaf6', color: '#3730a3' },
  cancelled: { background: '#fce8e6', color: '#b3261e' },
  failed: { background: '#fce8e6', color: '#b3261e' },
  expired: { background: '#eceff1', color: '#555' }
};

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
    cinemas: PropTypes.array.isRequired,
    onCancel: PropTypes.func
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

  canCancel = reservation => {
    if (['cancelled', 'refunded', 'expired', 'failed'].includes(reservation.paymentStatus)) {
      return false;
    }
    // Only future showtimes can be cancelled.
    return new Date(reservation.date).getTime() > Date.now();
  };

  render() {
    const { classes, className, reservations, movies, cinemas, onCancel } = this.props;
    const { rowsPerPage, page } = this.state;
    const rootClassName = classNames(classes.root, className);

    return (
      <Portlet className={rootClassName}>
        <PortletContent noPadding>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="left">Movie</TableCell>
                <TableCell align="left">Cinema</TableCell>
                <TableCell align="left">Date</TableCell>
                <TableCell align="left">Start At</TableCell>
                <TableCell align="left">Ticket Price</TableCell>
                <TableCell align="left">Total</TableCell>
                <TableCell align="left">Status</TableCell>
                <TableCell align="left">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reservations
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(reservation => (
                  <TableRow
                    className={classes.tableRow}
                    hover
                    key={reservation._id}>
                    <TableCell className={classes.tableCell}>
                      {this.onFindAttr(reservation.movieId, movies, 'title')}
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      {this.onFindAttr(reservation.cinemaId, cinemas, 'name')}
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      {new Date(reservation.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      {reservation.startAt}
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      {reservation.ticketPrice}
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      {reservation.total}
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      <Chip
                        label={(reservation.paymentStatus || 'pending').toUpperCase()}
                        size="small"
                        style={statusColor[reservation.paymentStatus] || statusColor.pending}
                      />
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      {this.canCancel(reservation) ? (
                        <Button
                          size="small"
                          variant="outlined"
                          color="secondary"
                          onClick={() => onCancel && onCancel(reservation)}>
                          Cancel
                        </Button>
                      ) : (
                        <span style={{ opacity: 0.5 }}>—</span>
                      )}
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
