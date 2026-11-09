// Authoritative price calculator. The server computes totals from trusted data
// (cinema base price + admin settings) so client-supplied amounts can never
// change what a customer is charged.

const round = n => Math.round((n + Number.EPSILON) * 100) / 100;

// Parse an hour (0-23) out of a showtime string like "18:00", "6:30 PM", "9am".
const parseHour = startAt => {
  if (!startAt || typeof startAt !== 'string') return null;
  const m = startAt.trim().match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/i);
  if (!m) return null;
  let hour = parseInt(m[1], 10);
  const meridiem = m[3] && m[3].toLowerCase();
  if (meridiem === 'pm' && hour < 12) hour += 12;
  if (meridiem === 'am' && hour === 12) hour = 0;
  if (hour < 0 || hour > 23) return null;
  return hour;
};

/**
 * @param {Object} opts
 * @param {number} opts.basePrice  Cinema base ticket price
 * @param {number} opts.seatCount  Number of seats
 * @param {string} opts.format     Screen format name (2D/3D/IMAX/4DX)
 * @param {Date|string} opts.date  Show date (for weekend surcharge)
 * @param {string} opts.startAt    Show time string (for peak surcharge)
 * @param {Object} settings        Settings document
 * @returns {Object} price breakdown
 */
const calculatePrice = ({ basePrice, seatCount, format, date, startAt }, settings) => {
  const s = settings || {};
  const seats = Math.max(0, Number(seatCount) || 0);
  const base = Number(basePrice) || 0;

  // Format multiplier
  const formats = s.formats || [];
  const fmt = formats.find(f => f.name === format);
  const formatMultiplier = fmt ? fmt.priceMultiplier : 1;

  // Dynamic pricing: weekend + peak-hour surcharges
  let surcharge = 0;
  const d = date ? new Date(date) : null;
  if (d && !isNaN(d.getTime())) {
    const day = d.getDay(); // 0 Sun ... 6 Sat
    if (day === 0 || day === 6) surcharge += s.weekendSurcharge || 0;
  }
  const hour = parseHour(startAt);
  if (hour !== null) {
    const start = s.peakStartHour != null ? s.peakStartHour : 18;
    const end = s.peakEndHour != null ? s.peakEndHour : 23;
    if (hour >= start && hour <= end) surcharge += s.peakSurcharge || 0;
  }

  const perSeat = round(base * formatMultiplier * (1 + surcharge));
  const subtotal = round(perSeat * seats);
  const convenienceFee = round(subtotal * (s.convenienceFeeRate || 0));
  const vat = round((subtotal + convenienceFee) * (s.vatRate || 0));
  const total = round(subtotal + convenienceFee + vat);

  return {
    basePrice: base,
    format: format || '2D',
    formatMultiplier,
    surcharge,
    perSeat,
    seatCount: seats,
    subtotal,
    convenienceFee,
    vat,
    total,
  };
};

module.exports = { calculatePrice, parseHour };
