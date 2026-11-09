import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import PointOfSaleIcon from '@material-ui/icons/ShoppingCartOutlined';
import ReceiptIcon from '@material-ui/icons/ReceiptOutlined';

import POSNewSale from './components/POSNewSale';
import POSBookings from './components/POSBookings';

const useStyles = makeStyles(theme => ({
  tabs: { display: 'flex', gap: theme.spacing(1.5), marginBottom: theme.spacing(3) },
  tab: {
    textTransform: 'none',
    fontWeight: 700,
    borderRadius: 10,
    padding: theme.spacing(1, 2.5),
    color: '#94a3b8',
    border: '1px solid rgba(255,255,255,0.1)'
  },
  tabActive: {
    color: '#fff',
    background: 'linear-gradient(135deg, #00C6FF 0%, #0072FF 100%)',
    border: '1px solid transparent'
  }
}));

export default function POSPage() {
  const classes = useStyles();
  const [tab, setTab] = useState('sale');

  return (
    <div>
      <div className={classes.tabs}>
        <Button
          className={`${classes.tab} ${tab === 'sale' ? classes.tabActive : ''}`}
          startIcon={<PointOfSaleIcon />}
          onClick={() => setTab('sale')}>
          New sale
        </Button>
        <Button
          className={`${classes.tab} ${tab === 'bookings' ? classes.tabActive : ''}`}
          startIcon={<ReceiptIcon />}
          onClick={() => setTab('bookings')}>
          Bookings
        </Button>
      </div>

      {tab === 'sale' ? <POSNewSale /> : <POSBookings />}
    </div>
  );
}
