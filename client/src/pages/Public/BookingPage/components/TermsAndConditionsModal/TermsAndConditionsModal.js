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
    backgroundColor: '#fff',
    color: '#000',
    borderRadius: '16px',
    padding: theme.spacing(3),
    maxWidth: '800px',
    width: '100%',
    fontFamily: '"Montserrat", sans-serif'
  },
  headerTitle: {
    fontSize: '20px',
    fontWeight: 400,
    letterSpacing: '0.5px',
    textAlign: 'center',
    marginTop: theme.spacing(1),
    color: '#000',
    textTransform: 'uppercase'
  },
  subtitle: {
    fontSize: '14px',
    textAlign: 'center',
    color: '#000',
    marginBottom: theme.spacing(3),
    marginTop: theme.spacing(2),
    fontWeight: 600
  },
  list: {
    paddingLeft: theme.spacing(2)
  },
  listItem: {
    display: 'list-item',
    listStyleType: 'disc',
    fontSize: '13px',
    color: '#000',
    marginBottom: theme.spacing(2),
    paddingLeft: 0,
    paddingTop: 0,
    paddingBottom: 0,
    lineHeight: 1.5
  },
  linkText: {
    fontSize: '12px',
    color: '#000',
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(3)
  },
  linkHref: {
    color: '#d32f2f',
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline'
    }
  },
  agreeButtonWrapper: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1)
  },
  agreeButton: {
    backgroundColor: '#39338b',
    color: '#fff',
    padding: '12px 64px',
    fontWeight: 600,
    fontSize: '14px',
    borderRadius: '4px',
    textTransform: 'uppercase',
    '&:hover': {
      backgroundColor: '#2a2569'
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
