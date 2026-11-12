import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../auth';

export default function Login() {
  const { user, login } = useAuth();
  const [username, setUsername] = useState('reception');
  const [password, setPassword] = useState('Password123!');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (user) return <Navigate to="/" replace />;

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(username, password);
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="brand-name">Harbor Clinic</div>
        <p className="lede" style={{ marginBottom: 0 }}>
          Sign in to manage patients, appointments, and clinical directories.
        </p>
        <form onSubmit={onSubmit}>
          {error ? <div className="error">{error}</div> : null}
          <div className="field">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
            />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>
          <button className="btn" type="submit" disabled={submitting}>
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>
          <p className="muted">
            Demo users: <code>admin</code>, <code>reception</code>, <code>drchen</code> —
            password <code>Password123!</code>
          </p>
        </form>
      </div>
    </div>
  );
}
