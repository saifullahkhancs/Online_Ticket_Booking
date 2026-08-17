import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api';
import Header from '../components/Header';
import AuthModal from '../components/AuthModal';

function fmtDate(iso) {
  return new Date(iso).toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}
function fmtTime(iso) {
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function TicketInfo() {
  const { ref } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [lookup, setLookup] = useState(ref || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showAuth, setShowAuth] = useState(false);

  async function fetchTicket(r) {
    if (!r) return;
    setLoading(true);
    setError('');
    try {
      const b = await api.booking(r);
      setBooking(b);
    } catch (err) {
      setError(err.message);
      setBooking(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (ref) fetchTicket(ref);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref]);

  function doLookup(e) {
    e.preventDefault();
    navigate(`/ticket/${lookup.trim()}`);
  }

  const f = booking?.flightInfo;

  return (
    <>
      <Header onLogin={() => setShowAuth(true)} />

      <section className="ticket-page">
        <div className="container">
          <div className="ticket-actions">
            <div>
              <h1 style={{ margin: 0, color: 'var(--blue-900)' }}>Ticket information</h1>
              <p style={{ color: 'var(--muted)', margin: '6px 0 0' }}>
                View and manage your e-ticket by booking reference.
              </p>
            </div>
            <form className="lookup" onSubmit={doLookup}>
              <input
                value={lookup}
                onChange={(e) => setLookup(e.target.value)}
                placeholder="e.g. WF-ABC123"
              />
              <button className="btn btn-secondary" type="submit">
                Find ticket
              </button>
            </form>
          </div>

          {error && (
            <div className="message error" style={{ maxWidth: 720, marginInline: 'auto' }}>
              {error}
            </div>
          )}

          {loading && <div className="loading">Fetching your ticket…</div>}

          {!loading && !error && !booking && (
            <div className="panel loading" style={{ maxWidth: 720, marginInline: 'auto' }}>
              Enter a booking reference above to view your ticket. After you book,
              you'll be taken straight to your ticket page.
            </div>
          )}

          {!loading && booking && f && (
            <div className="ticket">
              <div className="ticket-head">
                <div>
                  <div className="airline">{f.airline}</div>
                  <div style={{ opacity: 0.85, fontSize: 13 }}>Flight {f.flightNumber}</div>
                </div>
                <div className="ref">
                  Booking reference
                  <br />
                  <b>{booking.bookingRef}</b>
                </div>
              </div>

              <div className="ticket-body">
                <div className="ticket-route">
                  <div>
                    <div className="trip-city">{f.origin.code}</div>
                    <div className="trip-airport">
                      {f.origin.city}, {f.origin.country}
                    </div>
                  </div>
                  <div className="trip-center">
                    <div className="plane">✈</div>
                    <div className="dur">{f.durationMinutes >= 60 ? `${Math.floor(f.durationMinutes / 60)}h ${f.durationMinutes % 60}m` : `${f.durationMinutes}m`}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div className="trip-city">{f.destination.code}</div>
                    <div className="trip-airport">
                      {f.destination.city}, {f.destination.country}
                    </div>
                  </div>
                </div>

                <div className="ticket-times">
                  <div className="tcol">
                    <div className="lbl">Departure</div>
                    <div className="big">{fmtTime(f.departureTime)}</div>
                    <div className="sub">{fmtDate(f.departureTime)}</div>
                  </div>
                  <div className="tcol">
                    <div className="lbl">Arrival</div>
                    <div className="big">{fmtTime(f.arrivalTime)}</div>
                    <div className="sub">{fmtDate(f.arrivalTime)}</div>
                  </div>
                </div>

                <div className="ticket-details">
                  <div className="detail">
                    <div className="lbl">Passenger</div>
                    <div className="val">{booking.passenger?.fullName}</div>
                  </div>
                  <div className="detail">
                    <div className="lbl">Cabin class</div>
                    <div className="val">{booking.cabinClass || f.cabinClass}</div>
                  </div>
                  <div className="detail">
                    <div className="lbl">Fare type</div>
                    <div className="val">{booking.fareType}</div>
                  </div>
                  <div className="detail">
                    <div className="lbl">Seats</div>
                    <div className="val">{booking.seatsBooked}</div>
                  </div>
                  <div className="detail">
                    <div className="lbl">Status</div>
                    <div className="val">
                      <span className="badge badge-success">{booking.status}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="ticket-foot">
                <div>
                  <div className="lbl" style={{ fontSize: 11, textTransform: 'uppercase', color: 'var(--muted)', fontWeight: 700 }}>
                    Total fare
                  </div>
                  <div className="fare">
                    ${booking.totalPrice.toLocaleString()} <small style={{ fontSize: 13 }}>{booking.currency}</small>
                  </div>
                </div>
                <span className="print" onClick={() => window.print()}>
                  🖨 Print / save as PDF
                </span>
              </div>
            </div>
          )}
        </div>
      </section>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </>
  );
}
