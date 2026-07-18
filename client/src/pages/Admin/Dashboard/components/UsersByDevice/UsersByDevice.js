import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import {
  Card,
  CardHeader,
  CardContent,
  IconButton,
  Divider,
  Typography
} from '@material-ui/core';
import LaptopMacIcon from '@material-ui/icons/LaptopMac';
import PhoneIphoneIcon from '@material-ui/icons/PhoneIphone';
import RefreshIcon from '@material-ui/icons/Refresh';
import TabletMacIcon from '@material-ui/icons/TabletMac';

const useStyles = makeStyles(theme => ({
  root: {
    height: '100%',
    background: 'rgba(255, 255, 255, 0.03)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    borderRadius: '16px',
    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
    color: 'rgba(255, 255, 255, 0.8)'
  },
  chartContainer: {
    position: 'relative',
    height: '300px'
  },
  stats: {
    marginTop: theme.spacing(2),
    display: 'flex',
    justifyContent: 'center'
  },
  device: {
    textAlign: 'center',
    padding: theme.spacing(1)
  },
  deviceIcon: {
    color: 'rgba(255, 255, 255, 0.7)'
  },
  cardHeader: {
    '& span': {
      color: '#fff',
      fontWeight: 700
    }
  }
}));

const UsersByDevice = props => {
  const { className, ...rest } = props;

  const classes = useStyles();
  const theme = useTheme();

  const data = {
    datasets: [
      {
        data: [63, 15, 22],
        backgroundColor: [
          '#00C6FF',
          '#FF416C',
          '#F9D423'
        ],
        borderWidth: 0,
        hoverBorderColor: 'transparent'
      }
    ],
    labels: ['Desktop', 'Tablet', 'Mobile']
  };

  const options = {
    legend: {
      display: false
    },
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    cutoutPercentage: 80,
    layout: { padding: 0 },
    tooltips: {
      enabled: true,
      mode: 'index',
      intersect: false,
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.1)',
      backgroundColor: 'rgba(0,0,0,0.8)',
      titleFontColor: '#fff',
      bodyFontColor: 'rgba(255,255,255,0.7)',
      footerFontColor: 'rgba(255,255,255,0.7)'
    }
  };

  const devices = [
    {
      title: 'Desktop',
      value: '63',
      icon: <LaptopMacIcon />,
      color: '#00C6FF'
    },
    {
      title: 'Tablet',
      value: '15',
      icon: <TabletMacIcon />,
      color: '#FF416C'
    },
    {
      title: 'Mobile',
      value: '23',
      icon: <PhoneIphoneIcon />,
      color: '#F9D423'
    }
  ];

  return (
    <Card {...rest} className={classnames(classes.root, className)}>
      <CardHeader
        className={classes.cardHeader}
        action={
          <IconButton size="small" style={{ color: 'rgba(255,255,255,0.7)' }}>
            <RefreshIcon />
          </IconButton>
        }
        title="Users By Device"
      />
      <Divider style={{ backgroundColor: 'rgba(255,255,255,0.1)' }} />
      <CardContent>
        <div className={classes.chartContainer}>
          <Doughnut data={data} options={options} />
        </div>
        <div className={classes.stats}>
          {devices.map(device => (
            <div className={classes.device} key={device.title}>
              <span className={classes.deviceIcon}>{device.icon}</span>
              <Typography variant="body1">{device.title}</Typography>
              <Typography style={{ color: device.color }} variant="h2">
                {device.value}%
              </Typography>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

UsersByDevice.propTypes = {
  className: PropTypes.string
};

export default UsersByDevice;
