import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useNhost } from '../NhostContext';

export function SignIn() {
  const { nhost, session, refreshSession } = useNhost();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await nhost.auth.signinEmailPassword({
        email,
        password
      });

      if (response.data.session) {
        refreshSession();
      }
    } catch (err) {
      console.error('Error signing in:', err);
      setError('Failed to sign in. Please check your credentials and try again.');
    } finally {
      setLoading(false);
    }
  };

  // If user is already signed in, redirect to profile
  if (session) {
    return <Navigate to="/profile" />;
  }

  return (
    <div className="auth-container">
      <h1>Nhost SDK Demo</h1>
      
      <form onSubmit={handleSignIn} className="auth-form">
        <h2>Sign In</h2>
        
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        {error && <p className="error">{error}</p>}
        
        <button type="submit" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
      
      <div className="auth-links">
        <p>
          Don't have an account? <Link to="/">Sign Up</Link>
        </p>
      </div>
    </div>
  );
} 