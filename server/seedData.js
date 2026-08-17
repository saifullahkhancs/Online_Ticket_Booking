/**
 * Reusable seed logic. Used by the CLI `seed.js` and by the server on startup
 * when the database is empty (so the demo works out of the box).
 */
const Flight = require('./models/Flight');
const Booking = require('./models/Booking');
const { customAlphabet } = require('nanoid');
const { AIRPORTS, pick, makeFlight, rand } = require('./randomData');

const makeRef = customAlphabet('ABCDEFGHJKLMNPQRSTUVWXYZ23456789', 6);

async function createDemoBookings(flights) {
  if (!flights || flights.length < 3) return;
  const demoPassengers = [
    { fullName: 'Saifullah Khan', phone: '03007117755', email: 'saif@gmail.com' },
    { fullName: 'Ayesha Malik', phone: '03121234567', email: 'ayesha@example.com' },
  ];
  for (let i = 0; i < demoPassengers.length; i++) {
    const flight = flights[i % flights.length];
    await Booking.create({
      bookingRef: `WF-DEMO-${makeRef()}`,
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
      passenger: demoPassengers[i],
      fareType: 'one-way',
      cabinClass: flight.cabinClass,
      seatsBooked: 1,
      unitPrice: flight.price,
      totalPrice: flight.price,
      currency: flight.currency,
    });
  }
}

/**
 * Seed `count` random flights (clearing existing flights first).
 */
async function seedFlights(count = 120) {
  await Flight.deleteMany({});
  const docs = [];
  for (let i = 0; i < count; i++) {
    const origin = pick(AIRPORTS);
    let destination = pick(AIRPORTS);
    let guard = 0;
    while (destination.code === origin.code && guard++ < 10) {
      destination = pick(AIRPORTS);
    }
    docs.push(makeFlight(origin, destination, rand(0, 14)));
  }
  const inserted = await Flight.insertMany(docs);
  await createDemoBookings(inserted);
  return inserted;
}

/**
 * Seed only if the flights collection is empty. Returns the number of flights.
 */
async function seedIfEmpty() {
  const count = await Flight.estimatedDocumentCount();
  if (count > 0) {
    console.log(`Database already has ${count} flights — skipping seed.`);
    return count;
  }
  const inserted = await seedFlights(120);
  console.log(`Seeded ${inserted.length} random world flights.`);
  return inserted.length;
}

module.exports = { seedFlights, seedIfEmpty };
