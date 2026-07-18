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
    backgroundColor: '#fff',
    color: '#000',
    borderRadius: '16px',
    padding: theme.spacing(3),
    maxWidth: '450px',
    width: '100%',
    fontFamily: '"Montserrat", sans-serif'
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: '#fff',
    backgroundColor: '#111',
    padding: '4px',
    '&:hover': {
      backgroundColor: '#333'
    }
  },
  closeIcon: {
    fontSize: '18px'
  },
  headerTitle: {
    fontSize: '20px',
    fontWeight: 400,
    letterSpacing: '0.5px',
    textAlign: 'center',
    marginTop: theme.spacing(1),
    color: '#000'
  },
  subtitle: {
    fontSize: '10px',
    textAlign: 'center',
    color: '#888',
    marginBottom: theme.spacing(5),
    marginTop: theme.spacing(2)
  },
  ticketRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(3),
    padding: theme.spacing(0, 1)
  },
  ticketInfo: {
    display: 'flex',
    flexDirection: 'column'
  },
  ticketTypeTitle: {
    fontSize: '14px',
    fontWeight: 500,
    color: '#000'
  },
  ticketPriceText: {
    fontSize: '13px',
    color: '#444',
    marginTop: '4px'
  },
  counterContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  iconButton: {
    padding: 0,
    color: '#000',
    '&.Mui-disabled': {
      color: '#ccc'
    }
  },
  counterIcon: {
    fontSize: '32px'
  },
  counterValue: {
    fontSize: '22px',
    fontWeight: 700,
    color: '#d32f2f',
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
    backgroundColor: '#39338b',
    color: '#fff',
    padding: '12px 64px',
    fontWeight: 600,
    fontSize: '14px',
    borderRadius: '4px',
    textTransform: 'uppercase',
    '&:hover': {
      backgroundColor: '#2a2569'
    },
    '&.Mui-disabled': {
      backgroundColor: '#ccc',
      color: '#888'
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
