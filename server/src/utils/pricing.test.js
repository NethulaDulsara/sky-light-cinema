const { calculatePrice, parseHour } = require('./pricing');

const settings = {
  formats: [
    { name: '2D', priceMultiplier: 1 },
    { name: '3D', priceMultiplier: 1.25 },
    { name: 'IMAX', priceMultiplier: 1.6 },
  ],
  convenienceFeeRate: 0.02,
  vatRate: 0.18,
  weekendSurcharge: 0.15,
  peakSurcharge: 0.1,
  peakStartHour: 18,
  peakEndHour: 23,
};

// A fixed weekday (Wed 2026-11-11) and weekend (Sat 2026-11-14).
const WEEKDAY = '2026-11-11';
const WEEKEND = '2026-11-14';

describe('parseHour', () => {
  test('parses 24h', () => expect(parseHour('18:00')).toBe(18));
  test('parses am/pm', () => {
    expect(parseHour('6:30 PM')).toBe(18);
    expect(parseHour('12:00 AM')).toBe(0);
    expect(parseHour('9am')).toBe(9);
  });
  test('rejects garbage', () => expect(parseHour('soon')).toBeNull());
});

describe('calculatePrice', () => {
  test('weekday 2D off-peak: fees + VAT only', () => {
    const p = calculatePrice(
      { basePrice: 700, seatCount: 2, format: '2D', date: WEEKDAY, startAt: '14:00' },
      settings
    );
    expect(p.perSeat).toBe(700);
    expect(p.subtotal).toBe(1400);
    expect(p.convenienceFee).toBe(28); // 2%
    expect(p.vat).toBeCloseTo(257.04, 2); // 18% of (1400+28)
    expect(p.total).toBeCloseTo(1685.04, 2);
  });

  test('weekend IMAX peak stacks format + surcharges', () => {
    const p = calculatePrice(
      { basePrice: 700, seatCount: 2, format: 'IMAX', date: WEEKEND, startAt: '20:00' },
      settings
    );
    // 700 * 1.6 * (1 + 0.15 + 0.10) = 1400 per seat
    expect(p.perSeat).toBe(1400);
    expect(p.subtotal).toBe(2800);
    expect(p.total).toBeCloseTo(3370.08, 2);
  });

  test('unknown format falls back to multiplier 1', () => {
    const p = calculatePrice(
      { basePrice: 500, seatCount: 1, format: 'HOLOGRAM', date: WEEKDAY, startAt: '10:00' },
      settings
    );
    expect(p.formatMultiplier).toBe(1);
    expect(p.perSeat).toBe(500);
  });

  test('zero seats yields zero totals', () => {
    const p = calculatePrice(
      { basePrice: 700, seatCount: 0, format: '2D', date: WEEKDAY, startAt: '14:00' },
      settings
    );
    expect(p.subtotal).toBe(0);
    expect(p.total).toBe(0);
  });
});
