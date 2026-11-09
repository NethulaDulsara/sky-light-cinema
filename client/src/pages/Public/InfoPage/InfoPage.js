import React, { useEffect, useState } from 'react';
import { useLocation, Link as RouterLink } from 'react-router-dom';
import { makeStyles, Typography, Button, Grid, Paper } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: { maxWidth: 1000, margin: '0 auto', padding: theme.spacing(16, 3, 12) },
  kicker: {
    textTransform: 'uppercase',
    letterSpacing: 3,
    fontWeight: 700,
    fontSize: '0.8rem',
    color: theme.palette.primary.main,
    marginBottom: theme.spacing(1.5)
  },
  h1: {
    fontSize: '2.6rem',
    fontWeight: 800,
    lineHeight: 1.1,
    marginBottom: theme.spacing(2)
  },
  lead: {
    fontSize: '1.15rem',
    lineHeight: 1.7,
    opacity: 0.9,
    maxWidth: 760,
    marginBottom: theme.spacing(5)
  },
  block: { marginBottom: theme.spacing(4) },
  h2: {
    fontSize: '1.45rem',
    fontWeight: 700,
    marginBottom: theme.spacing(1.5)
  },
  p: { lineHeight: 1.75, marginBottom: theme.spacing(2), opacity: 0.9 },
  card: {
    height: '100%',
    padding: theme.spacing(3),
    borderRadius: 14,
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    transition: 'transform .2s ease, box-shadow .2s ease, border-color .2s ease',
    '&:hover': {
      transform: 'translateY(-4px)',
      borderColor: 'rgba(0,198,255,0.4)',
      boxShadow: '0 12px 30px rgba(0,0,0,0.4)'
    }
  },
  cardTitle: {
    fontSize: '1.2rem',
    fontWeight: 700,
    marginBottom: theme.spacing(1)
  },
  cardBody: { opacity: 0.85, lineHeight: 1.6 },
  tag: {
    display: 'inline-block',
    padding: theme.spacing(0.5, 1.5),
    borderRadius: 999,
    fontWeight: 700,
    fontSize: '0.8rem',
    color: '#fff',
    background: 'linear-gradient(135deg, #00C6FF 0%, #0072FF 100%)',
    marginBottom: theme.spacing(2)
  },
  contactGrid: { marginTop: theme.spacing(1) },
  contactLabel: {
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontSize: '0.75rem',
    opacity: 0.6,
    marginBottom: theme.spacing(0.5)
  },
  contactValue: { fontSize: '1.05rem', fontWeight: 600 },
  ctaRow: { marginTop: theme.spacing(5), display: 'flex', gap: theme.spacing(2), flexWrap: 'wrap' }
}));

const CONTENT = {
  about: {
    kicker: 'Who we are',
    title: 'About Sky Light Cinema',
    lead:
      'Sky Light Cinema is a premium movie-going destination built around one idea — that watching a film should feel like an event. From crystal-clear projection to immersive sound, every screen is designed to put the story first.',
    blocks: [
      {
        h: 'Our story',
        p: [
          'Founded by a team of film lovers, Sky Light Cinema set out to bring world-class screening experiences to audiences across the country. Today we operate multiple screens offering Standard, 3D, IMAX and 4DX formats.',
          'We believe great cinema is for everyone, which is why we keep booking simple, pricing transparent, and the popcorn flowing.'
        ]
      },
      {
        h: 'What we stand for',
        p: [
          'Comfort, clarity and convenience. Recliner seating, laser projection, Dolby-grade audio and a booking experience that takes less than a minute — on any device.'
        ]
      }
    ],
    cta: { label: 'Browse movies', to: '/movie/category/nowShowing' }
  },

  experiences: {
    kicker: 'Formats',
    title: 'Experiences',
    lead:
      'Choose how you want to watch. Every Sky Light format is calibrated for picture, sound and comfort — pick the one that fits the film.',
    cards: [
      { title: 'Standard 2D', body: 'Crisp laser projection and immersive surround sound in our comfortable recliner auditoriums.' },
      { title: '3D', body: 'Depth that pulls you into the frame, with bright, flicker-free 3D projection and premium glasses.' },
      { title: 'IMAX', body: 'A floor-to-ceiling screen, dual-projector brightness and precision 12-channel sound for the biggest blockbusters.' },
      { title: '4DX', body: 'Motion seats and in-theatre effects — wind, water and rumble — synced to the action on screen.' }
    ],
    cta: { label: 'See showtimes', to: '/movie/category/nowShowing' }
  },

  offers: {
    kicker: 'Deals',
    title: 'Offers & Giveaways',
    lead:
      'Save more on the movies you love. Here are the promotions running right now at Sky Light Cinema.',
    cards: [
      { tag: '10% OFF', title: 'Slushies', body: 'Enjoy 10% off any slushie at the concessions counter when you show your booking.' },
      { tag: '20% OFF', title: 'Movie Tickets', body: '20% off standard tickets on selected weekday screenings. Applied automatically at checkout.' },
      { tag: 'BOGO', title: 'IMAX — Buy One Get One Free', body: 'Buy one IMAX ticket and get a second free for the same screening. While stocks last.' }
    ],
    blocks: [
      {
        h: 'How to redeem',
        p: [
          'Most offers are applied automatically during booking. For concession deals, simply present your e-ticket at the counter. Offers cannot be combined and are subject to availability.'
        ]
      }
    ],
    cta: { label: 'Book now', to: '/movie/category/nowShowing' }
  },

  privilege: {
    kicker: 'Membership',
    title: 'Sky Light Privilege',
    lead:
      'Our free loyalty programme rewards you every time you watch. Earn points on every booking and unlock perks as you go.',
    cards: [
      { title: 'Silver', body: 'Earn 1 point per ticket, birthday treats and early access to selected pre-sales.' },
      { title: 'Gold', body: 'Everything in Silver plus bonus points, free upgrades and priority seating on new releases.' },
      { title: 'Platinum', body: 'Our top tier — complimentary tickets, concession vouchers and exclusive premiere invitations.' }
    ],
    blocks: [
      {
        h: 'How it works',
        p: [
          'Create a free account, book your tickets while signed in, and points are added automatically. Redeem points for tickets and concessions at any time from your dashboard.'
        ]
      }
    ],
    cta: { label: 'Create a free account', to: '/register' }
  },

  careers: {
    kicker: 'Join us',
    title: 'Careers at Sky Light',
    lead:
      'We are always looking for people who are as passionate about the movies as our guests are. Come build the future of cinema with us.',
    cards: [
      { title: 'Guest Experience', body: 'Front-of-house, box office and concessions roles — the friendly faces of Sky Light.' },
      { title: 'Projection & Tech', body: 'Keep our IMAX, 4DX and laser screens running flawlessly, show after show.' },
      { title: 'Corporate & Marketing', body: 'Programming, partnerships, design and the digital team behind this very site.' }
    ],
    blocks: [
      {
        h: 'How to apply',
        p: [
          'Send your CV and the role you are interested in to careers@skylightcinema.com. We review every application and will be in touch if there is a fit.'
        ]
      }
    ],
    cta: { label: 'Email us your CV', to: 'mailto:careers@skylightcinema.com', external: true }
  },

  advertise: {
    kicker: 'Partnerships',
    title: 'Advertise With Us',
    lead:
      'Reach an engaged, captive audience on the big screen and across our digital channels. Sky Light Cinema offers flexible advertising packages for brands of every size.',
    cards: [
      { title: 'On-screen', body: 'Premium pre-show slots in front of the biggest releases, in up to 4K across all formats.' },
      { title: 'In-cinema', body: 'Foyer standees, digital signage, sampling activations and branded concession partnerships.' },
      { title: 'Digital', body: 'Banner placements and featured promotions across our website and booking flow.' }
    ],
    blocks: [
      {
        h: 'Get a media pack',
        p: [
          'Tell us about your campaign and we will put together a tailored proposal. Contact advertise@skylightcinema.com to get started.'
        ]
      }
    ],
    cta: { label: 'Request a media pack', to: 'mailto:advertise@skylightcinema.com', external: true }
  },

  contact: {
    kicker: 'Get in touch',
    title: 'Contact Us',
    lead:
      'Questions about a booking, an event, or anything else? Our guest services team is here to help.',
    contact: [
      { label: 'General enquiries', value: 'hello@skylightcinema.com' },
      { label: 'Bookings & refunds', value: 'support@skylightcinema.com' },
      { label: 'Phone', value: '+94 11 234 5678' },
      { label: 'Box office hours', value: 'Daily, 9:00 AM – 11:00 PM' },
      { label: 'Head office', value: 'No. 1 Galle Road, Colombo 03, Sri Lanka' }
    ],
    blocks: [
      {
        h: 'Need help with a booking?',
        p: [
          'If you are signed in, you can view, cancel or request a refund for any booking from your dashboard. For anything else, email us and we will respond within one business day.'
        ]
      }
    ],
    cta: { label: 'Go to my dashboard', to: '/mydashboard' }
  }
};

function InfoPage() {
  const classes = useStyles();
  const location = useLocation();
  const slug = location.pathname.replace(/^\//, '').toLowerCase();
  const [liveOffers, setLiveOffers] = useState(null);

  // The Offers page is driven by backend settings so admins can manage it.
  useEffect(() => {
    if (slug !== 'offers') return;
    let active = true;
    fetch('/settings')
      .then(res => res.json())
      .then(d => {
        if (!active) return;
        const list = (d.offers || []).filter(o => o.enabled !== false);
        if (list.length) {
          setLiveOffers(
            list.map(o => ({
              tag: o.badge,
              title: o.title,
              body: o.description
            }))
          );
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [slug]);

  let data = CONTENT[slug];
  if (data && slug === 'offers' && liveOffers) {
    data = { ...data, cards: liveOffers };
  }

  if (!data) {
    return (
      <main className={classes.root}>
        <Typography className={classes.h1} variant="h1">
          Page not found
        </Typography>
        <Button
          variant="contained"
          color="primary"
          component={RouterLink}
          to="/">
          Back to home
        </Button>
      </main>
    );
  }

  return (
    <main className={classes.root}>
      {data.kicker && (
        <Typography className={classes.kicker}>{data.kicker}</Typography>
      )}
      <Typography className={classes.h1} variant="h1" component="h1">
        {data.title}
      </Typography>
      {data.lead && (
        <Typography className={classes.lead}>{data.lead}</Typography>
      )}

      {data.cards && (
        <Grid container spacing={3} style={{ marginBottom: 16 }}>
          {data.cards.map((c, i) => (
            <Grid item xs={12} sm={6} md={data.cards.length === 4 ? 3 : 4} key={i}>
              <Paper className={classes.card} elevation={0}>
                {c.tag && <span className={classes.tag}>{c.tag}</span>}
                <Typography className={classes.cardTitle}>{c.title}</Typography>
                <Typography className={classes.cardBody}>{c.body}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      {data.contact && (
        <Grid container spacing={3} className={classes.contactGrid}>
          {data.contact.map((c, i) => (
            <Grid item xs={12} sm={6} key={i}>
              <Paper className={classes.card} elevation={0}>
                <Typography className={classes.contactLabel}>
                  {c.label}
                </Typography>
                <Typography className={classes.contactValue}>
                  {c.value}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      {data.blocks &&
        data.blocks.map((b, i) => (
          <div className={classes.block} key={i} style={{ marginTop: i === 0 ? 40 : 0 }}>
            <Typography className={classes.h2}>{b.h}</Typography>
            {b.p.map((para, j) => (
              <Typography className={classes.p} key={j}>
                {para}
              </Typography>
            ))}
          </div>
        ))}

      {data.cta && (
        <div className={classes.ctaRow}>
          {data.cta.external ? (
            <Button
              variant="contained"
              color="primary"
              size="large"
              href={data.cta.to}>
              {data.cta.label}
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              size="large"
              component={RouterLink}
              to={data.cta.to}>
              {data.cta.label}
            </Button>
          )}
        </div>
      )}
    </main>
  );
}

export default InfoPage;
