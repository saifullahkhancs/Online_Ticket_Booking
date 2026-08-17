const mongoose = require('mongoose');

/**
 * A single scheduled flight connecting two world airports.
 * Origin / destination are embedded sub-documents holding airport info.
 */
const locationSchema = new mongoose.Schema(
  {
    city: { type: String, required: true, trim: true },
    country: { type: String, required: true, trim: true },
    code: { type: String, required: true, uppercase: true, trim: true }, // IATA airport code
    airport: { type: String, trim: true },
  },
  { _id: false }
);

const flightSchema = new mongoose.Schema(
  {
    flightNumber: { type: String, required: true, unique: true, trim: true },
    airline: { type: String, required: true, trim: true },
    origin: { type: locationSchema, required: true },
    destination: { type: locationSchema, required: true },
    departureTime: { type: Date, required: true },
    arrivalTime: { type: Date, required: true },
    durationMinutes: { type: Number, required: true },
    price: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'USD' },
    cabinClass: {
      type: String,
      enum: ['Economy', 'Business', 'First'],
      default: 'Economy',
    },
    seatsAvailable: { type: Number, required: true, min: 0, default: 150 },
    gate: { type: String, trim: true },
  },
  { timestamps: true }
);

// Virtual: human-friendly flight duration, e.g. "7h 25m"
flightSchema.virtual('durationLabel').get(function () {
  const h = Math.floor(this.durationMinutes / 60);
  const m = this.durationMinutes % 60;
  return `${h}h ${m.toString().padStart(2, '0')}m`;
});

flightSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Flight', flightSchema);
