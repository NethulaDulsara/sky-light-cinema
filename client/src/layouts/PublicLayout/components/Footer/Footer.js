import React from 'react';
import { Divider, Typography, Link } from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';
import useStyles from './styles';
import logo from '../../../../assets/logo.jpg';

export default function Footer() {
  const classes = useStyles();
  
  const navLinks = [
    { label: 'HOME', to: '/' },
    { label: 'ABOUT US', to: '/about' },
    { label: 'MOVIES', to: '/movie/category/nowShowing' },
    { label: 'EXPERIENCES', to: '/experiences' },
    { label: 'CINEMAS', to: '/cinemas' },
    { label: 'OFFERS & GIVEAWAYS', to: '/offers' },
    { label: 'PRIVILEGE', to: '/privilege' },
    { label: 'CAREERS', to: '/careers' },
    { label: 'ADVERTISE', to: '/advertise' },
    { label: 'CONTACT US', to: '/contact' }
  ];

  const bottomLinks = [
    { label: 'Disclaimer', to: '/disclaimer' },
    { label: 'Privacy Policy', to: '/privacy' },
    { label: 'Terms & Conditions', to: '/terms' }
  ];

  return (
    <div className={classes.root}>
      <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 24 }}>
        <img
          src={logo}
          alt="Sky Lights Cinema"
          style={{ width: 84, height: 84, borderRadius: 14, background: '#fff', objectFit: 'cover' }}
        />
      </div>

      <Divider className={classes.divider} />

      <div className={classes.navContainer}>
        {navLinks.map((link, index) => (
          <Link
            key={index}
            component={RouterLink}
            to={link.to}
            className={classes.navLink}
            underline="none"
          >
            {link.label}
          </Link>
        ))}
      </div>

      <div className={classes.bottomBar}>
        <Typography variant="caption">
          &copy;{new Date().getFullYear()} Sky Light Cinema All Rights Reserved.
        </Typography>
        {bottomLinks.map((link, index) => (
          <Link
            key={index}
            component={RouterLink}
            to={link.to}
            className={classes.bottomLink}
            underline="none">
            {link.label}
          </Link>
        ))}
        <Typography variant="caption">
          Designed and Developed by Antigravity.
        </Typography>
      </div>
    </div>
  );
}
