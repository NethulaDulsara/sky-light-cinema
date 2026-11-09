const { isRefundEligible, hoursUntil } = require('./refund');

describe('refund policy', () => {
  const now = new Date('2026-11-09T12:00:00Z');

  test('eligible when comfortably before showtime', () => {
    const show = new Date('2026-11-09T18:00:00Z'); // 6h away
    expect(isRefundEligible(show, 3, now)).toBe(true);
  });

  test('not eligible inside the refund window', () => {
    const show = new Date('2026-11-09T14:00:00Z'); // 2h away
    expect(isRefundEligible(show, 3, now)).toBe(false);
  });

  test('not eligible after showtime has passed', () => {
    const show = new Date('2026-11-09T10:00:00Z'); // 2h ago
    expect(isRefundEligible(show, 3, now)).toBe(false);
  });

  test('hoursUntil computes the gap', () => {
    const show = new Date('2026-11-09T15:00:00Z');
    expect(hoursUntil(show, now)).toBeCloseTo(3, 5);
  });
});
