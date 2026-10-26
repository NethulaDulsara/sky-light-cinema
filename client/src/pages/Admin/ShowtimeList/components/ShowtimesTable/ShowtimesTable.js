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

class ShowtimesTable extends Component {
  state = {
    rowsPerPage: 10,
    page: 0
  };

  static propTypes = {
    className: PropTypes.string,
    classes: PropTypes.object.isRequired,
    onSelect: PropTypes.func,
    onShowDetails: PropTypes.func,
    showtimes: PropTypes.array.isRequired,
    movies: PropTypes.array.isRequired,
    cinemas: PropTypes.array.isRequired
  };

  static defaultProps = {
    showtimes: [],
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

  render() {
    const {
      classes,
      className,
      showtimes,
      onSelectShowtime,
      selectedShowtimes,
      selectAllShowtimes,
      movies,
      cinemas
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
                    checked={selectedShowtimes.length === showtimes.length}
                    color="primary"
                    indeterminate={
                      selectedShowtimes.length > 0 &&
                      selectedShowtimes.length < showtimes.length
                    }
                    onChange={selectAllShowtimes}
                  />
                  ID
                </TableCell>
                <TableCell align="left">Movie</TableCell>
                <TableCell align="left">Cinema</TableCell>
                <TableCell align="left">Start Date</TableCell>
                <TableCell align="left">End Date</TableCell>
                <TableCell align="left">Time</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {showtimes
                .filter(showtime => {
                  return showtime;
                })
                .slice(0, rowsPerPage)
                .map(showtime => (
                  <TableRow
                    className={classes.tableRow}
                    hover
                    key={showtime._id}
                    selected={selectedShowtimes.indexOf(showtime._id) !== -1}>
                    <TableCell className={classes.tableCell}>
                      <div className={classes.tableCellInner} style={{ display: 'flex', alignItems: 'center' }}>
                        <Checkbox
                          checked={
                            selectedShowtimes.indexOf(showtime._id) !== -1
                          }
                          color="primary"
                          onChange={() => onSelectShowtime(showtime._id)}
                          value="true"
                        />
                        <span style={{
                          fontFamily: 'monospace',
                          fontSize: '11px',
                          color: '#00C6FF',
                          background: 'rgba(0, 198, 255, 0.08)',
                          border: '1px solid rgba(0, 198, 255, 0.2)',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          fontWeight: 600
                        }}>
                          #{showtime._id ? showtime._id.slice(-6).toUpperCase() : ''}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      {(() => {
                        const m = movies.find(mov => mov._id === showtime.movieId);
                        if (m && m.title) {
                          return <span style={{ fontWeight: 600, color: '#f8fafc' }}>{m.title}</span>;
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
                        {cinemas.find(c => c._id === showtime.cinemaId)?.name || 'Default Hall'}
                      </span>
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      <span style={{ color: '#94a3b8', fontSize: '12px' }}>
                        {moment(showtime.startDate).format('MMM DD, YYYY')}
                      </span>
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      <span style={{ color: '#94a3b8', fontSize: '12px' }}>
                        {moment(showtime.endDate).format('MMM DD, YYYY')}
                      </span>
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      <span style={{
                        color: '#10b981',
                        background: 'rgba(16, 185, 129, 0.1)',
                        border: '1px solid rgba(16, 185, 129, 0.25)',
                        padding: '4px 10px',
                        borderRadius: '20px',
                        fontWeight: 700,
                        fontSize: '12px'
                      }}>
                        {showtime.startAt}
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
            count={showtimes.length}
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

export default withStyles(styles)(ShowtimesTable);
