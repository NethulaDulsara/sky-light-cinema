import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { Bar } from 'react-chartjs-2';
import { makeStyles } from '@material-ui/core/styles';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Divider,
  Button
} from '@material-ui/core';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import palette from '../../../../../theme/palette';
import { options } from './chart';

const useStyles = makeStyles(() => ({
  root: {
    background: 'rgba(255, 255, 255, 0.03)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    borderRadius: '16px',
    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
    color: 'rgba(255, 255, 255, 0.8)'
  },
  chartContainer: {
    height: 400,
    position: 'relative'
  },
  actions: {
    justifyContent: 'flex-end'
  },
  cardHeader: {
    '& span': {
      color: '#fff',
      fontWeight: 700
    }
  }
}));

const BestMovies = props => {
  const { className, bestMovies } = props;
  const classes = useStyles();

  const data = {
    labels: bestMovies.map(movie => movie.movie.title.toUpperCase()),
    datasets: [
      {
        label: 'This year',
        backgroundColor: 'rgba(0, 198, 255, 0.7)',
        hoverBackgroundColor: 'rgba(0, 198, 255, 1)',
        data: bestMovies.map(movie => movie.count)
      },
      {
        label: 'Last year',
        backgroundColor: 'rgba(255, 107, 107, 0.5)',
        hoverBackgroundColor: 'rgba(255, 107, 107, 0.9)',
        data: [11, 20, 12, 29, 30]
      }
    ]
  };

  return (
    <Card className={classnames(classes.root, className)}>
      <CardHeader
        className={classes.cardHeader}
        action={
          <Button size="small" variant="text" style={{ color: '#fff' }}>
            Best 5<ArrowDropDownIcon />
          </Button>
        }
        title="Best Movies"
      />
      <Divider style={{ backgroundColor: 'rgba(255,255,255,0.1)' }} />
      <CardContent>
        <div className={classes.chartContainer}>
          <Bar data={data} options={options} />
        </div>
      </CardContent>
      <Divider style={{ backgroundColor: 'rgba(255,255,255,0.1)' }} />
      <CardActions className={classes.actions}>
        <Button size="small" variant="text" style={{ color: '#00C6FF' }}>
          Overview <ArrowRightIcon />
        </Button>
      </CardActions>
    </Card>
  );
};

BestMovies.propTypes = {
  className: PropTypes.string
};

export default BestMovies;
