import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles, Button, IconButton } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/DeleteOutline';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/EditOutlined';
import styles from './styles';

const UsersToolbar = props => {
  const { classes, className, toggleDialog, selectedUsers, deleteUser } = props;
  const rootClassName = classNames(classes.root, className);
  const isEditing = selectedUsers.length === 1;

  return (
    <div className={rootClassName}>
      <div className={classes.row}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {selectedUsers.length > 0 && (
            <IconButton className={classes.deleteButton} onClick={deleteUser} size="small">
              <DeleteIcon />
            </IconButton>
          )}
          <Button
            onClick={toggleDialog}
            color="primary"
            variant="contained"
            className={classes.addButton}
            startIcon={isEditing ? <EditIcon /> : <AddIcon />}>
            {isEditing ? 'Edit User' : 'Add User'}
          </Button>
        </div>
      </div>
    </div>
  );
};

UsersToolbar.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired,
  selectedUsers: PropTypes.array
};

UsersToolbar.defaultProps = {
  selectedUsers: []
};

export default withStyles(styles)(UsersToolbar);
