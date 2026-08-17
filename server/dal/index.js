/**
 * Data-access layer dispatcher.
 *
 * Provides one interface to the route handlers backed by either:
 *   - mongoDal   (Mongoose + MongoDB) — production default, or
 *   - memoryDal  (in-memory)          — demo fallback when Mongo isn't available.
 *
 * The routes never need to know which backend is active.
 */
const mongoDal = require('./mongoDal');
const { createStore } = require('./memoryDal');

let _useMemory = false;
let _memory;

function useMemory() {
  _useMemory = true;
}

function db() {
  if (_useMemory) {
    if (!_memory) _memory = createStore();
    return _memory;
  }
  return mongoDal;
}

module.exports = { db, useMemory };
