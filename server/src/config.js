// Central config. Reads secrets from environment with safe dev defaults so the
// app keeps working locally, while allowing real secrets to be supplied via .env
// in production. The defaults mirror the values that used to be hardcoded, which
// keeps already-issued JWTs valid after the refactor.

module.exports = {
  JWT_SECRET: process.env.JWT_SECRET || 'mySecret',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:3000',
  // PayHere sandbox credentials (override in .env for a real merchant account)
  PAYHERE_MERCHANT_ID: process.env.PAYHERE_MERCHANT_ID || '1236984',
  PAYHERE_SECRET:
    process.env.PAYHERE_SECRET ||
    'MTM2MjQxMDg4OTM4NDQxNzI4NjQyODQ2OTQ3MjgyODA2ODEwNDg0',
  // How long a selected seat is held before the hold expires (minutes)
  SEAT_HOLD_MINUTES: Number(process.env.SEAT_HOLD_MINUTES) || 10,
  // How long a parked (held) box-office order keeps its seats before expiring.
  // Longer than the online hold since a cashier may juggle several customers.
  POS_HOLD_MINUTES: Number(process.env.POS_HOLD_MINUTES) || 60,
};
