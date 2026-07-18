import React from 'react';
import { Divider, Typography, Link } from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';
import useStyles from './styles';

export default function Footer() {
  const classes = useStyles();
  
  const navLinks = [
    'HOME', 'ABOUT US', 'MOVIES', 'EXPERIENCES', 'CINEMAS', 
    'OFFERS & GIVEAWAYS', 'PRIVILEGE', 'CAREERS', 'ADVERTISE', 'CONTACT US'
  ];

  const bottomLinks = [
    'Disclaimer', 'Privacy Policy', 'Terms & Conditions'
  ];

  return (
    <div className={classes.root}>
      <Typography variant="body1" className={classes.appText}>
        Find us on App Store and Google Play Store
      </Typography>
      <div className={classes.appBadges}>
        <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="App Store" />
        <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Google Play" />
      </div>

      <Divider className={classes.divider} />

      <div className={classes.navContainer}>
        {navLinks.map((link, index) => (
          <Link 
            key={index} 
            component={RouterLink} 
            to="/" 
            className={classes.navLink}
            underline="none"
          >
            {link}
          </Link>
        ))}
      </div>

      <div className={classes.bottomBar}>
        <Typography variant="caption">
          &copy;{new Date().getFullYear()} Sky Light Cinema All Rights Reserved.
        </Typography>
        {bottomLinks.map((link, index) => (
          <Link key={index} href="#" className={classes.bottomLink} underline="none">
            {link}
          </Link>
        ))}
        <Typography variant="caption">
          Designed and Developed by Antigravity.
        </Typography>
      </div>
    </div>
  );
}
