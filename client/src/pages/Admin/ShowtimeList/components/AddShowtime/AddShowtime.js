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

class AddShowtime extends Component {
  state = {
    startAt: '13:00',
    startDate: new Date(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    movieId: '',
    cinemaId: ''
  };

  componentDidMount() {
    const { movies, cinemas, selectedShowtime } = this.props;
    if (selectedShowtime) {
      const {
        startAt,
        startDate,
        endDate,
        movieId,
        cinemaId
      } = selectedShowtime;
      this.setState({
        startAt,
        startDate: startDate ? new Date(startDate) : new Date(),
        endDate: endDate ? new Date(endDate) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        movieId,
        cinemaId
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
    const { startAt, startDate, endDate, movieId, cinemaId } = this.state;
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
      cinemaId: finalCinemaId
    };
    this.props.addShowtime(showtime);
  };

  onUpdateShowtime = () => {
    const { startAt, startDate, endDate, movieId, cinemaId } = this.state;
    const showtime = {
      startAt: startAt || '13:00',
      startDate: startDate || new Date(),
      endDate: endDate || new Date(),
      movieId,
      cinemaId
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
    const { startAt, startDate, endDate, movieId, cinemaId } = this.state;

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

          <MuiPickersUtilsProvider utils={MomentUtils}>
            <div className={classes.row}>
              <KeyboardDatePicker
                className={classes.field}
                inputVariant="outlined"
                id="start-date"
                label="Start Date"
                format="MMMM Do YYYY"
                minDate={new Date()}
                maxDate={this.onFilterMaxDate()}
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
                minDate={new Date(startDate || Date.now())}
                maxDate={this.onFilterMaxDate()}
                value={endDate}
                onChange={date => {
                  const d = date && date.toDate ? date.toDate() : (date && date._d ? date._d : new Date(date || Date.now()));
                  this.handleFieldChange('endDate', d);
                }}
              />
            </div>
          </MuiPickersUtilsProvider>

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
