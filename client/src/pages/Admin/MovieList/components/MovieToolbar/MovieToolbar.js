import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles, Button } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { SearchInput, ResponsiveDialog } from '../../../../../components';
import styles from './styles';
import AddMovie from '../AddMovie/AddMovie';

class MovieToolbar extends Component {
  state = {
    openAddDialog: false
  };

  OpenAddDialog() {
    this.setState({ openAddDialog: true });
  }

  CloseAddDialog() {
    this.setState({ openAddDialog: false });
  }

  render() {
    const { openAddDialog } = this.state;
    const { classes, className, search, onChangeSearch } = this.props;
    const rootClassName = classNames(classes.root, className);

    return (
      <Fragment>
        <div className={rootClassName}>
          <div className={classes.row}>
            <SearchInput
              className={classes.searchInput}
              placeholder="Search movies by title..."
              value={search}
              onChange={onChangeSearch}
            />
            <Button
              onClick={() => this.OpenAddDialog()}
              color="primary"
              variant="contained"
              className={classes.addButton}
              startIcon={<AddIcon />}>
              Add Movie
            </Button>
          </div>
        </div>
        <ResponsiveDialog
          id="Add-movie"
          title="Add New Movie"
          open={openAddDialog}
          handleClose={() => this.CloseAddDialog()}>
          <AddMovie handleClose={() => this.CloseAddDialog()} />
        </ResponsiveDialog>
      </Fragment>
    );
  }
}

MovieToolbar.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(MovieToolbar);
