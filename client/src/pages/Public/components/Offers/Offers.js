import React from 'react';
import { Typography, Button } from '@material-ui/core';
import Slider from 'react-slick';
import useStyles from './styles';

const offersData = [
  {
    id: 1,
    title: 'ENJOY 10% OFF SLUSHIES',
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75bb8ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 2,
    title: '20% OFF ON MOVIE TICKETS',
    image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 3,
    title: 'BUY ONE GET ONE FREE ON IMAX TICKETS',
    image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 4,
    title: 'EARN 5% LOYALTY POINTS',
    image: 'https://images.unsplash.com/photo-1518623489648-a173ef7824f3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  }
];

const Offers = () => {
  const classes = useStyles();

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 600, settings: { slidesToShow: 1 } }
    ]
  };

  return (
    <div className={classes.container}>
      <Typography variant="h4" className={classes.header}>
        Offers & Giveaways
      </Typography>
      <div className={classes.sliderContainer}>
        <Slider {...settings}>
          {offersData.map((offer) => (
            <div key={offer.id}>
              <div className={classes.offerCard}>
                <div
                  className={classes.imagePlaceholder}
                  style={{ backgroundImage: `url(${offer.image})` }}
                >
                  <Typography variant="h5" className={classes.offerText}>
                    {offer.title}
                  </Typography>
                </div>
                <Button variant="contained" className={classes.exploreButton}>
                  EXPLORE MORE
                </Button>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default Offers;
