'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useNhost } from './lib/nhost-provider';

export default function Home() {
  const { nhost, session, refreshSession, loading } = useNhost();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const router = useRouter();

  // Check authentication status - always call this hook
  useEffect(() => {
    if (!loading && session) {
      setShouldRedirect(true);
    }
  }, [session, loading]);
  
  // Handle redirection after auth check - always call this hook
  useEffect(() => {
    if (shouldRedirect) {
      router.push('/profile');
    }
  }, [shouldRedirect, router]);

  // If still checking authentication, show loading
  if (loading) {
    return (
      <div className="loading-container">
        <div className="text-center">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // If already authenticated, show loading until redirect
  if (shouldRedirect) {
    return (
      <div className="loading-container">
        <div className="text-center">
          <p>Redirecting to profile...</p>
        </div>
      </div>
    );
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
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
        setShouldRedirect(true);
      }
    } catch (err) {
      console.error('Error signing up:', err);
      setError('Failed to sign up. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-3xl mb-6 gradient-text">Nhost SDK Demo</h1>
      
      <div className="glass-card w-full p-8 mb-6">
        <h2 className="text-2xl mb-6">Sign Up</h2>
        
        <form onSubmit={handleSignUp} className="space-y-5">
          <div>
            <label htmlFor="displayName">
              Display Name
            </label>
            <input
              id="displayName"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
            />
          </div>
          
          <div>
            <label htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div>
            <label htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
            disabled={isLoading}
            className="btn btn-primary w-full"
          >
            {isLoading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>
      </div>
      
      <div className="mt-4">
        <p>
          Already have an account?{' '}
          <Link href="/signin">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

