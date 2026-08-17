function fmtTime(iso) {
  return new Date(iso).toLocaleString([], {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function FlightCard({ flight, onBook, selected }) {
  return (
    <div className="flight-card" style={selected ? { borderColor: 'var(--blue-500)' } : undefined}>
      <div className="flight-top">
        <span className="flight-no">{flight.flightNumber}</span>
        <span className="cabin-badge">{flight.cabinClass}</span>
      </div>

      <div className="route">
        <div className="airport">
          <div className="code">{flight.origin.code}</div>
          <div className="city">{flight.origin.city}</div>
        </div>
        <div className="flight-line">
          <span className="dash" />
          <span>✈</span>
          <span className="dash" />
        </div>
        <div className="airport">
          <div className="code">{flight.destination.code}</div>
          <div className="city">{flight.destination.city}</div>
        </div>
      </div>

      <div className="route-times">
        <span>{fmtTime(flight.departureTime)}</span>
        <span>{fmtTime(flight.arrivalTime)}</span>
      </div>

      <div className="flight-meta">
        <span>{flight.airline}</span>
        <span>🕒 {flight.durationLabel}</span>
        <span>Gate {flight.gate}</span>
      </div>

      <div className="flight-foot">
        <div className="price">
          ${flight.price.toLocaleString()} <small>per seat</small>
        </div>
        <button className="btn btn-primary" onClick={() => onBook && onBook(flight)}>
          {selected ? 'Selected ✓' : 'Select & book'}
        </button>
      </div>
    </div>
  );
}
