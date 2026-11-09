import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  withStyles,
  Typography,
  TextField,
  MenuItem,
  Button
} from '@material-ui/core';
import styles from './styles';
import { AddShowtime, ShowtimesToolbar, ShowtimesTable } from './components';
import {
  getShowtimes,
  toggleDialog,
  selectShowtime,
  selectAllShowtimes,
  deleteShowtime,
  getMovies,
  getCinemas
} from '../../../store/actions';
import { ResponsiveDialog } from '../../../components';

class ShowtimeList extends Component {
  static propTypes = {
    className: PropTypes.string,
    classes: PropTypes.object.isRequired
  };

  state = { fMovie: 'all', fCinema: 'all', fTime: 'all' };

  componentDidMount() {
    const { showtimes, getShowtimes, movies, getMovies, cinemas, getCinemas } = this.props;
    if (!showtimes.length) getShowtimes();
    if (!movies.length) getMovies();
    if (!cinemas.length) getCinemas();
  }

  handleDeleteShowtime = () => {
    const { selectedShowtimes, deleteShowtime } = this.props;
    selectedShowtimes.forEach(element => deleteShowtime(element));
  };

  setFilter = (key, value) => this.setState({ [key]: value });

  clearFilters = () => this.setState({ fMovie: 'all', fCinema: 'all', fTime: 'all' });

  getFilteredShowtimes = () => {
    const { showtimes } = this.props;
    const { fMovie, fCinema, fTime } = this.state;
    return showtimes.filter(
      s =>
        (fMovie === 'all' || s.movieId === fMovie) &&
        (fCinema === 'all' || s.cinemaId === fCinema) &&
        (fTime === 'all' || s.startAt === fTime)
    );
  };

  render() {
    const {
      classes,
      showtimes,
      selectedShowtimes,
      openDialog,
      toggleDialog,
      selectShowtime,
      selectAllShowtimes,
      movies,
      cinemas
    } = this.props;
    const { fMovie, fCinema, fTime } = this.state;

    // Build filter option lists from the showtimes actually present.
    const movieOptions = Array.from(
      new Set(showtimes.map(s => s.movieId))
    )
      .map(id => ({ id, title: (movies.find(m => m._id === id) || {}).title }))
      .filter(o => o.title)
      .sort((a, b) => a.title.localeCompare(b.title));

    const cinemaOptions = Array.from(
      new Set(showtimes.map(s => s.cinemaId))
    )
      .map(id => ({ id, name: (cinemas.find(c => c._id === id) || {}).name }))
      .filter(o => o.name)
      .sort((a, b) => a.name.localeCompare(b.name));

    const timeOptions = Array.from(
      new Set(showtimes.map(s => s.startAt).filter(Boolean))
    ).sort();

    const filtered = this.getFilteredShowtimes();
    const isFiltered = fMovie !== 'all' || fCinema !== 'all' || fTime !== 'all';

    const selectProps = {
      select: true,
      variant: 'outlined',
      size: 'small',
      InputProps: { style: { color: '#fff' } },
      InputLabelProps: { style: { color: '#94a3b8' } },
      SelectProps: {
        MenuProps: { PaperProps: { style: { background: '#121725', color: '#fff' } } }
      },
      style: { minWidth: 200 }
    };

    return (
      <div className={classes.root}>
        <ShowtimesToolbar
          showtimes={showtimes}
          toggleDialog={toggleDialog}
          selectedShowtimes={selectedShowtimes}
          deleteShowtime={this.handleDeleteShowtime}
        />
        <div className={classes.content}>
          {!showtimes.length ? (
            <Typography variant="h6">There are no showtimes</Typography>
          ) : (
            <>
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 16,
                  alignItems: 'center',
                  marginBottom: 20
                }}>
                <TextField
                  {...selectProps}
                  label="Movie"
                  value={fMovie}
                  onChange={e => this.setFilter('fMovie', e.target.value)}>
                  <MenuItem value="all">All movies</MenuItem>
                  {movieOptions.map(o => (
                    <MenuItem key={o.id} value={o.id} style={{ textTransform: 'capitalize' }}>
                      {o.title}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  {...selectProps}
                  label="Cinema"
                  value={fCinema}
                  onChange={e => this.setFilter('fCinema', e.target.value)}>
                  <MenuItem value="all">All cinemas</MenuItem>
                  {cinemaOptions.map(o => (
                    <MenuItem key={o.id} value={o.id}>
                      {o.name}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  {...selectProps}
                  label="Time"
                  value={fTime}
                  style={{ minWidth: 140 }}
                  onChange={e => this.setFilter('fTime', e.target.value)}>
                  <MenuItem value="all">All times</MenuItem>
                  {timeOptions.map(t => (
                    <MenuItem key={t} value={t}>
                      {t}
                    </MenuItem>
                  ))}
                </TextField>

                <Typography variant="body2" style={{ color: '#94a3b8' }}>
                  {filtered.length} of {showtimes.length} showtimes
                </Typography>
                {isFiltered && (
                  <Button
                    size="small"
                    onClick={this.clearFilters}
                    style={{ color: '#00C6FF' }}>
                    Clear filters
                  </Button>
                )}
              </div>

              {filtered.length === 0 ? (
                <Typography variant="h6" style={{ color: '#94a3b8' }}>
                  No showtimes match these filters.
                </Typography>
              ) : (
                <ShowtimesTable
                  key={`${fMovie}-${fCinema}-${fTime}`}
                  onSelectShowtime={selectShowtime}
                  selectedShowtimes={selectedShowtimes}
                  selectAllShowtimes={selectAllShowtimes}
                  showtimes={filtered}
                  movies={movies}
                  cinemas={cinemas}
                />
              )}
            </>
          )}
        </div>
        <ResponsiveDialog
          id="Add-showtime"
          title={selectedShowtimes.length === 1 ? 'Edit Showtime' : 'Create New Showtime'}
          open={openDialog}
          handleClose={() => toggleDialog()}>
          <AddShowtime
            selectedShowtime={showtimes.find(
              showtime => showtime._id === selectedShowtimes[0]
            )}
          />
        </ResponsiveDialog>
      </div>
    );
  }
}

const mapStateToProps = ({ showtimeState, movieState, cinemaState }) => ({
  openDialog: showtimeState.openDialog,
  showtimes: showtimeState.showtimes,
  selectedShowtimes: showtimeState.selectedShowtimes,
  movies: movieState.movies,
  cinemas: cinemaState.cinemas
});

const mapDispatchToProps = {
  getShowtimes,
  toggleDialog,
  selectShowtime,
  selectAllShowtimes,
  deleteShowtime,
  getMovies,
  getCinemas
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(ShowtimeList));
