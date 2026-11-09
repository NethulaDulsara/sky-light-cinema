import React, { useEffect, useState } from 'react';
import { Typography, Button } from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';
import Slider from 'react-slick';
import useStyles from './styles';

const Offers = () => {
  const classes = useStyles();
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    let active = true;
    fetch('/settings')
      .then(res => res.json())
      .then(data => {
        if (!active) return;
        const list = (data.offers || []).filter(o => o.enabled !== false);
        setOffers(list);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  if (!offers.length) return null;

  const settings = {
    dots: false,
    infinite: offers.length > 3,
    speed: 500,
    slidesToShow: Math.min(3, offers.length),
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: Math.min(2, offers.length) } },
      { breakpoint: 600, settings: { slidesToShow: 1 } }
    ]
  };

  return (
    <div className={classes.container}>
      <Typography variant="h4" className={classes.header}>
        Offers &amp; Giveaways
      </Typography>
      <div className={classes.sliderContainer}>
        <Slider {...settings}>
          {offers.map((offer, index) => (
            <div key={index}>
              <div className={classes.offerCard}>
                <div
                  className={classes.imagePlaceholder}
                  style={{ backgroundImage: `url(${offer.image})` }}
                >
                  {offer.badge ? (
                    <span className={classes.badge}>{offer.badge}</span>
                  ) : null}
                  <Typography variant="h5" className={classes.offerText}>
                    {offer.title}
                  </Typography>
                </div>
                {offer.description ? (
                  <div className={classes.offerBody}>
                    <Typography className={classes.offerDescription}>
                      {offer.description}
                    </Typography>
                  </div>
                ) : null}
                <Button
                  variant="contained"
                  className={classes.exploreButton}
                  component={RouterLink}
                  to={offer.ctaLink || '/movie/category/nowShowing'}
                >
                  {offer.ctaLabel || 'Explore More'}
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
