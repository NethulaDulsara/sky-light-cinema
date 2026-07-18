import React, { useState } from 'react';
import classnames from 'classnames';
import { Typography, Button } from '@material-ui/core';
import Slider from 'react-slick';
import useStyles from './styles';

const experiencesData = [
  {
    id: 'digital-2d',
    title: 'DIGITAL 2D',
    description: 'A clean, high-definition viewing experience. Digital 2D ensures sharp projection, accurate colours, and smooth playback—delivering films exactly as the creators intended, with modern digital precision.',
    image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80'
  },
  {
    id: 'digital-3d',
    title: 'DIGITAL 3D',
    description: 'Immerse yourself in the action with stunning, vibrant 3D visuals. Our Digital 3D technology brings movies to life with incredible depth and clarity.',
    image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80'
  },
  {
    id: 'imax',
    title: 'IMAX with Laser',
    description: 'Experience movies to the fullest. IMAX with Laser provides unparalleled brightness, contrast, and color, along with custom-designed sound for a truly massive experience.',
    image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80'
  },
  {
    id: 'dolby',
    title: 'Dolby Atmos',
    description: 'Feel every dimension. Dolby Atmos creates a powerful, moving audio experience by introducing two important concepts to cinema sound: audio objects and overhead speakers.',
    image: 'https://images.unsplash.com/photo-1616469829581-73993eb86b02?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80'
  }
];

const Experiences = () => {
  const classes = useStyles();
  const [activeExperience, setActiveExperience] = useState(experiencesData[0]);

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 600, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } }
    ]
  };

  return (
    <div
      className={classes.container}
      style={{ backgroundImage: `url(${activeExperience.image})` }}
    >
      <div className={classes.content}>
        <Typography variant="h6" className={classes.subtitle}>
          Experiences
        </Typography>
        <Typography variant="h1" className={classes.title}>
          {activeExperience.title}
        </Typography>
        <Typography variant="body1" className={classes.description}>
          {activeExperience.description}
        </Typography>
        <Button variant="outlined" className={classes.button}>
          KNOW MORE
        </Button>
      </div>

      <div className={classes.selectorContainer}>
        <Slider {...settings}>
          {experiencesData.map((exp) => (
            <div key={exp.id}>
              <div
                className={classnames(classes.selectorCard, {
                  [classes.activeCard]: activeExperience.id === exp.id
                })}
                onClick={() => setActiveExperience(exp)}
              >
                <Typography variant="h5" className={classes.cardTitle}>
                  {exp.title}
                </Typography>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default Experiences;
