import { useState } from 'react';
import { useAuth } from '../lib/auth/AuthProvider';

export default function MagicLinkForm({ buttonLabel = 'Send Magic Link' }) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const { sendMagicLink } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await sendMagicLink(email);
      
      if (!result.body) {
        setError('Failed to send magic link');
      } else {
        setSuccess(true);
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center">
        <p className="mb-4">Magic link sent! Check your email to sign in.</p>
        <button onClick={() => setSuccess(false)} className="btn btn-secondary">
          Try again
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="magic-email">Email</label>
        <input
          id="magic-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      <button
        type="submit"
        className="btn btn-primary w-full"
        disabled={isLoading}
      >
        {isLoading ? 'Sending...' : buttonLabel}
      </button>
    </form>
  );
}