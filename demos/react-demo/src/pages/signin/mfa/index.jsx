import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../lib/auth/AuthProvider';
import { nhost } from '../../../lib/nhost/client';

export default function MfaVerification() {
  // Extract ticket from URL search params
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const ticket = searchParams.get('ticket');
  const initialError = searchParams.get('error');

  const { isAuthenticated } = useAuth();
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(initialError);

  // Use effect to handle redirects
  useEffect(() => {
    // If user is already authenticated, redirect to profile
    if (isAuthenticated) {
      navigate('/profile', { replace: true });
    }

    // If no ticket is provided, redirect to sign in
    if (!ticket) {
      navigate('/signin', { replace: true });
    }
  }, [isAuthenticated, ticket, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await verifyMfa(ticket, otp);
      
      if (response.error) {
        setError(response.error);
      } else {
        // Successfully verified MFA, navigate to profile
        navigate('/profile', { replace: true });
      }
    } catch (err) {
      setError(err.message || 'An error occurred during verification');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to verify MFA code
  const verifyMfa = async (ticket, otp) => {
    try {
      // We already imported nhost client at the top of the file

      // Verify MFA code
      const response = await nhost.auth.signInVerifyMfaTotp({
        ticket,
        otp,
      });

      // Check for successful verification
      if (response.body?.session) {
        return { success: true };
      }

      return { error: 'Failed to verify MFA code' };
    } catch (error) {
      console.error('MFA verification error:', error);
      return { error: error.message || 'Failed to verify code' };
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-3xl mb-6 gradient-text">Nhost SDK Demo</h1>

      <div className="glass-card w-full p-8 mb-6">
        <h2 className="text-2xl mb-6">Verification Required</h2>

        <div>
          <p className="mb-4">
            A verification code is required to complete sign in. Please enter
            the code from your authenticator app.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="otp">Verification Code</label>
              <input
                id="otp"
                name="otp"
                type="text"
                placeholder="Enter 6-digit code"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
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
                className="btn btn-primary"
                disabled={isLoading}
              >
                {isLoading ? 'Verifying...' : 'Verify'}
              </button>

              <Link to="/signin" className="btn btn-secondary">
                Back
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}