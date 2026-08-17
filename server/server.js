const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');
const { seedIfEmpty } = require('./seedData');
const { db, useMemory } = require('./dal');

const flightRoutes = require('./routes/flights');
const bookingRoutes = require('./routes/bookings');
const userRoutes = require('./routes/users');

const app = express();
const PORT = process.env.PORT || 5000;

// ---- Middleware ------------------------------------------------------------
app.use(
  cors({
    origin: (origin, cb) => cb(null, true), // allow all origins (dev/preview friendly)
    credentials: true,
  })
);
app.use(express.json());

// ---- Health check ----------------------------------------------------------
app.get('/api/health', (_req, res) => {
  const backend = !process.env.MONGO_URI || process.env.MONGO_MEMORY === 'true' ? 'memory' : 'mongo';
  res.json({ status: 'ok', backend, time: new Date().toISOString() });
});

// ---- Routes ----------------------------------------------------------------
app.use('/api/flights', flightRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/users', userRoutes);

// Simple request logger
app.use((req, _res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  next();
});

// ---- Error handler ---------------------------------------------------------
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: err.message });
});

// ---- Startup ---------------------------------------------------------------
async function start() {
  const uri = process.env.MONGO_URI;
  const forceMemory = process.env.MONGO_MEMORY === 'true';

  // 1) In-memory fallback (demo): when requested or when no Mongo is reachable.
  if (forceMemory || !uri) {
    useMemory();
    console.log('Using in-memory data store (demo mode).');
    // Warm it so flights are ready immediately.
    await db().flights.count();
    app.listen(PORT, () => {
      console.log(`Flight API running on http://0.0.0.0:${PORT} (in-memory backend)`);
    });
    return;
  }

  // 2) Real MongoDB path (production): connect, auto-seed, serve.
  try {
    await connectDB(uri);
    await seedIfEmpty();
    app.listen(PORT, () => {
      console.log(`Flight API running on http://0.0.0.0:${PORT} (MongoDB backend)`);
    });
  } catch (err) {
    console.error(`Could not connect to MongoDB at ${uri}`);
    console.error('Falling back to the in-memory data store so the demo still runs.');
    useMemory();
    await db().flights.count();
    app.listen(PORT, () => {
      console.log(`Flight API running on http://0.0.0.0:${PORT} (in-memory backend)`);
    });
  }
}

start();
