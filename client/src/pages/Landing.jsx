import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import FlightCard from '../components/FlightCard';
import Header from '../components/Header';
import AuthModal from '../components/AuthModal';

const FEATURES = [
  { icon: '🌍', title: 'Worldwide network', text: 'Hundreds of routes connecting 60+ airports across every continent.' },
  { icon: '💺', title: 'Every cabin class', text: 'Choose from Economy, Business or First for the comfort that fits you.' },
  { icon: '⚡', title: 'Instant tickets', text: 'Book in seconds and get an instant e-ticket you can view anytime.' },
  { icon: '🎫', title: 'Easy tracking', text: 'Find your ticket anytime using just your booking reference.' },
];

export default function Landing() {
  const navigate = useNavigate();
  const [showAuth, setShowAuth] = useState(false);
  const [airports, setAirports] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [search, setSearch] = useState({ from: '', to: '', date: '' });

  useEffect(() => {
    api.airports().then(setAirports).catch(() => {});
    api.flights().then((fl) => setFeatured(fl.slice(0, 6))).catch(() => {});
  }, []);

  function doSearch(e) {
    e.preventDefault();
    const qs = new URLSearchParams();
    if (search.from) qs.set('origin', search.from);
    if (search.to) qs.set('destination', search.to);
    if (search.date) qs.set('date', search.date);
    navigate(`/book?${qs.toString()}`);
  }

  return (
    <>
      <Header onLogin={() => setShowAuth(true)} />

      <section className="hero">
        <div className="container hero-inner">
          <div>
            <h1>
              Take off to anywhere with <span>one click</span>.
            </h1>
            <p>
              Book world flights in seconds. Explore live availability, pick your
              cabin, and get an instant ticket — all in one place.
            </p>
            <div className="hero-stats">
              <div>
                <div className="num">{airports.length}+</div>
                <div className="lbl">Airports</div>
              </div>
              <div>
                <div className="num">120+</div>
                <div className="lbl">Daily flights</div>
              </div>
              <div>
                <div className="num">3</div>
                <div className="lbl">Cabin classes</div>
              </div>
            </div>
          </div>

          <div className="hero-art">
            <div className="hero-card">
              <div className="mini-label">Popular route</div>
              {featured[0] && (
                <>
                  <div className="mini-route">
                    <div className="codes">
                      {featured[0].origin.code}
                      <span>{featured[0].origin.city}</span>
                    </div>
                    <span className="plane">✈</span>
                    <div className="codes" style={{ textAlign: 'right' }}>
                      {featured[0].destination.code}
                      <span>{featured[0].destination.city}</span>
                    </div>
                  </div>
                  <div className="row">
                    <span>{featured[0].airline}</span>
                    <span>from ${featured[0].price}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="search-shell">
        <div className="container">
          <form className="search-form" onSubmit={doSearch}>
            <div className="field">
              <label>From</label>
              <select
                value={search.from}
                onChange={(e) => setSearch((s) => ({ ...s, from: e.target.value }))}
              >
                <option value="">Anywhere</option>
                {airports.map((a) => (
                  <option key={a.code} value={a.code}>
                    {a.code} · {a.city}, {a.country}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>To</label>
              <select
                value={search.to}
                onChange={(e) => setSearch((s) => ({ ...s, to: e.target.value }))}
              >
                <option value="">Anywhere</option>
                {airports.map((a) => (
                  <option key={a.code} value={a.code}>
                    {a.code} · {a.city}, {a.country}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>Departure date</label>
              <input
                type="date"
                value={search.date}
                onChange={(e) => setSearch((s) => ({ ...s, date: e.target.value }))}
              />
            </div>
            <button className="btn btn-primary" type="submit">
              Search flights
            </button>
          </form>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div className="eyebrow">Live now</div>
            <h2>Featured flights</h2>
            <p>Popular departures ready for take-off. Select one to continue to booking.</p>
          </div>
          <div className="flight-grid">
            {featured.map((f) => (
              <FlightCard key={f._id} flight={f} onBook={(fl) => navigate(`/book?flight=${fl._id}`)} />
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: '#fff' }}>
        <div className="container">
          <div className="section-head">
            <div className="eyebrow">Why SkySafar</div>
            <h2>Built for effortless travel</h2>
          </div>
          <div className="features">
            {FEATURES.map((f) => (
              <div className="feature" key={f.title}>
                <div className="icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container footer-inner">
          <span className="brand">
            <span className="mark">✈</span> SkySafar
          </span>
          <small>World Flight Ticket Booking · MERN demo</small>
        </div>
      </footer>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </>
  );
}
