const express = require('express');
const { db } = require('../dal');

const router = express.Router();

/**
 * GET /api/flights
 * List flights. Optional query filters:
 *   ?origin=<IATA code>
 *   ?destination=<IATA code>
 *   ?date=YYYY-MM-DD
 *   ?airline=<name>
 *   ?cabinClass=Economy|Business|First
 */
router.get('/', async (req, res) => {
  try {
    const { origin, destination, date, airline, cabinClass } = req.query;
    const flights = await db().flights.list({ origin, destination, date, airline, cabinClass });
    res.json(flights);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * GET /api/flights/airports
 * Unique origin/destination airports (used to populate dropdowns).
 */
router.get('/airports', async (_req, res) => {
  try {
    res.json(await db().flights.airports());
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * GET /api/flights/:id
 * Single flight by id.
 */
router.get('/:id', async (req, res) => {
  try {
    const flight = await db().flights.getById(req.params.id);
    if (!flight) return res.status(404).json({ message: 'Flight not found' });
    res.json(flight);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
