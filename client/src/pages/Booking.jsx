import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../api';
import Header from '../components/Header';
import FlightCard from '../components/FlightCard';
import AuthModal from '../components/AuthModal';
import { useAuth } from '../AuthContext';

function fmtDate(iso) {
  return new Date(iso).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
}
function fmtTime(iso) {
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function Booking() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { user } = useAuth();
  const [showAuth, setShowAuth] = useState(false);

  const [airports, setAirports] = useState([]);
  const [filters, setFilters] = useState({
    origin: params.get('origin') || '',
    destination: params.get('destination') || '',
    date: params.get('date') || '',
    airline: '',
    cabinClass: '',
  });
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);

  const [pax, setPax] = useState({ fullName: '', phone: '', email: '' });
  const [fareType, setFareType] = useState('one-way');
  const [seats, setSeats] = useState(1);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api.airports().then(setAirports).catch(() => {});
  }, []);

  async function runSearch(ev) {
    if (ev) ev.preventDefault();
    setLoading(true);
    setError('');
    try {
      const list = await api.flights({
        origin: filters.origin,
        destination: filters.destination,
        date: filters.date,
        airline: filters.airline,
        cabinClass: filters.cabinClass,
      });
      setFlights(list);
      setSelected(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    runSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const unitPrice = selected ? selected.price : 0;
  const total = selected ? unitPrice * seats * (fareType === 'round-trip' ? 2 : 1) : 0;

  async function handleBook(e) {
    e.preventDefault();
    setError('');
    if (!selected) return setError('Please select a flight first.');
    if (!user) return setShowAuth(true);

    setBusy(true);
    try {
      const booking = await api.createBooking({
        flightId: selected._id,
        passenger: pax,
        fareType,
        seatsBooked: seats,
      });
      navigate(`/ticket/${booking.bookingRef}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <Header onLogin={() => setShowAuth(true)} />

      <section className="hero" style={{ padding: '44px 0' }}>
        <div className="container">
          <h1 style={{ margin: 0, fontSize: '30px' }}>Book your flight</h1>
          <p style={{ opacity: 0.9, margin: '8px 0 0' }}>
            Search worldwide flights and issue your ticket in minutes.
          </p>
        </div>
      </section>

      <section className="search-shell">
        <div className="container">
          <form className="search-form" onSubmit={runSearch}>
            <div className="field">
              <label>From</label>
              <select
                value={filters.origin}
                onChange={(e) => setFilters((f) => ({ ...f, origin: e.target.value }))}
              >
                <option value="">Anywhere</option>
                {airports.map((a) => (
                  <option key={a.code} value={a.code}>
                    {a.code} · {a.city}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>To</label>
              <select
                value={filters.destination}
                onChange={(e) => setFilters((f) => ({ ...f, destination: e.target.value }))}
              >
                <option value="">Anywhere</option>
                {airports.map((a) => (
                  <option key={a.code} value={a.code}>
                    {a.code} · {a.city}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>Date</label>
              <input
                type="date"
                value={filters.date}
                onChange={(e) => setFilters((f) => ({ ...f, date: e.target.value }))}
              />
            </div>
            <div className="field">
              <label>Cabin</label>
              <select
                value={filters.cabinClass}
                onChange={(e) => setFilters((f) => ({ ...f, cabinClass: e.target.value }))}
              >
                <option value="">Any</option>
                <option>Economy</option>
                <option>Business</option>
                <option>First</option>
              </select>
            </div>
            <button className="btn btn-primary" type="submit">
              Search
            </button>
          </form>
        </div>
      </section>

      <section className="section" style={{ paddingTop: '36px' }}>
        <div className="container">
          {error && <div className="message error">{error}</div>}
          {loading ? (
            <div className="loading">Loading flights…</div>
          ) : (
            <div className="booking-layout">
              <div>
                <div className="section-head" style={{ textAlign: 'left', marginBottom: '18px' }}>
                  <h2 style={{ fontSize: '22px' }}>Available flights ({flights.length})</h2>
                </div>
                {flights.length === 0 ? (
                  <div className="panel loading" style={{ textAlign: 'left' }}>
                    No flights match your search. Try widening the filters.
                  </div>
                ) : (
                  <div className="flight-grid">
                    {flights.map((f) => (
                      <FlightCard
                        key={f._id}
                        flight={f}
                        selected={selected && selected._id === f._id}
                        onBook={(fl) => setSelected(fl)}
                      />
                    ))}
                  </div>
                )}
              </div>

              <div>
                <div className="panel">
                  <h3>Passenger & booking details</h3>

                  {!selected ? (
                    <p className="loading" style={{ padding: '10px 0' }}>
                      Select a flight on the left to continue.
                    </p>
                  ) : (
                    <>
                      <div className="summary-row">
                        <span>Flight</span>
                        <b>
                          {selected.flightNumber} · {selected.airline}
                        </b>
                      </div>
                      <div className="summary-row">
                        <span>Route</span>
                        <b>
                          {selected.origin.code} → {selected.destination.code}
                        </b>
                      </div>
                      <div className="summary-row">
                        <span>Departs</span>
                        <b>
                          {fmtDate(selected.departureTime)} · {fmtTime(selected.departureTime)}
                        </b>
                      </div>
                      <div className="summary-row">
                        <span>Duration</span>
                        <b>{selected.durationLabel}</b>
                      </div>

                      <div className="trip-toggle" style={{ marginTop: '16px' }}>
                        <button
                          className={fareType === 'one-way' ? 'active' : ''}
                          onClick={() => setFareType('one-way')}
                        >
                          One way
                        </button>
                        <button
                          className={fareType === 'round-trip' ? 'active' : ''}
                          onClick={() => setFareType('round-trip')}
                        >
                          Round trip
                        </button>
                      </div>

                      <form onSubmit={handleBook}>
                        <div className="form-field">
                          <label>Number of seats</label>
                          <select value={seats} onChange={(e) => setSeats(Number(e.target.value))}>
                            {[1, 2, 3, 4, 5].map((n) => (
                              <option key={n} value={n}>
                                {n}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="form-field">
                          <label>Full name</label>
                          <input
                            value={pax.fullName}
                            onChange={(e) => setPax((p) => ({ ...p, fullName: e.target.value }))}
                            required
                            placeholder="e.g. Saifullah Khan"
                          />
                        </div>
                        <div className="form-row">
                          <div className="form-field">
                            <label>Phone</label>
                            <input
                              value={pax.phone}
                              onChange={(e) => setPax((p) => ({ ...p, phone: e.target.value }))}
                              required
                            />
                          </div>
                          <div className="form-field">
                            <label>Email</label>
                            <input
                              type="email"
                              value={pax.email}
                              onChange={(e) => setPax((p) => ({ ...p, email: e.target.value }))}
                              required
                            />
                          </div>
                        </div>

                        <div className="summary-row">
                          <span>Unit price</span>
                          <b>${unitPrice.toLocaleString()}</b>
                        </div>
                        <div className="summary-row">
                          <span>Seats</span>
                          <b>{seats}</b>
                        </div>
                        <div className="summary-row">
                          <span>Fare type</span>
                          <b>{fareType}</b>
                        </div>
                        <div className="summary-total">
                          <span>Total</span>
                          <span>${total.toLocaleString()}</span>
                        </div>

                        <button
                          className="btn btn-primary btn-block"
                          style={{ marginTop: '16px' }}
                          disabled={busy}
                        >
                          {busy ? 'Booking…' : 'Confirm booking & get ticket'}
                        </button>
                      </form>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </>
  );
}
