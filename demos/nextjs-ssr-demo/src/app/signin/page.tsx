'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useNhost } from '../lib/nhost/client';
import { revalidateAfterAuthChange } from '../lib/actions';

export default function SignIn() {
  const { nhost, session, refreshSession, loading } = useNhost();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  // Get the intended destination from URL params
  const redirectTo = searchParams.get('redirectTo') || '/profile';

  // Check authentication status - always call this hook
  useEffect(() => {
    if (!loading && session) {
      setShouldRedirect(true);
    }
  }, [session, loading]);

  // Handle redirection after auth check - always call this hook
  useEffect(() => {
    if (shouldRedirect) {
      router.push(redirectTo);
    }
  }, [shouldRedirect, router, redirectTo]);

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
          <p>Redirecting...</p>
        </div>
      </div>
    );
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await nhost.auth.signinEmailPassword({
        email,
        password
      });

      if (response.data.session) {
        // Refresh local session state
        refreshSession();
        
        // Trigger revalidation to update server components
        await revalidateAfterAuthChange();
        
        // Redirect to destination
        setShouldRedirect(true);
      }
    } catch (err) {
      console.error('Error signing in:', err);
      setError('Failed to sign in. Please check your credentials and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-3xl mb-6 gradient-text">Nhost SDK Demo</h1>

      <div className="glass-card w-full p-8 mb-6">
        <h2 className="text-2xl mb-6">Sign In</h2>

        <form onSubmit={handleSignIn} className="space-y-5">
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
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>

      <div className="mt-4">
        <p>
          Don&apos;t have an account?{' '}
          <Link href="/">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
