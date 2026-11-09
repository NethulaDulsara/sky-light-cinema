const mongoose = require('mongoose');

const { Schema } = mongoose;

// Default Offers & Giveaways shown on the homepage carousel and the /offers page.
const DEFAULT_OFFERS = [
  {
    title: 'Enjoy 10% Off Slushies',
    description:
      'Enjoy 10% off any slushie at the concessions counter when you show your booking.',
    badge: '10% OFF',
    image:
      'https://images.unsplash.com/photo-1572490122747-3968b75bb8ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    ctaLabel: 'Explore More',
    ctaLink: '/movie/category/nowShowing',
    enabled: true,
  },
  {
    title: '20% Off on Movie Tickets',
    description:
      '20% off standard tickets on selected weekday screenings. Applied automatically at checkout.',
    badge: '20% OFF',
    image:
      'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    ctaLabel: 'Explore More',
    ctaLink: '/movie/category/nowShowing',
    enabled: true,
  },
  {
    title: 'Buy One Get One Free on IMAX Tickets',
    description:
      'Buy one IMAX ticket and get a second free for the same screening. While stocks last.',
    badge: 'BOGO',
    image:
      'https://images.unsplash.com/photo-1485846234645-a62644f84728?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    ctaLabel: 'Explore More',
    ctaLink: '/movie/category/nowShowing',
    enabled: true,
  },
  {
    title: 'Earn 5% Loyalty Points',
    description:
      'Earn loyalty points on every booking and redeem them for free tickets and concessions.',
    badge: 'LOYALTY',
    image:
      'https://images.unsplash.com/photo-1518623489648-a173ef7824f3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    ctaLabel: 'Join Privilege',
    ctaLink: '/privilege',
    enabled: true,
  },
];

// Application-wide, admin-editable settings. Stored as a single document.
const settingsSchema = new Schema({
  // Screen formats and their price multipliers (relative to the cinema base price)
  formats: {
    type: [
      {
        name: { type: String, required: true },
        priceMultiplier: { type: Number, default: 1 },
        enabled: { type: Boolean, default: true },
      },
    ],
    default: [
      { name: '2D', priceMultiplier: 1, enabled: true },
      { name: '3D', priceMultiplier: 1.25, enabled: true },
      { name: 'IMAX', priceMultiplier: 1.6, enabled: true },
      { name: '4DX', priceMultiplier: 1.8, enabled: true },
    ],
  },
  // Fees & taxes (as fractions, e.g. 0.02 = 2%)
  convenienceFeeRate: { type: Number, default: 0.02 },
  vatRate: { type: Number, default: 0.18 },
  // Dynamic pricing surcharges (fractions)
  weekendSurcharge: { type: Number, default: 0.15 },
  peakSurcharge: { type: Number, default: 0.1 },
  peakStartHour: { type: Number, default: 18 }, // 6pm
  peakEndHour: { type: Number, default: 23 },
  // Refund policy: full refund allowed if more than this many hours before showtime
  refundWindowHours: { type: Number, default: 3 },
  // Movies featured in the homepage hero slider (ordered). Empty = show all.
  heroMovieIds: { type: [{ type: Schema.Types.ObjectId, ref: 'Movie' }], default: [] },
  // Offers & Giveaways shown on the homepage carousel and the /offers page.
  offers: {
    type: [
      {
        title: { type: String, required: true },
        description: { type: String, default: '' },
        badge: { type: String, default: '' },
        image: { type: String, default: '' },
        ctaLabel: { type: String, default: 'Explore More' },
        ctaLink: { type: String, default: '/movie/category/nowShowing' },
        enabled: { type: Boolean, default: true },
      },
    ],
    default: () => DEFAULT_OFFERS,
  },
}, { timestamps: true });

// Returns the single settings document, creating it with defaults if missing.
settingsSchema.statics.getSingleton = async function() {
  let doc = await this.findOne();
  if (!doc) doc = await this.create({});
  // Backfill offers for settings documents created before the field existed.
  if (!doc.offers || doc.offers.length === 0) {
    doc.offers = DEFAULT_OFFERS;
    await doc.save();
  }
  return doc;
};

const Settings = mongoose.model('Settings', settingsSchema);

module.exports = Settings;
