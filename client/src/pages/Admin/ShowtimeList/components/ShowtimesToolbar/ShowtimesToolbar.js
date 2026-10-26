import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles, Button, IconButton } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/DeleteOutline';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/EditOutlined';
import styles from './styles';

class ShowtimesToolbar extends Component {
  static propTypes = {
    className: PropTypes.string,
    classes: PropTypes.object.isRequired,
    selectedShowtimes: PropTypes.array
  };

  static defaultProps = {
    selectedShowtimes: []
  };

  render() {
    const {
      classes,
      className,
      selectedShowtimes,
      toggleDialog,
      deleteShowtime
    } = this.props;

    const rootClassName = classNames(classes.root, className);
    const isEditing = selectedShowtimes.length === 1;

    return (
      <div className={rootClassName}>
        <div className={classes.row}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {selectedShowtimes.length > 0 && (
              <IconButton
                className={classes.deleteButton}
                onClick={deleteShowtime}
                size="small">
                <DeleteIcon />
              </IconButton>
            )}

            <Button
              onClick={() => toggleDialog()}
              color="primary"
              variant="contained"
              className={classes.addButton}
              startIcon={isEditing ? <EditIcon /> : <AddIcon />}>
              {isEditing ? 'Edit Showtime' : 'Add Showtime'}
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(ShowtimesToolbar);
