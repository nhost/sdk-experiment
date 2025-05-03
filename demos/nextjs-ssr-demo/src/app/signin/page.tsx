'use client';

import { useNhost } from '../lib/nhost/client';
import { useState, useEffect } from 'react';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default function SignIn() {
  const { nhost, session, refreshSession, loading } = useNhost();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  
  // MFA states
  const [mfaRequired, setMfaRequired] = useState(false);
  const [mfaTicket, setMfaTicket] = useState('');
  const [mfaCode, setMfaCode] = useState('');

  // If user is already authenticated, redirect to profile
  // Or if the sign in was successful
  useEffect(() => {
    if (session || shouldRedirect) {
      redirect('/profile');
    }
  }, [session, shouldRedirect]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await nhost.auth.signinEmailPassword({
        email,
        password
      });

      // Check if MFA is required
      if (response.data.mfa) {
        // MFA is required, store the ticket and show MFA form
        setMfaRequired(true);
        setMfaTicket(response.data.mfa.ticket);
        setIsLoading(false);
        return;
      }

      if (response.data.session) {
        // Refresh local session state
        await refreshSession();
        // Session refresh now handles revalidation automatically
        
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
  
  // Handle MFA verification
  const handleMfaVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mfaCode) {
      setError('Please enter your verification code');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Verify MFA using the code and ticket
      const response = await nhost.auth.signinVerifyMfaTotp({
        ticket: mfaTicket,
        otp: mfaCode
      });
      
      if (response.data.session) {
        // MFA verification successful, refresh session
        await refreshSession();
        
        // Redirect to destination
        setShouldRedirect(true);
      }
    } catch (err) {
      console.error('Error verifying MFA:', err);
      setError('Failed to verify code. Please check your code and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMagicLinkSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    
    setIsLoading(true);
    setError(null);

    try {
      // Use signinPasswordlessEmail to send a magic link
      const response = await nhost.auth.signinPasswordlessEmail({
        email,
        options: {
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

  // Go back to password login from MFA screen
  const handleBackFromMfa = () => {
    setMfaRequired(false);
    setMfaTicket('');
    setMfaCode('');
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-3xl mb-6 gradient-text">Nhost SDK Demo</h1>

      <div className="glass-card w-full p-8 mb-6">
        <h2 className="text-2xl mb-6">Sign In</h2>

        {mfaRequired ? (
          // MFA verification form
          <div>
            <p className="mb-4">
              A verification code is required to complete sign in. Please enter the code from your authenticator app.
            </p>
            
            <form onSubmit={handleMfaVerification} className="space-y-5">
              <div>
                <label htmlFor="mfa-code">
                  Verification Code
                </label>
                <input
                  id="mfa-code"
                  type="text"
                  value={mfaCode}
                  onChange={(e) => setMfaCode(e.target.value)}
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                  required
                />
              </div>
              
              {error && (
                <div className="alert alert-error">
                  {error}
                </div>
              )}
              
              <div className="flex space-x-3">
                <button
                  type="submit"
                  disabled={isLoading || !mfaCode}
                  className="btn btn-primary"
                >
                  {isLoading ? 'Verifying...' : 'Verify'}
                </button>
                
                <button
                  type="button"
                  onClick={handleBackFromMfa}
                  disabled={isLoading}
                  className="btn btn-secondary"
                >
                  Back
                </button>
              </div>
            </form>
          </div>
        ) : magicLinkSent ? (
          <div className="text-center">
            <p className="mb-4">Magic link sent! Check your email to sign in.</p>
            <button
              onClick={() => setMagicLinkSent(false)}
              className="btn btn-secondary"
            >
              Back to sign in
            </button>
          </div>
        ) : (
          <>
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
            
            <div className="mt-6 flex flex-col items-center">
              <div className="w-full text-center my-4">
                <span className="px-2 text-gray-500">or</span>
              </div>
              
              <form onSubmit={handleMagicLinkSignIn} className="w-full">
                <button
                  type="submit"
                  disabled={isLoading || !email}
                  className="btn btn-secondary w-full"
                >
                  {isLoading ? 'Sending...' : 'Sign in with Magic Link'}
                </button>
              </form>
            </div>
          </>
        )}
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
