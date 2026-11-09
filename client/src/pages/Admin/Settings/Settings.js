import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  withStyles,
  Typography,
  TextField,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Checkbox,
  CircularProgress
} from '@material-ui/core';
import { setAlert } from '../../../store/actions';

const styles = theme => ({
  root: { padding: theme.spacing(4), color: theme.palette.common.white, minHeight: '100vh' },
  title: { fontWeight: 800, marginBottom: theme.spacing(3) },
  card: {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 12,
    padding: theme.spacing(3),
    marginBottom: theme.spacing(4)
  },
  sectionTitle: { fontWeight: 700, marginBottom: theme.spacing(2) },
  field: { marginRight: theme.spacing(2), marginBottom: theme.spacing(2), width: 200 },
  cell: { color: '#fff' },
  input: { color: '#fff' },
  offerRow: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: theme.spacing(2),
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
    borderRadius: 10,
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)'
  },
  offerField: { width: 220 },
  offerFieldWide: { width: 320, flexGrow: 1 },
  offerPreview: {
    width: 60,
    height: 60,
    borderRadius: 8,
    objectFit: 'cover',
    backgroundColor: '#1a1a3a'
  },
  heroList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
    gap: theme.spacing(1),
    maxHeight: 340,
    overflowY: 'auto',
    paddingRight: theme.spacing(1)
  },
  heroItem: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    padding: theme.spacing(0.5, 1),
    borderRadius: 8,
    border: '1px solid rgba(255,255,255,0.06)',
    cursor: 'pointer',
    textTransform: 'capitalize'
  },
  heroItemActive: {
    border: '1px solid rgba(0,198,255,0.5)',
    background: 'rgba(0,198,255,0.08)'
  }
});

const PERCENT_FIELDS = [
  ['convenienceFeeRate', 'Convenience Fee %'],
  ['vatRate', 'VAT %'],
  ['weekendSurcharge', 'Weekend Surcharge %'],
  ['peakSurcharge', 'Peak Surcharge %']
];

class Settings extends Component {
  state = { settings: null, movies: [], loading: true, saving: false };

  async componentDidMount() {
    try {
      const [sRes, mRes] = await Promise.all([
        fetch('/settings'),
        fetch('/movies')
      ]);
      const settings = await sRes.json();
      const movies = mRes.ok ? await mRes.json() : [];
      this.setState({ settings, movies, loading: false });
    } catch (e) {
      this.setState({ loading: false });
      this.props.setAlert('Failed to load settings', 'error', 5000);
    }
  }

  toggleHeroMovie = id =>
    this.setState(s => {
      const current = s.settings.heroMovieIds || [];
      const heroMovieIds = current.includes(id)
        ? current.filter(x => x !== id)
        : [...current, id];
      return { settings: { ...s.settings, heroMovieIds } };
    });

  setField = (key, value) =>
    this.setState(s => ({ settings: { ...s.settings, [key]: value } }));

  setFormat = (index, key, value) =>
    this.setState(s => {
      const formats = s.settings.formats.map((f, i) =>
        i === index ? { ...f, [key]: value } : f
      );
      return { settings: { ...s.settings, formats } };
    });

  setOffer = (index, key, value) =>
    this.setState(s => {
      const offers = (s.settings.offers || []).map((o, i) =>
        i === index ? { ...o, [key]: value } : o
      );
      return { settings: { ...s.settings, offers } };
    });

  addOffer = () =>
    this.setState(s => ({
      settings: {
        ...s.settings,
        offers: [
          ...(s.settings.offers || []),
          {
            title: 'New Offer',
            description: '',
            badge: '',
            image: '',
            ctaLabel: 'Explore More',
            ctaLink: '/movie/category/nowShowing',
            enabled: true
          }
        ]
      }
    }));

  removeOffer = index =>
    this.setState(s => ({
      settings: {
        ...s.settings,
        offers: (s.settings.offers || []).filter((o, i) => i !== index)
      }
    }));

  save = async () => {
    const { settings } = this.state;
    this.setState({ saving: true });
    try {
      const token = localStorage.getItem('jwtToken');
      const res = await fetch('/settings', {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          formats: settings.formats,
          convenienceFeeRate: Number(settings.convenienceFeeRate),
          vatRate: Number(settings.vatRate),
          weekendSurcharge: Number(settings.weekendSurcharge),
          peakSurcharge: Number(settings.peakSurcharge),
          peakStartHour: Number(settings.peakStartHour),
          peakEndHour: Number(settings.peakEndHour),
          refundWindowHours: Number(settings.refundWindowHours),
          offers: settings.offers || [],
          heroMovieIds: settings.heroMovieIds || []
        })
      });
      if (res.ok) {
        this.props.setAlert('Settings saved', 'success', 4000);
      } else {
        const d = await res.json().catch(() => ({}));
        this.props.setAlert(d.error || 'Save failed', 'error', 5000);
      }
    } catch (e) {
      this.props.setAlert(e.message, 'error', 5000);
    } finally {
      this.setState({ saving: false });
    }
  };

  render() {
    const { classes } = this.props;
    const { settings, movies, loading, saving } = this.state;

    if (loading) return <div className={classes.root}><CircularProgress /></div>;
    if (!settings) return <div className={classes.root}><Typography>Could not load settings.</Typography></div>;

    const heroIds = settings.heroMovieIds || [];

    return (
      <div className={classes.root}>
        <Typography variant="h4" className={classes.title}>
          Pricing & Policy Settings
        </Typography>

        <div className={classes.card}>
          <Typography variant="h6" className={classes.sectionTitle}>
            Homepage Hero
          </Typography>
          <Typography variant="body2" style={{ opacity: 0.7, marginBottom: 16 }}>
            Choose which movies appear in the big homepage slider. Leave all
            unchecked to show every movie. {heroIds.length} selected.
          </Typography>
          <div className={classes.heroList}>
            {movies.map(m => {
              const active = heroIds.includes(m._id);
              return (
                <div
                  key={m._id}
                  className={`${classes.heroItem} ${active ? classes.heroItemActive : ''}`}
                  onClick={() => this.toggleHeroMovie(m._id)}>
                  <Checkbox
                    checked={active}
                    style={{ color: '#fff', padding: 4 }}
                    onChange={() => this.toggleHeroMovie(m._id)}
                  />
                  <span>{m.title}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className={classes.card}>
          <Typography variant="h6" className={classes.sectionTitle}>Screen Formats</Typography>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell className={classes.cell}>Format</TableCell>
                <TableCell className={classes.cell}>Price Multiplier</TableCell>
                <TableCell className={classes.cell}>Enabled</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {settings.formats.map((f, i) => (
                <TableRow key={i}>
                  <TableCell className={classes.cell}>
                    <TextField
                      value={f.name}
                      InputProps={{ className: classes.input }}
                      onChange={e => this.setFormat(i, 'name', e.target.value)}
                    />
                  </TableCell>
                  <TableCell className={classes.cell}>
                    <TextField
                      type="number"
                      inputProps={{ step: 0.05, min: 0 }}
                      value={f.priceMultiplier}
                      InputProps={{ className: classes.input }}
                      onChange={e => this.setFormat(i, 'priceMultiplier', Number(e.target.value))}
                    />
                  </TableCell>
                  <TableCell className={classes.cell}>
                    <Checkbox
                      checked={f.enabled}
                      onChange={e => this.setFormat(i, 'enabled', e.target.checked)}
                      style={{ color: '#fff' }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className={classes.card}>
          <Typography variant="h6" className={classes.sectionTitle}>Fees, Taxes & Dynamic Pricing</Typography>
          <Typography variant="body2" style={{ opacity: 0.7, marginBottom: 16 }}>
            Rates are fractions (e.g. 0.18 = 18%).
          </Typography>
          {PERCENT_FIELDS.map(([key, label]) => (
            <TextField
              key={key}
              className={classes.field}
              label={label}
              type="number"
              inputProps={{ step: 0.01, min: 0 }}
              value={settings[key]}
              InputProps={{ className: classes.input }}
              InputLabelProps={{ style: { color: '#aaa' } }}
              onChange={e => this.setField(key, e.target.value)}
            />
          ))}
          <TextField
            className={classes.field}
            label="Peak Start Hour (0-23)"
            type="number"
            inputProps={{ min: 0, max: 23 }}
            value={settings.peakStartHour}
            InputProps={{ className: classes.input }}
            InputLabelProps={{ style: { color: '#aaa' } }}
            onChange={e => this.setField('peakStartHour', e.target.value)}
          />
          <TextField
            className={classes.field}
            label="Peak End Hour (0-23)"
            type="number"
            inputProps={{ min: 0, max: 23 }}
            value={settings.peakEndHour}
            InputProps={{ className: classes.input }}
            InputLabelProps={{ style: { color: '#aaa' } }}
            onChange={e => this.setField('peakEndHour', e.target.value)}
          />
        </div>

        <div className={classes.card}>
          <Typography variant="h6" className={classes.sectionTitle}>Refund Policy</Typography>
          <TextField
            className={classes.field}
            label="Refund Window (hours)"
            type="number"
            inputProps={{ min: 0 }}
            helperText="Full refund if cancelled this many hours before showtime"
            value={settings.refundWindowHours}
            InputProps={{ className: classes.input }}
            InputLabelProps={{ style: { color: '#aaa' } }}
            onChange={e => this.setField('refundWindowHours', e.target.value)}
          />
        </div>

        <div className={classes.card}>
          <Typography variant="h6" className={classes.sectionTitle}>
            Offers &amp; Giveaways
          </Typography>
          <Typography variant="body2" style={{ opacity: 0.7, marginBottom: 16 }}>
            These appear in the homepage carousel and on the Offers page. Disable
            an offer to hide it without deleting it.
          </Typography>

          {(settings.offers || []).map((o, i) => (
            <div className={classes.offerRow} key={i}>
              {o.image ? (
                <img src={o.image} alt="" className={classes.offerPreview} />
              ) : (
                <div className={classes.offerPreview} />
              )}
              <TextField
                className={classes.offerField}
                label="Title"
                value={o.title || ''}
                InputProps={{ className: classes.input }}
                InputLabelProps={{ style: { color: '#aaa' } }}
                onChange={e => this.setOffer(i, 'title', e.target.value)}
              />
              <TextField
                className={classes.offerField}
                label="Badge (e.g. 20% OFF)"
                value={o.badge || ''}
                InputProps={{ className: classes.input }}
                InputLabelProps={{ style: { color: '#aaa' } }}
                onChange={e => this.setOffer(i, 'badge', e.target.value)}
              />
              <TextField
                className={classes.offerFieldWide}
                label="Description"
                value={o.description || ''}
                InputProps={{ className: classes.input }}
                InputLabelProps={{ style: { color: '#aaa' } }}
                onChange={e => this.setOffer(i, 'description', e.target.value)}
              />
              <TextField
                className={classes.offerFieldWide}
                label="Image URL"
                value={o.image || ''}
                InputProps={{ className: classes.input }}
                InputLabelProps={{ style: { color: '#aaa' } }}
                onChange={e => this.setOffer(i, 'image', e.target.value)}
              />
              <TextField
                className={classes.offerField}
                label="Button Label"
                value={o.ctaLabel || ''}
                InputProps={{ className: classes.input }}
                InputLabelProps={{ style: { color: '#aaa' } }}
                onChange={e => this.setOffer(i, 'ctaLabel', e.target.value)}
              />
              <TextField
                className={classes.offerField}
                label="Button Link"
                value={o.ctaLink || ''}
                InputProps={{ className: classes.input }}
                InputLabelProps={{ style: { color: '#aaa' } }}
                onChange={e => this.setOffer(i, 'ctaLink', e.target.value)}
              />
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Checkbox
                  checked={o.enabled !== false}
                  onChange={e => this.setOffer(i, 'enabled', e.target.checked)}
                  style={{ color: '#fff' }}
                />
                <Typography variant="body2">Enabled</Typography>
              </div>
              <Button
                size="small"
                onClick={() => this.removeOffer(i)}
                style={{ color: '#ff6b6b' }}>
                Remove
              </Button>
            </div>
          ))}

          <Button variant="outlined" onClick={this.addOffer} style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.3)' }}>
            + Add Offer
          </Button>
        </div>

        <Button
          variant="contained"
          color="primary"
          disabled={saving}
          onClick={this.save}>
          {saving ? 'Saving…' : 'Save Settings'}
        </Button>
      </div>
    );
  }
}

const mapDispatchToProps = { setAlert };

export default connect(null, mapDispatchToProps)(withStyles(styles)(Settings));
