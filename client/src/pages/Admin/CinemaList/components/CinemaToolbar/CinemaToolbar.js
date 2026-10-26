import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles, Button } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { SearchInput, ResponsiveDialog } from '../../../../../components';
import styles from './styles';
import AddCinema from '../AddCinema/AddCinema';

class CinemaToolbar extends Component {
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
              placeholder="Search cinemas by name or city..."
              value={search}
              onChange={onChangeSearch}
            />
            <Button
              onClick={() => this.OpenAddDialog()}
              color="primary"
              variant="contained"
              className={classes.addButton}
              startIcon={<AddIcon />}>
              Add Cinema
            </Button>
          </div>
        </div>
        <ResponsiveDialog
          id="Add-cinema"
          title="Add New Cinema"
          open={openAddDialog}
          handleClose={() => this.CloseAddDialog()}>
          <AddCinema handleClose={() => this.CloseAddDialog()} />
        </ResponsiveDialog>
      </Fragment>
    );
  }
}

CinemaToolbar.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(CinemaToolbar);
