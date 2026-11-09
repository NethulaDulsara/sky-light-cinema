// Pure refund-policy helper so it can be unit-tested without a database.
// A paid booking is refundable only if cancelled at least `refundWindowHours`
// before the showtime.

const hoursUntil = (showDate, now = new Date()) =>
  (new Date(showDate).getTime() - now.getTime()) / (1000 * 60 * 60);

const isRefundEligible = (showDate, refundWindowHours, now = new Date()) =>
  hoursUntil(showDate, now) >= refundWindowHours;

module.exports = { hoursUntil, isRefundEligible };
