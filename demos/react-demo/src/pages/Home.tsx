import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useNhost } from '../NhostContext';

export function Home() {
  const { nhost, session, refreshSession } = useNhost();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await nhost.auth.signupEmailPassword({
        email,
        password,
        options: {
          displayName
        }
      });

      if (response.data.session) {
        refreshSession();
      }
    } catch (err) {
      console.error('Error signing up:', err);
      setError('Failed to sign up. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // If user is already signed in, show a message
  if (session) {
    return <Navigate to="/profile" />;
  }

  return (
    <div className="auth-container">
      <h1>Nhost SDK Demo</h1>
      
      <form onSubmit={handleSignUp} className="auth-form">
        <h2>Sign Up</h2>
        
        <div className="form-group">
          <label htmlFor="displayName">Display Name</label>
          <input
            id="displayName"
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
          />
        </div>
        
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
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>
      </form>
      
      <div className="auth-links">
        <p>
          Already have an account? <Link to="/signin">Sign In</Link>
        </p>
      </div>
    </div>
  );
} 