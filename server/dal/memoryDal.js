/**
 * In-memory data-access implementation.
 *
 * Used when a real MongoDB is not reachable (e.g. in a sandboxed demo) so the
 * app still runs end-to-end. It mirrors the mongoDal interface exactly, so the
 * API layer is identical regardless of backend. For production deployments the
 * app should use mongoDal + a real MongoDB instead.
 */
const { AIRPORTS, pick, makeFlight, rand } = require('../randomData');
const { customAlphabet } = require('nanoid');

const makeRef = customAlphabet('ABCDEFGHJKLMNPQRSTUVWXYZ23456789', 6);

function createStore() {
  let flightSeq = 0;
  let bookingSeq = 0;
  let userSeq = 0;
  const flights = [];
  const bookings = [];
  const users = [];

  // ---- seed random data once on creation --------------------------------
  function seed() {
    if (flights.length > 0) return;
    for (let i = 0; i < 120; i++) {
      const origin = pick(AIRPORTS);
      let destination = pick(AIRPORTS);
      let guard = 0;
      while (destination.code === origin.code && guard++ < 10) destination = pick(AIRPORTS);
      flightSeq += 1;
      flights.push({ _id: `F${flightSeq}`, ...makeFlight(origin, destination, rand(0, 14)) });
    }
    // demo bookings so the ticket page has content
    const demoPassengers = [
      { fullName: 'Saifullah Khan', phone: '03007117755', email: 'saif@gmail.com' },
      { fullName: 'Ayesha Malik', phone: '03121234567', email: 'ayesha@example.com' },
    ];
    demoPassengers.forEach((p, i) => {
      const f = flights[i % flights.length];
      bookingSeq += 1;
      bookings.push({
        _id: `B${bookingSeq}`,
        bookingRef: `WF-DEMO-${makeRef()}`,
        flight: f._id,
        flightInfo: flightInfo(f),
        passenger: p,
        fareType: 'one-way',
        cabinClass: f.cabinClass,
        seatsBooked: 1,
        unitPrice: f.price,
        totalPrice: f.price,
        currency: f.currency,
        status: 'confirmed',
        createdAt: new Date(),
      });
    });
    console.log('In-memory store seeded with 120 random flights.');
  }

  function flightInfo(f) {
    return {
      flightNumber: f.flightNumber,
      airline: f.airline,
      origin: f.origin,
      destination: f.destination,
      departureTime: f.departureTime,
      arrivalTime: f.arrivalTime,
      durationMinutes: f.durationMinutes,
      cabinClass: f.cabinClass,
    };
  }

  function toPublic(f) {
    return {
      _id: f._id,
      flightNumber: f.flightNumber,
      airline: f.airline,
      origin: f.origin,
      destination: f.destination,
      departureTime: f.departureTime,
      arrivalTime: f.arrivalTime,
      durationMinutes: f.durationMinutes,
      durationLabel: f.durationLabel,
      price: f.price,
      currency: f.currency,
      cabinClass: f.cabinClass,
      seatsAvailable: f.seatsAvailable,
      gate: f.gate,
    };
  }

  const api = {
    flights: {
      async list({ origin, destination, date, airline, cabinClass } = {}) {
        seed();
        return flights
          .filter((f) => {
            if (origin && f.origin.code !== origin.toUpperCase()) return false;
            if (destination && f.destination.code !== destination.toUpperCase()) return false;
            if (airline && !f.airline.toLowerCase().includes(airline.toLowerCase())) return false;
            if (cabinClass && f.cabinClass !== cabinClass) return false;
            if (date) {
              const day = new Date(f.departureTime);
              const target = new Date(`${date}T00:00:00`);
              if (day.toDateString() !== target.toDateString()) return false;
            }
            return true;
          })
          .sort((a, b) => new Date(a.departureTime) - new Date(b.departureTime))
          .map(toPublic);
      },

      async airports() {
        seed();
        const map = new Map();
        for (const f of flights) {
          for (const loc of [f.origin, f.destination]) {
            if (!map.has(loc.code)) map.set(loc.code, { city: loc.city, country: loc.country, code: loc.code, airport: loc.airport });
          }
        }
        return Array.from(map.values());
      },

      async getById(id) {
        seed();
        const f = flights.find((x) => x._id === id);
        return f ? toPublic(f) : null;
      },

      async count() {
        seed();
        return flights.length;
      },
    },

    bookings: {
      async create({ flightId, passenger, fareType, seatsBooked }) {
        seed();
        const f = flights.find((x) => x._id === flightId);
        if (!f) return { error: 'Flight not found' };
        const qty = Math.max(1, parseInt(seatsBooked, 10) || 1);
        if (f.seatsAvailable < qty) return { error: 'Not enough seats available on this flight' };

        const multiplier = fareType === 'round-trip' ? 2 : 1;
        const unitPrice = f.price;
        const totalPrice = unitPrice * qty * multiplier;

        bookingSeq += 1;
        const booking = {
          _id: `B${bookingSeq}`,
          bookingRef: `WF-${makeRef()}`,
          flight: f._id,
          flightInfo: flightInfo(f),
          passenger,
          fareType,
          cabinClass: f.cabinClass,
          seatsBooked: qty,
          unitPrice,
          totalPrice,
          currency: f.currency,
          status: 'confirmed',
          createdAt: new Date(),
        };
        bookings.unshift(booking);
        f.seatsAvailable -= qty;
        return { booking };
      },

      async list() {
        seed();
        return bookings;
      },

      async getByRef(ref) {
        seed();
        return bookings.find((b) => b.bookingRef === ref) || null;
      },
    },

    users: {
      async findUser({ userName } = {}) {
        seed();
        return users.find((u) => u.userName === userName) || null;
      },

      async findByEmail(email) {
        seed();
        return users.find((u) => u.email === (email || '').toLowerCase()) || null;
      },

      async create({ firstName, lastName, userName, email, password, phone }) {
        seed();
        userSeq += 1;
        const user = {
          _id: `U${userSeq}`,
          firstName,
          lastName,
          fullName: `${firstName} ${lastName}`,
          userName,
          email: email.toLowerCase(),
          password,
          phone,
        };
        users.push(user);
        return user;
      },
    },
  };

  return api;
}

module.exports = { createStore };
