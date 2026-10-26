import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles, Button, Typography } from '@material-ui/core';
import CloudUploadIcon from '@material-ui/icons/CloudUploadOutlined';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';

const styles = theme => ({
  root: {
    padding: theme.spacing(2.5),
    borderRadius: '14px',
    border: '1.5px dashed rgba(0, 198, 255, 0.3)',
    backgroundColor: 'rgba(0, 198, 255, 0.02)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: theme.spacing(2),
    transition: 'all 0.25s ease',
    '&:hover': {
      borderColor: '#00C6FF',
      backgroundColor: 'rgba(0, 198, 255, 0.05)',
      boxShadow: '0 0 20px rgba(0, 198, 255, 0.1)'
    }
  },
  leftSection: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1.5)
  },
  uploadIcon: {
    fontSize: '28px',
    color: '#00C6FF'
  },
  input: {
    display: 'none'
  },
  button: {
    background: 'rgba(0, 198, 255, 0.1)',
    color: '#00C6FF',
    border: '1px solid rgba(0, 198, 255, 0.3)',
    borderRadius: '10px',
    padding: '6px 18px',
    fontWeight: 600,
    textTransform: 'none',
    transition: 'all 0.2s ease',
    '&:hover': {
      background: 'linear-gradient(135deg, #00C6FF 0%, #0072FF 100%)',
      color: '#ffffff',
      borderColor: 'transparent'
    }
  },
  fileBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '13px',
    fontWeight: 500,
    color: '#10b981',
    background: 'rgba(16, 185, 129, 0.1)',
    border: '1px solid rgba(16, 185, 129, 0.2)',
    padding: '4px 12px',
    borderRadius: '20px'
  },
  noFile: {
    color: '#64748b',
    fontSize: '13px',
    fontStyle: 'italic'
  }
});

const FileUpload = props => {
  const { classes, className, file, onUpload } = props;
  const rootClassName = classNames(classes.root, className);

  return (
    <div className={rootClassName}>
      <div className={classes.leftSection}>
        <CloudUploadIcon className={classes.uploadIcon} />
        <div>
          <Typography variant="body2" style={{ fontWeight: 600, color: '#f8fafc' }}>
            Upload Media Poster
          </Typography>
          <Typography variant="caption" style={{ color: '#94a3b8' }}>
            Supports JPG, PNG, WEBP (Max 5MB)
          </Typography>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {file ? (
          <span className={classes.fileBadge}>
            <CheckCircleOutlineIcon style={{ fontSize: '16px' }} />
            {file.name}
          </span>
        ) : (
          <span className={classes.noFile}>No file selected</span>
        )}

        <input
          accept="image/*"
          className={classes.input}
          id="icon-button-file"
          type="file"
          onChange={onUpload}
        />
        <label htmlFor="icon-button-file" style={{ margin: 0 }}>
          <Button className={classes.button} component="span">
            Browse
          </Button>
        </label>
      </div>
    </div>
  );
};

FileUpload.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired,
  file: PropTypes.object,
  onUpload: PropTypes.func.isRequired
};

export default withStyles(styles)(FileUpload);
