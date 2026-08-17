const mongoose = require('mongoose');

/**
 * Connect to MongoDB. The connection string is read from MONGO_URI in the
 * environment (loaded from .env by dotenv in server.js).
 */
async function connectDB(uri) {
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    throw err;
  }
}

module.exports = connectDB;
