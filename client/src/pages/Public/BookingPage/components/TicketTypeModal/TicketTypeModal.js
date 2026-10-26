import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Dialog,
  DialogContent,
  Typography,
  IconButton,
  Button,
  Box
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';

const useStyles = makeStyles(theme => ({
  dialogPaper: {
    backgroundColor: '#0f1422 !important',
    background: 'linear-gradient(145deg, #161d31 0%, #0c101c 100%) !important',
    color: '#f8fafc',
    borderRadius: '20px',
    border: '1px solid rgba(0, 198, 255, 0.25)',
    boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 30px rgba(0, 198, 255, 0.12)',
    padding: theme.spacing(3.5),
    maxWidth: '460px',
    width: '100%',
    fontFamily: '"Montserrat", sans-serif',
    position: 'relative',
    overflow: 'hidden'
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(2),
    top: theme.spacing(2),
    color: '#94a3b8',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    padding: '6px',
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: 'rgba(239, 68, 68, 0.2)',
      color: '#ef4444',
      borderColor: 'rgba(239, 68, 68, 0.4)',
      transform: 'rotate(90deg)'
    }
  },
  closeIcon: {
    fontSize: '18px'
  },
  headerTitle: {
    fontSize: '22px',
    fontWeight: 700,
    letterSpacing: '1px',
    textAlign: 'center',
    marginTop: theme.spacing(1),
    color: '#ffffff',
    textTransform: 'uppercase'
  },
  subtitle: {
    fontSize: '12px',
    textAlign: 'center',
    color: '#94a3b8',
    marginBottom: theme.spacing(4),
    marginTop: theme.spacing(1),
    letterSpacing: '0.5px'
  },
  ticketRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(2.5),
    padding: theme.spacing(2),
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    transition: 'border-color 0.2s',
    '&:hover': {
      borderColor: 'rgba(0, 198, 255, 0.3)'
    }
  },
  ticketInfo: {
    display: 'flex',
    flexDirection: 'column'
  },
  ticketTypeTitle: {
    fontSize: '15px',
    fontWeight: 700,
    color: '#f8fafc',
    letterSpacing: '0.5px'
  },
  ticketPriceText: {
    fontSize: '14px',
    color: '#00C6FF',
    fontWeight: 600,
    marginTop: '4px'
  },
  counterContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px'
  },
  iconButton: {
    padding: 0,
    color: '#f8fafc',
    transition: 'all 0.2s',
    '&:hover': {
      color: '#00C6FF',
      transform: 'scale(1.1)'
    },
    '&.Mui-disabled': {
      color: 'rgba(255, 255, 255, 0.15)'
    }
  },
  counterIcon: {
    fontSize: '34px'
  },
  counterValue: {
    fontSize: '22px',
    fontWeight: 800,
    color: '#ff4d6d',
    width: '32px',
    textAlign: 'center'
  },
  proceedButtonWrapper: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(1)
  },
  proceedButton: {
    background: 'linear-gradient(135deg, #00C6FF 0%, #0072ff 100%)',
    color: '#ffffff',
    padding: '12px 64px',
    fontWeight: 700,
    fontSize: '14px',
    letterSpacing: '1px',
    borderRadius: '10px',
    textTransform: 'uppercase',
    boxShadow: '0 4px 20px rgba(0, 198, 255, 0.4)',
    transition: 'all 0.2s ease',
    '&:hover': {
      background: 'linear-gradient(135deg, #00b4e6 0%, #0060d6 100%)',
      boxShadow: '0 6px 25px rgba(0, 198, 255, 0.6)',
      transform: 'translateY(-1px)'
    },
    '&.Mui-disabled': {
      background: 'rgba(255, 255, 255, 0.08)',
      color: 'rgba(255, 255, 255, 0.3)',
      boxShadow: 'none'
    }
  }
}));

export default function TicketTypeModal({
  open,
  onClose,
  onProceed,
  totalTickets,
  adultPrice
}) {
  const classes = useStyles();
  
  const childPrice = adultPrice - 100;

  // State for ticket counts
  const [adultCount, setAdultCount] = useState(totalTickets);
  const [childCount, setChildCount] = useState(0);

  // Sync state when modal opens or totalTickets changes
  useEffect(() => {
    if (open) {
      setAdultCount(totalTickets);
      setChildCount(0);
    }
  }, [open, totalTickets]);

  const currentTotal = adultCount + childCount;

  const handleIncrementAdult = () => {
    if (currentTotal < totalTickets) {
      setAdultCount(prev => prev + 1);
    } else if (childCount > 0) {
      setChildCount(prev => prev - 1);
      setAdultCount(prev => prev + 1);
    }
  };

  const handleDecrementAdult = () => {
    if (adultCount > 0) setAdultCount(prev => prev - 1);
  };

  const handleIncrementChild = () => {
    if (currentTotal < totalTickets) {
      setChildCount(prev => prev + 1);
    } else if (adultCount > 0) {
      setAdultCount(prev => prev - 1);
      setChildCount(prev => prev + 1);
    }
  };

  const handleDecrementChild = () => {
    if (childCount > 0) setChildCount(prev => prev - 1);
  };

  const formatPrice = (price) => {
    return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const handleProceed = () => {
    onProceed(adultCount, childCount);
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      classes={{ paper: classes.dialogPaper }}
      maxWidth="sm"
    >
      <IconButton className={classes.closeButton} onClick={onClose}>
        <CloseIcon className={classes.closeIcon} />
      </IconButton>
      
      <DialogContent>
        <Typography className={classes.headerTitle}>SELECT TICKETS TYPE</Typography>
        <Typography className={classes.subtitle}>
          {totalTickets} ticket(s) selected | Area: ODC
        </Typography>

        {/* Adult Row */}
        <Box className={classes.ticketRow}>
          <Box className={classes.ticketInfo}>
            <Typography className={classes.ticketTypeTitle}>ODC ADULT</Typography>
            <Typography className={classes.ticketPriceText}>LKR {formatPrice(adultPrice)}</Typography>
          </Box>
          <Box className={classes.counterContainer}>
            <IconButton 
              className={classes.iconButton} 
              onClick={handleDecrementAdult}
              disabled={adultCount === 0}
            >
              <RemoveCircleOutlineIcon className={classes.counterIcon} />
            </IconButton>
            <Typography className={classes.counterValue}>{adultCount}</Typography>
            <IconButton 
              className={classes.iconButton} 
              onClick={handleIncrementAdult}
              disabled={adultCount === totalTickets}
            >
              <AddCircleOutlineIcon className={classes.counterIcon} />
            </IconButton>
          </Box>
        </Box>

        {/* Child Row */}
        <Box className={classes.ticketRow}>
          <Box className={classes.ticketInfo}>
            <Typography className={classes.ticketTypeTitle}>ODC CHILD</Typography>
            <Typography className={classes.ticketPriceText}>LKR {formatPrice(childPrice)}</Typography>
          </Box>
          <Box className={classes.counterContainer}>
            <IconButton 
              className={classes.iconButton} 
              onClick={handleDecrementChild}
              disabled={childCount === 0}
            >
              <RemoveCircleOutlineIcon className={classes.counterIcon} />
            </IconButton>
            <Typography className={classes.counterValue}>{childCount}</Typography>
            <IconButton 
              className={classes.iconButton} 
              onClick={handleIncrementChild}
              disabled={childCount === totalTickets}
            >
              <AddCircleOutlineIcon className={classes.counterIcon} />
            </IconButton>
          </Box>
        </Box>

        <Box className={classes.proceedButtonWrapper}>
          <Button 
            className={classes.proceedButton}
            onClick={handleProceed}
            disabled={currentTotal !== totalTickets}
          >
            PROCEED
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
