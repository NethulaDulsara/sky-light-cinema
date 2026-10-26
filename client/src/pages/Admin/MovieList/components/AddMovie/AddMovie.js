import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles, Select, Button, TextField, MenuItem } from '@material-ui/core';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import styles from './styles';
import { genreData, languageData } from '../../../../../data/MovieDataService';
import {
  addMovie,
  updateMovie,
  removeMovie,
  setAlert
} from '../../../../../store/actions';
import FileUpload from '../../../../../components/FileUpload/FileUpload';

class AddMovie extends Component {
  state = {
    title: '',
    image: null,
    genre: [],
    language: '',
    duration: '',
    description: '',
    director: '',
    cast: '',
    releaseDate: new Date(),
    endDate: new Date(),
    loading: false
  };

  componentDidMount() {
    if (this.props.edit) {
      const {
        title,
        language,
        genre,
        director,
        cast,
        description,
        duration,
        releaseDate,
        endDate
      } = this.props.edit;
      this.setState({
        title,
        language,
        genre: typeof genre === 'string' ? genre.split(',') : (genre || []),
        director,
        cast,
        description,
        duration,
        releaseDate,
        endDate
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.movie !== this.props.movie && this.props.movie) {
      const { title, genre, language } = this.props.movie;
      this.setState({
        title,
        genre: typeof genre === 'string' ? genre.split(',') : (genre || []),
        language
      });
    }
  }

  handleFieldChange = (field, value) => {
    const newState = { ...this.state };
    newState[field] = value;
    this.setState(newState);
  };

  validateForm = () => {
    const {
      title,
      genre,
      language,
      duration,
      description,
      director,
      cast
    } = this.state;

    if (!title || !title.trim()) {
      this.props.setAlert('Please enter the movie title.', 'error', 5000);
      return false;
    }
    if (!genre || (Array.isArray(genre) && genre.length === 0)) {
      this.props.setAlert('Please select at least one genre.', 'error', 5000);
      return false;
    }
    if (!description || !description.trim()) {
      this.props.setAlert('Please provide a synopsis / description.', 'error', 5000);
      return false;
    }
    if (!language) {
      this.props.setAlert('Please select a language.', 'error', 5000);
      return false;
    }
    if (!duration || isNaN(Number(duration)) || Number(duration) <= 0) {
      this.props.setAlert('Please enter a valid movie duration in minutes.', 'error', 5000);
      return false;
    }
    if (!director || !director.trim()) {
      this.props.setAlert('Please enter the director name.', 'error', 5000);
      return false;
    }
    if (!cast || !cast.trim()) {
      this.props.setAlert('Please enter the cast members.', 'error', 5000);
      return false;
    }
    return true;
  };

  onAddMovie = async () => {
    if (!this.validateForm()) return;

    const {
      title,
      genre,
      language,
      duration,
      description,
      director,
      cast,
      releaseDate,
      endDate,
      image
    } = this.state;

    this.setState({ loading: true });

    const movie = {
      title: title.trim(),
      genre: Array.isArray(genre) ? genre.join(',') : genre,
      language: language.trim(),
      duration: Number(duration),
      description: description.trim(),
      director: director.trim(),
      cast: cast.trim(),
      releaseDate: releaseDate ? (releaseDate.toDate ? releaseDate.toDate() : (releaseDate._d || releaseDate)) : new Date(),
      endDate: endDate ? (endDate.toDate ? endDate.toDate() : (endDate._d || endDate)) : new Date()
    };

    const success = await this.props.addMovie(image, movie);
    this.setState({ loading: false });
    if (success && this.props.handleClose) {
      this.props.handleClose();
    }
  };

  onUpdateMovie = async () => {
    if (!this.validateForm()) return;

    const {
      title,
      genre,
      language,
      duration,
      description,
      director,
      cast,
      releaseDate,
      endDate,
      image
    } = this.state;

    this.setState({ loading: true });

    const movie = {
      title: title.trim(),
      genre: Array.isArray(genre) ? genre.join(',') : genre,
      language: language.trim(),
      duration: Number(duration),
      description: description.trim(),
      director: director.trim(),
      cast: cast.trim(),
      releaseDate: releaseDate ? (releaseDate.toDate ? releaseDate.toDate() : (releaseDate._d || releaseDate)) : new Date(),
      endDate: endDate ? (endDate.toDate ? endDate.toDate() : (endDate._d || endDate)) : new Date()
    };

    const success = await this.props.updateMovie(this.props.edit._id, movie, image);
    this.setState({ loading: false });
    if (success && this.props.handleClose) {
      this.props.handleClose();
    }
  };

  onRemoveMovie = async () => {
    this.setState({ loading: true });
    const success = await this.props.removeMovie(this.props.edit._id);
    this.setState({ loading: false });
    if (success && this.props.handleClose) {
      this.props.handleClose();
    }
  };

  render() {
    const { classes, className } = this.props;
    const {
      title,
      image,
      genre,
      language,
      duration,
      description,
      director,
      cast,
      releaseDate,
      endDate,
      loading
    } = this.state;

    const rootClassName = classNames(classes.root, className);
    const submitButton = this.props.edit
      ? (loading ? 'Updating Movie...' : 'Update Movie')
      : (loading ? 'Saving Details...' : 'Save Details');
    const submitAction = this.props.edit
      ? () => this.onUpdateMovie()
      : () => this.onAddMovie();

    return (
      <div className={rootClassName}>
        <form autoComplete="off" noValidate className={classes.form}>
          <div className={classes.row}>
            <TextField
              className={classes.field}
              label="Movie Title"
              placeholder="e.g. Inception"
              required
              value={title}
              variant="outlined"
              onChange={event =>
                this.handleFieldChange('title', event.target.value)
              }
            />
            <TextField
              select
              className={classes.field}
              label="Genre"
              required
              SelectProps={{
                multiple: true,
                value: genre,
                renderValue: selected => (Array.isArray(selected) ? selected.join(', ') : selected)
              }}
              variant="outlined"
              onChange={event =>
                this.handleFieldChange('genre', event.target.value)
              }>
              {genreData.map((genreItem, index) => (
                <MenuItem key={genreItem + '-' + index} value={genreItem}>
                  {genreItem}
                </MenuItem>
              ))}
            </TextField>
          </div>

          <TextField
            fullWidth
            multiline
            rows={3}
            className={classes.field}
            label="Synopsis / Description"
            placeholder="Write a brief overview of the storyline..."
            required
            variant="outlined"
            value={description}
            onChange={event =>
              this.handleFieldChange('description', event.target.value)
            }
          />

          <div className={classes.row}>
            <TextField
              select
              className={classes.field}
              label="Language"
              required
              value={language}
              variant="outlined"
              onChange={event =>
                this.handleFieldChange('language', event.target.value)
              }>
              {languageData.map((langItem, index) => (
                <MenuItem key={langItem + '-' + index} value={langItem}>
                  {langItem}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              className={classes.field}
              label="Duration (Minutes)"
              placeholder="e.g. 148"
              type="number"
              value={duration}
              variant="outlined"
              onChange={event =>
                this.handleFieldChange('duration', event.target.value)
              }
            />
          </div>

          <div className={classes.row}>
            <TextField
              className={classes.field}
              label="Director"
              placeholder="e.g. Christopher Nolan"
              required
              value={director}
              variant="outlined"
              onChange={event =>
                this.handleFieldChange('director', event.target.value)
              }
            />
            <TextField
              className={classes.field}
              label="Cast"
              placeholder="e.g. Leonardo DiCaprio, Joseph Gordon-Levitt"
              required
              value={cast}
              variant="outlined"
              onChange={event =>
                this.handleFieldChange('cast', event.target.value)
              }
            />
          </div>

          <MuiPickersUtilsProvider utils={MomentUtils}>
            <div className={classes.row}>
              <KeyboardDatePicker
                className={classes.field}
                inputVariant="outlined"
                id="release-date"
                label="Release Date"
                format="MMMM Do YYYY"
                value={releaseDate}
                onChange={date =>
                  this.handleFieldChange('releaseDate', date ? date._d : new Date())
                }
              />
              <KeyboardDatePicker
                className={classes.field}
                inputVariant="outlined"
                id="end-date"
                label="End Date"
                format="MMMM Do YYYY"
                value={endDate}
                onChange={date =>
                  this.handleFieldChange('endDate', date ? date._d : new Date())
                }
              />
            </div>
          </MuiPickersUtilsProvider>

          <FileUpload
            className={classes.upload}
            file={image}
            onUpload={event => {
              const file = event.target.files[0];
              this.handleFieldChange('image', file);
            }}
          />

          <div className={classes.actions}>
            <Button
              className={classes.submitButton}
              color="primary"
              variant="contained"
              disabled={loading}
              onClick={submitAction}>
              {submitButton}
            </Button>
            {this.props.edit && (
              <Button
                color="secondary"
                className={classes.deleteButton}
                variant="contained"
                disabled={loading}
                onClick={this.onRemoveMovie}>
                {loading ? 'Deleting...' : 'Delete Movie'}
              </Button>
            )}
          </div>
        </form>
      </div>
    );
  }
}

AddMovie.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object,
  movie: PropTypes.object,
  handleClose: PropTypes.func
};

const mapStateToProps = ({ movieState }) => ({
  movies: movieState.movies
});

const mapDispatchToProps = { addMovie, updateMovie, removeMovie, setAlert };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(AddMovie));
