import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles, Button, TextField, MenuItem } from '@material-ui/core';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';

import styles from './styles';
import { addShowtime, updateShowtime, toggleDialog } from '../../../../../store/actions';
import SeatFreezePicker from '../../../../../components/SeatFreezePicker';

class AddShowtime extends Component {
  state = {
    startAt: '13:00',
    startDate: new Date(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    movieId: '',
    cinemaId: '',
    format: '2D',
    frozenSeats: [],
    formatOptions: ['2D', '3D', 'IMAX', '4DX']
  };

  async componentDidMount() {
    const { movies, cinemas, selectedShowtime } = this.props;
    // Load the admin-configured screen formats.
    try {
      const res = await fetch('/settings');
      if (res.ok) {
        const s = await res.json();
        const opts = (s.formats || []).filter(f => f.enabled).map(f => f.name);
        if (opts.length) this.setState({ formatOptions: opts });
      }
    } catch (e) {
      /* fall back to defaults */
    }
    if (selectedShowtime) {
      const {
        startAt,
        startDate,
        endDate,
        movieId,
        cinemaId,
        format,
        frozenSeats
      } = selectedShowtime;
      this.setState({
        startAt,
        startDate: startDate ? new Date(startDate) : new Date(),
        endDate: endDate ? new Date(endDate) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        movieId,
        cinemaId,
        format: format || '2D',
        frozenSeats: frozenSeats || []
      });
    } else {
      this.setState({
        movieId: movies && movies.length ? movies[0]._id : '',
        cinemaId: cinemas && cinemas.length ? cinemas[0]._id : ''
      });
    }
  }

  handleFieldChange = (field, value) => {
    const newState = { ...this.state };
    newState[field] = value;
    this.setState(newState);
  };

  onAddShowtime = () => {
    const { movies, cinemas } = this.props;
    const { startAt, startDate, endDate, movieId, cinemaId, format, frozenSeats } = this.state;
    const finalMovieId = movieId || (movies[0] && movies[0]._id);
    const finalCinemaId = cinemaId || (cinemas[0] && cinemas[0]._id);
    const finalStartDate = startDate || new Date();
    const finalEndDate = endDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const finalStartAt = startAt || '13:00';

    const showtime = {
      startAt: finalStartAt,
      startDate: finalStartDate,
      endDate: finalEndDate,
      movieId: finalMovieId,
      cinemaId: finalCinemaId,
      format: format || '2D',
      frozenSeats: frozenSeats || []
    };
    this.props.addShowtime(showtime);
  };

  onUpdateShowtime = () => {
    const { startAt, startDate, endDate, movieId, cinemaId, format, frozenSeats } = this.state;
    const showtime = {
      startAt: startAt || '13:00',
      startDate: startDate || new Date(),
      endDate: endDate || new Date(),
      movieId,
      cinemaId,
      format: format || '2D',
      frozenSeats: frozenSeats || []
    };
    this.props.updateShowtime(showtime, this.props.selectedShowtime._id);
  };

  onFilterMinDate = () => {
    const { movies } = this.props;
    const { movieId } = this.state;
    const selectedMovie = movies.find(movie => movie._id === movieId);
    if (selectedMovie) return new Date(selectedMovie.releaseDate);
    return new Date();
  };

  onFilterMaxDate = () => {
    const { movies } = this.props;
    const { movieId } = this.state;
    const selectedMovie = movies.find(movie => movie._id === movieId);
    if (selectedMovie) return new Date(selectedMovie.endDate);
    return false;
  };

  render() {
    const { movies, cinemas, classes, className } = this.props;
    const { startAt, startDate, endDate, movieId, cinemaId, format, formatOptions, frozenSeats } = this.state;
    const selectedCinema = cinemas.find(c => c._id === cinemaId);
    const cinemaSeats = selectedCinema ? selectedCinema.seats : [];

    const rootClassName = classNames(classes.root, className);
    const submitButton = this.props.selectedShowtime
      ? 'Update Showtime'
      : 'Save Details';
    const submitAction = this.props.selectedShowtime
      ? () => this.onUpdateShowtime()
      : () => this.onAddShowtime();

    return (
      <div className={rootClassName}>
        <form autoComplete="off" noValidate className={classes.form}>
          <div className={classes.row}>
            <TextField
              select
              className={classes.field}
              label="Movie"
              required
              value={movieId}
              variant="outlined"
              onChange={event =>
                this.handleFieldChange('movieId', event.target.value)
              }>
              {movies.map(movie => (
                <MenuItem key={movie._id} value={movie._id}>
                  {movie.title}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              className={classes.field}
              label="Cinema Hall"
              required
              value={cinemaId}
              variant="outlined"
              onChange={event =>
                this.handleFieldChange('cinemaId', event.target.value)
              }>
              {cinemas.map(cinema => (
                <MenuItem key={cinema._id} value={cinema._id}>
                  {cinema.name}
                </MenuItem>
              ))}
            </TextField>
          </div>

          <TextField
            select
            className={classes.field}
            label="Showtime Hour"
            helperText="Select the daily screening time"
            required
            value={startAt}
            variant="outlined"
            onChange={event =>
              this.handleFieldChange('startAt', event.target.value)
            }>
            {['10:00', '13:00', '15:30', '18:00', '19:00', '20:00', '21:00', '22:00'].map(
              time => (
                <MenuItem key={`time-${time}`} value={time}>
                  {time}
                </MenuItem>
              )
            )}
          </TextField>

          <TextField
            select
            className={classes.field}
            label="Screen Format"
            helperText="Drives the ticket price multiplier"
            value={format}
            variant="outlined"
            onChange={event => this.handleFieldChange('format', event.target.value)}>
            {formatOptions.map(f => (
              <MenuItem key={`fmt-${f}`} value={f}>
                {f}
              </MenuItem>
            ))}
          </TextField>

          <MuiPickersUtilsProvider utils={MomentUtils}>
            <div className={classes.row}>
              <KeyboardDatePicker
                className={classes.field}
                inputVariant="outlined"
                id="start-date"
                label="Start Date"
                format="MMMM Do YYYY"
                value={startDate}
                onChange={date => {
                  const d = date && date.toDate ? date.toDate() : (date && date._d ? date._d : new Date(date || Date.now()));
                  this.handleFieldChange('startDate', d);
                }}
              />

              <KeyboardDatePicker
                className={classes.field}
                inputVariant="outlined"
                id="end-date"
                label="End Date"
                format="MMMM Do YYYY"
                minDate={new Date(new Date(startDate || Date.now()).setHours(0, 0, 0, 0))}
                value={endDate}
                onChange={date => {
                  const d = date && date.toDate ? date.toDate() : (date && date._d ? date._d : new Date(date || Date.now()));
                  this.handleFieldChange('endDate', d);
                }}
              />
            </div>
          </MuiPickersUtilsProvider>

          {cinemaSeats && cinemaSeats.length > 0 && (
            <div className={classes.field}>
              <div style={{ fontWeight: 700, marginTop: 8 }}>
                Freeze Seats (this screening only)
              </div>
              <div style={{ color: '#94a3b8', fontSize: 13, marginBottom: 8 }}>
                These are blocked for this showtime, in addition to any seats frozen
                hall-wide on the cinema.
              </div>
              <SeatFreezePicker
                seats={cinemaSeats}
                value={frozenSeats}
                onChange={fs => this.setState({ frozenSeats: fs })}
              />
            </div>
          )}

          <div className={classes.actions}>
            <Button
              className={classes.submitButton}
              color="primary"
              variant="contained"
              onClick={submitAction}>
              {submitButton}
            </Button>
          </div>
        </form>
      </div>
    );
  }
}

AddShowtime.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired
};

const mapStateToProps = ({ movieState, cinemaState }) => ({
  movies: movieState.movies,
  cinemas: cinemaState.cinemas
});

const mapDispatchToProps = { addShowtime, updateShowtime, toggleDialog };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(AddShowtime));
