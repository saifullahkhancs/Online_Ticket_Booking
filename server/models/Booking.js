const mongoose = require('mongoose');

/**
 * A passenger booking / issued ticket for a flight.
 */
const passengerSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    phone: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
  },
  { _id: false }
);

const bookingSchema = new mongoose.Schema(
  {
    bookingRef: { type: String, required: true, unique: true, trim: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    flight: { type: mongoose.Schema.Types.ObjectId, ref: 'Flight', required: true },

    // Snapshot of the flight at booking time so the ticket stays correct
    // even if the flight document changes later.
    flightInfo: {
      flightNumber: String,
      airline: String,
      origin: { city: String, country: String, code: String, airport: String },
      destination: { city: String, country: String, code: String, airport: String },
      departureTime: Date,
      arrivalTime: Date,
      durationMinutes: Number,
      cabinClass: String,
    },

    passenger: { type: passengerSchema, required: true },
    fareType: { type: String, enum: ['one-way', 'round-trip'], default: 'one-way' },
    cabinClass: { type: String, enum: ['Economy', 'Business', 'First'], default: 'Economy' },
    seatsBooked: { type: Number, default: 1, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
    totalPrice: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'USD' },
    status: { type: String, enum: ['confirmed', 'cancelled'], default: 'confirmed' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);
