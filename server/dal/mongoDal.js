/**
 * MongoDB data-access implementation backed by Mongoose models.
 * This is the production path — works with a local MongoDB or MongoDB Atlas.
 */
const Flight = require('../models/Flight');
const Booking = require('../models/Booking');
const User = require('../models/User');
const { customAlphabet } = require('nanoid');

const makeRef = customAlphabet('ABCDEFGHJKLMNPQRSTUVWXYZ23456789', 6);

const flights = {
  async list({ origin, destination, date, airline, cabinClass } = {}) {
    const filter = {};
    if (origin) filter['origin.code'] = origin.toUpperCase();
    if (destination) filter['destination.code'] = destination.toUpperCase();
    if (airline) filter.airline = new RegExp(airline, 'i');
    if (cabinClass) filter.cabinClass = cabinClass;
    if (date) {
      const start = new Date(`${date}T00:00:00`);
      const end = new Date(`${date}T23:59:59`);
      filter.departureTime = { $gte: start, $lte: end };
    }
    return Flight.find(filter).sort({ departureTime: 1 });
  },

  async airports() {
    const docs = await Flight.find({}, { origin: 1, destination: 1 });
    const map = new Map();
    for (const f of docs) {
      for (const loc of [f.origin, f.destination]) {
        if (loc && !map.has(loc.code)) {
          map.set(loc.code, { city: loc.city, country: loc.country, code: loc.code, airport: loc.airport });
        }
      }
    }
    return Array.from(map.values());
  },

  async getById(id) {
    return Flight.findById(id);
  },

  async count() {
    return Flight.estimatedDocumentCount();
  },
};

const bookings = {
  async create({ flightId, passenger, fareType, seatsBooked }) {
    const flight = await Flight.findById(flightId);
    if (!flight) return { error: 'Flight not found' };

    const qty = Math.max(1, parseInt(seatsBooked, 10) || 1);
    if (flight.seatsAvailable < qty) return { error: 'Not enough seats available on this flight' };

    const multiplier = fareType === 'round-trip' ? 2 : 1;
    const unitPrice = flight.price;
    const totalPrice = unitPrice * qty * multiplier;

    const booking = new Booking({
      bookingRef: `WF-${makeRef()}`,
      flight: flight._id,
      flightInfo: {
        flightNumber: flight.flightNumber,
        airline: flight.airline,
        origin: flight.origin,
        destination: flight.destination,
        departureTime: flight.departureTime,
        arrivalTime: flight.arrivalTime,
        durationMinutes: flight.durationMinutes,
        cabinClass: flight.cabinClass,
      },
      passenger,
      fareType,
      cabinClass: flight.cabinClass,
      seatsBooked: qty,
      unitPrice,
      totalPrice,
      currency: flight.currency,
    });
    await booking.save();

    flight.seatsAvailable -= qty;
    await flight.save();
    return { booking };
  },

  async list() {
    return Booking.find().sort({ createdAt: -1 });
  },

  async getByRef(ref) {
    return Booking.findOne({ bookingRef: ref });
  },
};

const users = {
  async findUser({ userName } = {}) {
    return User.findOne({ userName });
  },

  async findByEmail(email) {
    return User.findOne({ email: email.toLowerCase() });
  },

  async create({ firstName, lastName, userName, email, password, phone }) {
    return User.create({ firstName, lastName, userName, email, password, phone });
  },
};

module.exports = { flights, bookings, users };
