const express = require('express');
const auth = require('../middlewares/auth');
const Reservation = require('../models/reservation');
const Movie = require('../models/movie');
const Cinema = require('../models/cinema');

const router = new express.Router();

// Admin analytics derived from real reservation data.
router.get('/analytics', auth.enhance, async (req, res) => {
  try {
    const [paid, movies, cinemas] = await Promise.all([
      Reservation.find({ paymentStatus: 'paid' }),
      Movie.find({}).select('title'),
      Cinema.find({}).select('seatsAvailable seats'),
    ]);

    const movieTitle = {};
    movies.forEach(m => (movieTitle[m._id] = m.title));

    const seatsOf = r => (Array.isArray(r.seats) ? r.seats.length : 0);

    const totalRevenue = paid.reduce((s, r) => s + (r.total || 0), 0);
    const ticketsSold = paid.reduce((s, r) => s + seatsOf(r), 0);
    const totalBookings = paid.length;
    const avgOrderValue = totalBookings ? totalRevenue / totalBookings : 0;

    // Revenue + tickets by format
    const byFormat = {};
    paid.forEach(r => {
      const f = r.format || '2D';
      if (!byFormat[f]) byFormat[f] = { revenue: 0, tickets: 0 };
      byFormat[f].revenue += r.total || 0;
      byFormat[f].tickets += seatsOf(r);
    });

    // Top movies by tickets sold
    const byMovie = {};
    paid.forEach(r => {
      const id = String(r.movieId);
      if (!byMovie[id]) byMovie[id] = { tickets: 0, revenue: 0 };
      byMovie[id].tickets += seatsOf(r);
      byMovie[id].revenue += r.total || 0;
    });
    const topMovies = Object.entries(byMovie)
      .map(([id, v]) => ({ movieId: id, title: movieTitle[id] || 'Unknown', ...v }))
      .sort((a, b) => b.tickets - a.tickets)
      .slice(0, 8);

    // Bookings/revenue over the last 14 days (by creation date)
    const days = 14;
    const series = [];
    for (let i = days - 1; i >= 0; i--) {
      const day = new Date();
      day.setHours(0, 0, 0, 0);
      day.setDate(day.getDate() - i);
      const next = new Date(day);
      next.setDate(next.getDate() + 1);
      const dayRes = paid.filter(r => r.createdAt >= day && r.createdAt < next);
      series.push({
        date: day.toISOString().slice(0, 10),
        bookings: dayRes.length,
        revenue: dayRes.reduce((s, r) => s + (r.total || 0), 0),
      });
    }

    // Occupancy: sold vs. total installed seats across cinemas
    const totalSeats = cinemas.reduce((s, c) => {
      if (Array.isArray(c.seats)) {
        return s + c.seats.reduce((rs, row) => rs + (Array.isArray(row) ? row.length : 0), 0);
      }
      return s;
    }, 0);
    const occupancy = totalSeats ? Math.min(100, (ticketsSold / totalSeats) * 100) : 0;

    res.send({
      totalRevenue,
      ticketsSold,
      totalBookings,
      avgOrderValue,
      occupancy,
      byFormat,
      topMovies,
      series,
    });
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

// CSV helper: quote a field and escape embedded quotes.
const csvCell = v => {
  const s = v == null ? '' : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

// Admin: download all reservations as a CSV (for accounting/reporting).
router.get('/analytics/export', auth.enhance, async (req, res) => {
  try {
    const [reservations, movies, cinemas] = await Promise.all([
      Reservation.find({}).sort({ createdAt: -1 }),
      Movie.find({}).select('title'),
      Cinema.find({}).select('name'),
    ]);

    const movieTitle = {};
    movies.forEach(m => (movieTitle[m._id] = m.title));
    const cinemaName = {};
    cinemas.forEach(c => (cinemaName[c._id] = c.name));

    const headers = [
      'Booking ID',
      'Created',
      'Show Date',
      'Time',
      'Movie',
      'Cinema',
      'Format',
      'Seats',
      'Customer',
      'Email',
      'Subtotal',
      'Convenience Fee',
      'VAT',
      'Total',
      'Status',
    ];

    const rows = reservations.map(r =>
      [
        r._id,
        r.createdAt ? new Date(r.createdAt).toISOString() : '',
        r.date || '',
        r.startAt || '',
        movieTitle[r.movieId] || '',
        cinemaName[r.cinemaId] || '',
        r.format || '2D',
        Array.isArray(r.seats) ? r.seats.length : 0,
        r.username || '',
        r.email || '',
        r.subtotal != null ? r.subtotal : '',
        r.convenienceFee != null ? r.convenienceFee : '',
        r.vat != null ? r.vat : '',
        r.total != null ? r.total : '',
        r.paymentStatus || '',
      ]
        .map(csvCell)
        .join(',')
    );

    const csv = [headers.join(','), ...rows].join('\n');
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="reservations-${new Date().toISOString().slice(0, 10)}.csv"`
    );
    res.send(csv);
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

module.exports = router;
