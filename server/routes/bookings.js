const express = require('express');
const { db } = require('../dal');

const router = express.Router();

/**
 * POST /api/bookings
 * Create a new booking / issue a ticket.
 * Body: { flightId, passenger:{fullName,phone,email}, fareType, seatsBooked }
 */
router.post('/', async (req, res) => {
  try {
    const { flightId, passenger, fareType = 'one-way', seatsBooked = 1 } = req.body;

    if (!flightId || !passenger || !passenger.fullName) {
      return res
        .status(400)
        .json({ message: 'flightId and passenger.fullName are required' });
    }

    const result = await db().bookings.create({ flightId, passenger, fareType, seatsBooked });
    if (result.error) {
      return res.status(400).json({ message: result.error });
    }
    res.status(201).json(result.booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * GET /api/bookings
 * List all bookings, newest first.
 */
router.get('/', async (_req, res) => {
  try {
    res.json(await db().bookings.list());
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * GET /api/bookings/:ref
 * Fetch a booking / ticket by its booking reference.
 */
router.get('/:ref', async (req, res) => {
  try {
    const booking = await db().bookings.getByRef(req.params.ref);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
