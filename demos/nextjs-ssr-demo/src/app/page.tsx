'use client';

import { useNhost } from './lib/nhost/client';
import { useState, useEffect } from 'react';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default function Home() {
  const { nhost, session, refreshSession } = useNhost();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);

  // If user is already authenticated, redirect to profile
  // Or if the sign up was successful
  useEffect(() => {
    if (session || shouldRedirect) {
      redirect('/profile');
    }
  }, [session, shouldRedirect]);

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
        // Refresh local session state
        await refreshSession();

        // Redirect to profile
        setShouldRedirect(true);
      }
    } catch (err) {
      console.error('Error signing up:', err);
      setError('Failed to sign up. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMagicLinkSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !displayName) {
      setError('Please enter your email and display name');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Use signinPasswordlessEmail to send a magic link
      // This also creates a new account if the email doesn't exist
      const response = await nhost.auth.signinPasswordlessEmail({
        email,
        options: {
          displayName,
          redirectTo: `${window.location.origin}`
        }
      });

      if (response.data) {
        setMagicLinkSent(true);
      }
    } catch (err) {
      console.error('Error sending magic link:', err);
      setError('Failed to send magic link. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-3xl mb-6 gradient-text">Nhost SDK Demo</h1>

      <div className="glass-card w-full p-8 mb-6">
        <h2 className="text-2xl mb-6">Sign Up</h2>

        {magicLinkSent ? (
          <div className="text-center">
            <p className="mb-4">Magic link sent! Check your email to sign in.</p>
            <button
              onClick={() => setMagicLinkSent(false)}
              className="btn btn-secondary"
            >
              Back to sign up
            </button>
          </div>
        ) : (
          <>
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

            <div className="mt-6 flex flex-col items-center">
              <div className="w-full text-center my-4">
                <span className="px-2 text-gray-500">or</span>
              </div>

              <form onSubmit={handleMagicLinkSignUp} className="w-full">
                <button
                  type="submit"
                  disabled={isLoading || !email || !displayName}
                  className="btn btn-secondary w-full"
                >
                  {isLoading ? 'Sending...' : 'Sign up with Magic Link'}
                </button>
              </form>
            </div>
          </>
        )}
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

