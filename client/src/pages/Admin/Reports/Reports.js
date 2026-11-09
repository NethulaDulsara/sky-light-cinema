import React, { Component } from 'react';
import {
  withStyles,
  Typography,
  Button,
  CircularProgress,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell
} from '@material-ui/core';
import GetAppIcon from '@material-ui/icons/GetApp';

const styles = theme => ({
  root: { padding: theme.spacing(4), color: '#fff', minHeight: '100vh' },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: theme.spacing(2),
    marginBottom: theme.spacing(1)
  },
  title: { fontWeight: 800 },
  sub: { color: '#94a3b8', marginBottom: theme.spacing(4) },
  kpiRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: theme.spacing(2),
    marginBottom: theme.spacing(4)
  },
  kpi: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 12,
    padding: theme.spacing(2.5)
  },
  kpiLabel: {
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontSize: '0.72rem',
    color: '#94a3b8',
    marginBottom: 6
  },
  kpiValue: { fontSize: '1.7rem', fontWeight: 800 },
  card: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 12,
    padding: theme.spacing(3),
    marginBottom: theme.spacing(3)
  },
  cardHead: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(2)
  },
  cardTitle: { fontWeight: 700 },
  cell: { color: '#cbd5e1', borderColor: 'rgba(255,255,255,0.08)' },
  headCell: { color: '#fff', fontWeight: 700, borderColor: 'rgba(255,255,255,0.08)' },
  csvBtn: {
    color: '#00C6FF',
    borderColor: 'rgba(0,198,255,0.4)',
    textTransform: 'none'
  },
  exportBtn: {
    background: 'linear-gradient(135deg, #00C6FF 0%, #0072FF 100%)',
    color: '#fff',
    fontWeight: 700,
    textTransform: 'none'
  }
});

const money = n => 'Rs ' + Math.round(n || 0).toLocaleString();

const csvCell = v => {
  const s = v == null ? '' : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

const downloadCsv = (filename, headers, rows) => {
  const csv = [headers.join(','), ...rows.map(r => r.map(csvCell).join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

class Reports extends Component {
  state = { data: null, loading: true, exporting: false };

  async componentDidMount() {
    try {
      const token = localStorage.getItem('jwtToken');
      const res = await fetch('/analytics', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = res.ok ? await res.json() : null;
      this.setState({ data, loading: false });
    } catch (e) {
      this.setState({ loading: false });
    }
  }

  exportTransactions = async () => {
    this.setState({ exporting: true });
    try {
      const token = localStorage.getItem('jwtToken');
      const res = await fetch('/analytics/export', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `reservations-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      /* ignore */
    } finally {
      this.setState({ exporting: false });
    }
  };

  render() {
    const { classes } = this.props;
    const { data, loading, exporting } = this.state;

    if (loading) return <div className={classes.root}><CircularProgress /></div>;
    if (!data) return <div className={classes.root}><Typography>Could not load reports.</Typography></div>;

    const byFormat = Object.entries(data.byFormat || {}).map(([format, v]) => ({
      format,
      tickets: v.tickets,
      revenue: v.revenue
    }));

    return (
      <div className={classes.root}>
        <div className={classes.header}>
          <Typography variant="h4" className={classes.title}>
            Reports
          </Typography>
          <Button
            className={classes.exportBtn}
            variant="contained"
            startIcon={<GetAppIcon />}
            disabled={exporting}
            onClick={this.exportTransactions}>
            {exporting ? 'Exporting…' : 'Export all transactions (CSV)'}
          </Button>
        </div>
        <Typography className={classes.sub}>
          Based on paid bookings. Download any table as CSV.
        </Typography>

        <div className={classes.kpiRow}>
          <div className={classes.kpi}>
            <div className={classes.kpiLabel}>Total Revenue</div>
            <div className={classes.kpiValue}>{money(data.totalRevenue)}</div>
          </div>
          <div className={classes.kpi}>
            <div className={classes.kpiLabel}>Tickets Sold</div>
            <div className={classes.kpiValue}>{(data.ticketsSold || 0).toLocaleString()}</div>
          </div>
          <div className={classes.kpi}>
            <div className={classes.kpiLabel}>Bookings</div>
            <div className={classes.kpiValue}>{(data.totalBookings || 0).toLocaleString()}</div>
          </div>
          <div className={classes.kpi}>
            <div className={classes.kpiLabel}>Avg Order Value</div>
            <div className={classes.kpiValue}>{money(data.avgOrderValue)}</div>
          </div>
          <div className={classes.kpi}>
            <div className={classes.kpiLabel}>Occupancy</div>
            <div className={classes.kpiValue}>{(data.occupancy || 0).toFixed(1)}%</div>
          </div>
        </div>

        {/* Revenue by day */}
        <div className={classes.card}>
          <div className={classes.cardHead}>
            <Typography variant="h6" className={classes.cardTitle}>
              Revenue by Day (last 14 days)
            </Typography>
            <Button
              size="small"
              variant="outlined"
              className={classes.csvBtn}
              startIcon={<GetAppIcon />}
              onClick={() =>
                downloadCsv(
                  'revenue-by-day.csv',
                  ['Date', 'Bookings', 'Revenue'],
                  (data.series || []).map(s => [s.date, s.bookings, s.revenue])
                )
              }>
              CSV
            </Button>
          </div>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell className={classes.headCell}>Date</TableCell>
                <TableCell className={classes.headCell}>Bookings</TableCell>
                <TableCell className={classes.headCell}>Revenue</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(data.series || []).map(s => (
                <TableRow key={s.date}>
                  <TableCell className={classes.cell}>{s.date}</TableCell>
                  <TableCell className={classes.cell}>{s.bookings}</TableCell>
                  <TableCell className={classes.cell}>{money(s.revenue)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* By movie */}
        <div className={classes.card}>
          <div className={classes.cardHead}>
            <Typography variant="h6" className={classes.cardTitle}>
              Top Movies
            </Typography>
            <Button
              size="small"
              variant="outlined"
              className={classes.csvBtn}
              startIcon={<GetAppIcon />}
              onClick={() =>
                downloadCsv(
                  'revenue-by-movie.csv',
                  ['Movie', 'Tickets', 'Revenue'],
                  (data.topMovies || []).map(m => [m.title, m.tickets, m.revenue])
                )
              }>
              CSV
            </Button>
          </div>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell className={classes.headCell}>Movie</TableCell>
                <TableCell className={classes.headCell}>Tickets</TableCell>
                <TableCell className={classes.headCell}>Revenue</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(data.topMovies || []).map(m => (
                <TableRow key={m.movieId}>
                  <TableCell className={classes.cell} style={{ textTransform: 'capitalize' }}>
                    {m.title}
                  </TableCell>
                  <TableCell className={classes.cell}>{m.tickets}</TableCell>
                  <TableCell className={classes.cell}>{money(m.revenue)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* By format */}
        <div className={classes.card}>
          <div className={classes.cardHead}>
            <Typography variant="h6" className={classes.cardTitle}>
              Revenue by Format
            </Typography>
            <Button
              size="small"
              variant="outlined"
              className={classes.csvBtn}
              startIcon={<GetAppIcon />}
              onClick={() =>
                downloadCsv(
                  'revenue-by-format.csv',
                  ['Format', 'Tickets', 'Revenue'],
                  byFormat.map(f => [f.format, f.tickets, f.revenue])
                )
              }>
              CSV
            </Button>
          </div>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell className={classes.headCell}>Format</TableCell>
                <TableCell className={classes.headCell}>Tickets</TableCell>
                <TableCell className={classes.headCell}>Revenue</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {byFormat.map(f => (
                <TableRow key={f.format}>
                  <TableCell className={classes.cell}>{f.format}</TableCell>
                  <TableCell className={classes.cell}>{f.tickets}</TableCell>
                  <TableCell className={classes.cell}>{money(f.revenue)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(Reports);
