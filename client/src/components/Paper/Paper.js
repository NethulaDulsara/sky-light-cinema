import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core';
import { Paper } from '@material-ui/core';

const styles = theme => ({
  root: {
    borderRadius: '16px',
    maxWidth: '100%',
    backgroundColor: 'rgba(17, 24, 39, 0.75)',
    backgroundImage: 'linear-gradient(145deg, rgba(25, 34, 53, 0.6) 0%, rgba(13, 18, 30, 0.8) 100%)',
    border: '1px solid rgba(255, 255, 255, 0.07)',
    boxShadow: '0 12px 36px 0 rgba(0, 0, 0, 0.45)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    overflow: 'hidden',
    transition: 'border-color 0.25s ease'
  },
  squared: {
    borderRadius: 0
  },
  outlined: {
    border: '1px solid rgba(255, 255, 255, 0.07)'
  }
});

const CustomPaper = props => {
  const { classes, className, outlined, squared, children, ...rest } = props;

  const rootClassName = classNames(
    {
      [classes.root]: true,
      [classes.squared]: squared,
      [classes.outlined]: outlined
    },
    className
  );

  return (
    <Paper {...rest} className={rootClassName}>
      {children}
    </Paper>
  );
};

CustomPaper.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  classes: PropTypes.object.isRequired,
  elevation: PropTypes.number,
  outlined: PropTypes.bool,
  squared: PropTypes.bool
};

CustomPaper.defaultProps = {
  squared: false,
  outlined: true,
  elevation: 0
};

export default withStyles(styles)(CustomPaper);
