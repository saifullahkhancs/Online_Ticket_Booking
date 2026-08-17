import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

export default function Header({ onLogin }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="header">
      <div className="container header-inner">
        <Link to="/" className="brand">
          <span className="mark">✈</span>
          SkySafar
        </Link>
        <nav className="nav">
          <span className="nav-links">
            <Link to="/">Home</Link>
            <Link to="/book">Book a flight</Link>
            <Link to="/ticket">My ticket</Link>
          </span>
          {user ? (
            <span className="user-chip">
              👤 {user.fullName || user.userName}
              <button
                className="btn btn-ghost"
                style={{ padding: '8px 14px' }}
                onClick={() => {
                  logout();
                  navigate('/');
                }}
              >
                Logout
              </button>
            </span>
          ) : (
            <button className="btn btn-primary" onClick={onLogin}>
              Sign in
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
