/**
 * Seed script — generates RANDOM world-flight data and inserts it into MongoDB.
 *
 * Usage (from the /server directory):
 *   node seed.js            # seeds 120 random flights
 *   node seed.js 250        # seeds a custom number of flights
 *
 * This targets a real MongoDB. Set MONGO_URI in .env to your local MongoDB or
 * Atlas connection string first. (The in-memory demo store auto-seeds on
 * startup, so no seeding is needed there.)
 */

require('dotenv').config();
const connectDB = require('./config/db');
const { seedFlights } = require('./seedData');

async function main() {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.log(
      'No MONGO_URI is set. This script seeds a real MongoDB.\n' +
        'Set MONGO_URI in .env (e.g. mongodb://127.0.0.1:27017/world_flights or your Atlas URI) and retry.\n' +
        'Note: the in-memory demo store already auto-seeds on server startup.'
    );
    process.exit(1);
  }

  await connectDB(uri);

  const count = parseInt(process.argv[2], 10);
  const n = Number.isFinite(count) && count > 0 ? count : 120;
  const inserted = await seedFlights(n);

  console.log(`Inserted ${inserted.length} random flights into the database.`);
  console.log('Sample flight numbers:', inserted.slice(0, 5).map((f) => f.flightNumber).join(', '));
  process.exit(0);
}

main().catch((err) => {
  console.error('Seeding failed:', err.message);
  process.exit(1);
});
