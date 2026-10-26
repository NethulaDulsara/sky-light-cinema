import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Dialog,
  DialogContent,
  Typography,
  Button,
  Box,
  List,
  ListItem
} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  dialogPaper: {
    backgroundColor: '#0f1422 !important',
    background: 'linear-gradient(145deg, #161d31 0%, #0c101c 100%) !important',
    color: '#f8fafc',
    borderRadius: '20px',
    border: '1px solid rgba(0, 198, 255, 0.25)',
    boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 30px rgba(0, 198, 255, 0.12)',
    padding: theme.spacing(4),
    maxWidth: '750px',
    width: '100%',
    fontFamily: '"Montserrat", sans-serif'
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
    fontSize: '14px',
    textAlign: 'center',
    color: '#00C6FF',
    marginBottom: theme.spacing(3),
    marginTop: theme.spacing(1),
    fontWeight: 600,
    letterSpacing: '0.5px'
  },
  list: {
    paddingLeft: theme.spacing(2),
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: '12px',
    padding: theme.spacing(2, 3),
    border: '1px solid rgba(255, 255, 255, 0.06)'
  },
  listItem: {
    display: 'list-item',
    listStyleType: 'disc',
    fontSize: '13px',
    color: '#cbd5e1',
    marginBottom: theme.spacing(1.5),
    paddingLeft: 0,
    paddingTop: 0,
    paddingBottom: 0,
    lineHeight: 1.6
  },
  linkText: {
    fontSize: '12px',
    color: '#94a3b8',
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(2),
    textAlign: 'center'
  },
  linkHref: {
    color: '#00C6FF',
    textDecoration: 'none',
    fontWeight: 600,
    '&:hover': {
      textDecoration: 'underline',
      color: '#38bdf8'
    }
  },
  agreeButtonWrapper: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(1)
  },
  agreeButton: {
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
    }
  }
}));

export default function TermsAndConditionsModal({
  open,
  onClose,
  onAgree
}) {
  const classes = useStyles();

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      classes={{ paper: classes.dialogPaper }}
      maxWidth="md"
    >
      <DialogContent>
        <Typography className={classes.headerTitle}>SKY LIGHT CINEMA TERMS AND CONDITIONS</Typography>
        <Typography className={classes.subtitle}>
          Please read the terms and conditions below.
        </Typography>

        <List className={classes.list}>
          <ListItem className={classes.listItem}>
            The website is for personal use only. Do not use it for commercial purposes or in any way that is unlawful or harmful.
          </ListItem>
          <ListItem className={classes.listItem}>
            All payments are subject to the terms and conditions of each bank. We do not retain your payment details.
          </ListItem>
          <ListItem className={classes.listItem}>
            All sales are final. No cancellations, exchanges, or rebookings will be accepted.
          </ListItem>
          <ListItem className={classes.listItem}>
            Sky Light Cinemas reserves the right to not screen a movie due to unavoidable circumstances. In such cases, refunds will be made to valid ticket holders.
          </ListItem>
          <ListItem className={classes.listItem}>
            No food or beverage from outside is permitted at the cinema premises.
          </ListItem>
          <ListItem className={classes.listItem}>
            It is your responsibility to ensure that you carry the original booking receipt to the theater.
          </ListItem>
          <ListItem className={classes.listItem}>
            The laws of the Republic of Sri Lanka govern these terms and conditions.
          </ListItem>
        </List>

        <Typography className={classes.linkText}>
          Please read our full terms and conditions here: <a href="https://www.skylightcinemas.com/terms-and-conditions" target="_blank" rel="noopener noreferrer" className={classes.linkHref}>https://www.skylightcinemas.com/terms-and-conditions</a>
        </Typography>

        <Box className={classes.agreeButtonWrapper}>
          <Button 
            className={classes.agreeButton}
            onClick={onAgree}
          >
            AGREE
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
