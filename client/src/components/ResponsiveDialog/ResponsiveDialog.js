import React from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Button,
  Typography,
  useMediaQuery
} from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles(theme => ({
  dialogPaper: {
    background: 'linear-gradient(145deg, #131b2e 0%, #0c101c 100%) !important',
    border: '1px solid rgba(255, 255, 255, 0.1) !important',
    borderRadius: '20px !important',
    boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 40px rgba(0, 198, 255, 0.08) !important',
    position: 'relative',
    overflow: 'hidden'
  },
  dialogTitle: {
    padding: theme.spacing(3, 4, 2),
    borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  titleText: {
    fontWeight: 800,
    fontSize: '20px',
    letterSpacing: '0.5px',
    background: 'linear-gradient(135deg, #ffffff 0%, #cbd5e1 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  },
  closeButton: {
    color: '#94a3b8',
    padding: '8px',
    borderRadius: '10px',
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    transition: 'all 0.2s ease',
    '&:hover': {
      color: '#ffffff',
      background: 'rgba(239, 68, 68, 0.15)',
      borderColor: 'rgba(239, 68, 68, 0.3)'
    }
  },
  dialogContent: {
    padding: `${theme.spacing(3, 4)} !important`
  },
  dialogActions: {
    padding: theme.spacing(2, 4),
    borderTop: '1px solid rgba(255, 255, 255, 0.06)',
    justifyContent: 'flex-end'
  },
  closeBtnAction: {
    color: '#94a3b8',
    borderRadius: '10px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    padding: '6px 20px',
    transition: 'all 0.2s ease',
    '&:hover': {
      color: '#ffffff',
      background: 'rgba(255, 255, 255, 0.05)',
      borderColor: 'rgba(255, 255, 255, 0.2)'
    }
  }
}));

const ResponsiveDialog = ({
  id,
  title = '',
  contentText,
  children,
  open,
  handleClose,
  maxWidth = 'md'
}) => {
  const theme = useTheme();
  const classes = useStyles();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Dialog
      fullScreen={fullScreen}
      fullWidth={true}
      maxWidth={maxWidth}
      open={open}
      onClose={handleClose}
      classes={{ paper: classes.dialogPaper }}
      aria-labelledby={id}>
      <div className={classes.dialogTitle}>
        <Typography variant="h5" className={classes.titleText}>
          {title}
        </Typography>
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={handleClose}
          size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </div>

      <DialogContent className={classes.dialogContent}>
        {contentText && (
          <DialogContentText style={{ color: '#94a3b8', marginBottom: '16px' }}>
            {contentText}
          </DialogContentText>
        )}
        {children}
      </DialogContent>

      <DialogActions className={classes.dialogActions}>
        <Button onClick={handleClose} className={classes.closeBtnAction}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ResponsiveDialog;
