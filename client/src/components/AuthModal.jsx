import { useState } from 'react';
import { useAuth } from '../AuthContext';

const empty = {
  firstName: '',
  lastName: '',
  userName: '',
  email: '',
  password: '',
  phone: '',
};

export default function AuthModal({ onClose }) {
  const { login, signup } = useAuth();
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [form, setForm] = useState(empty);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  function set(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      if (mode === 'login') {
        await login({ userName: form.userName, password: form.password });
      } else {
        await signup(form);
      }
      onClose();
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="close">
          ✕
        </button>
        <h2>{mode === 'login' ? 'Welcome back' : 'Create your account'}</h2>
        <p className="sub">
          {mode === 'login'
            ? 'Log in to SkySafar to book and manage your flights.'
            : 'It is free and only takes a minute.'}
        </p>

        {error && <div className="message error">{error}</div>}

        <form onSubmit={handleSubmit}>
          {mode === 'signup' && (
            <>
              <div className="form-row">
                <div className="form-field">
                  <label>First name</label>
                  <input value={form.firstName} onChange={set('firstName')} required />
                </div>
                <div className="form-field">
                  <label>Last name</label>
                  <input value={form.lastName} onChange={set('lastName')} required />
                </div>
              </div>
            </>
          )}

          <div className="form-field">
            <label>Username</label>
            <input value={form.userName} onChange={set('userName')} required />
          </div>

          {mode === 'signup' && (
            <>
              <div className="form-field">
                <label>Email</label>
                <input type="email" value={form.email} onChange={set('email')} required />
              </div>
              <div className="form-field">
                <label>Phone number</label>
                <input value={form.phone} onChange={set('phone')} />
              </div>
            </>
          )}

          <div className="form-field">
            <label>Password</label>
            <input
              type="password"
              value={form.password}
              onChange={set('password')}
              minLength={8}
              required
            />
          </div>

          <button className="btn btn-primary btn-block" disabled={busy}>
            {busy ? 'Please wait…' : mode === 'login' ? 'Log in' : 'Sign up'}
          </button>
        </form>

        <p className="switch-line">
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}>
            {mode === 'login' ? 'Sign up' : 'Log in'}
          </button>
        </p>
      </div>
    </div>
  );
}
