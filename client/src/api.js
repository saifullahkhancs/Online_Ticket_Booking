// Thin wrapper around the Express API. Uses relative URLs so it works with the
// Vite proxy in dev and can be reverse-proxied in production.

const BASE = '/api';

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || `Request failed (${res.status})`);
  }
  return data;
}

export const api = {
  // Flights
  flights: (params = {}) => {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => v && qs.set(k, v));
    const q = qs.toString();
    return request(`/flights${q ? `?${q}` : ''}`);
  },
  airports: () => request('/flights/airports'),

  // Bookings
  createBooking: (payload) =>
    request('/bookings', { method: 'POST', body: JSON.stringify(payload) }),
  booking: (ref) => request(`/bookings/${ref}`),
  bookings: () => request('/bookings'),

  // Users
  signup: (payload) =>
    request('/users/signup', { method: 'POST', body: JSON.stringify(payload) }),
  login: (payload) =>
    request('/users/login', { method: 'POST', body: JSON.stringify(payload) }),
};
