const express = require('express');
const { db } = require('../dal');

const router = express.Router();

/**
 * POST /api/users/signup
 * Body: { firstName, lastName, userName, email, password, phone }
 */
router.post('/signup', async (req, res) => {
  try {
    const { firstName, lastName, userName, email, password, phone } = req.body;

    if (!firstName || !lastName || !userName || !email || !password) {
      return res.status(400).json({ status: 'not_ok', message: 'Missing required fields' });
    }

    const existing =
      (await db().users.findUser({ userName })) || (await db().users.findByEmail(email));
    if (existing) {
      return res.status(409).json({ status: 'not_ok', message: 'Username or email already taken' });
    }

    // NOTE: In a real app hash the password (e.g. bcrypt) before storing.
    const user = await db().users.create({
      firstName,
      lastName,
      userName,
      email,
      password,
      phone,
    });

    res.status(201).json({
      status: 'ok',
      user: { id: user._id, fullName: user.fullName, userName: user.userName, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ status: 'not_ok', message: err.message });
  }
});

/**
 * POST /api/users/login
 * Body: { userName, password }
 */
router.post('/login', async (req, res) => {
  try {
    const { userName, password } = req.body;
    const user = await db().users.findUser({ userName });

    // NOTE: Plain-text comparison for demo parity with the original app.
    if (!user || user.password !== password) {
      return res.status(401).json({ status: 'not_ok', message: 'Incorrect username or password' });
    }

    res.json({
      status: 'ok',
      user: { id: user._id, fullName: user.fullName, userName: user.userName, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ status: 'not_ok', message: err.message });
  }
});

module.exports = router;
