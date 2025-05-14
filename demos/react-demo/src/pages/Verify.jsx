import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { nhost } from '../lib/nhost/client';

export default function Verify() {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const [status, setStatus] = useState('verifying');
  const [error, setError] = useState(null);
  
  useEffect(() => {
    async function handleVerification() {
      // Get the refresh token from URL parameters
      const refreshToken = searchParams.get('refreshToken');
      
      if (!refreshToken) {
        setStatus('error');
        setError('No refresh token provided');
        return;
      }
      
      try {
        // Check if user is already signed in
        if (nhost.getUserSession()) {
          setStatus('error');
          setError('Already signed in');
          return;
        }
        
        // Use the refresh token to create a new session
        const response = await nhost.auth.refreshToken({ refreshToken });
        
        if (response.body) {
          setStatus('success');
          // Redirect to profile after a short delay
          setTimeout(() => navigate('/profile'), 1500);
        } else {
          setStatus('error');
          setError('Failed to verify token');
        }
      } catch (err) {
        console.error('Verification error:', err);
        setStatus('error');
        
        if (err.response?.body?.message) {
          setError(err.response.body.message);
        } else if (err.message) {
          setError(err.message);
        } else {
          setError('An error occurred during verification');
        }
      }
    }
    
    handleVerification();
  }, [searchParams, navigate]);
  
  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-3xl mb-6 gradient-text">Nhost SDK Demo</h1>
      
      <div className="glass-card w-full p-8 mb-6">
        <h2 className="text-2xl mb-6">Verification</h2>
        
        <div className="text-center">
          {status === 'verifying' && <p>Verifying your email...</p>}
          
          {status === 'success' && (
            <div>
              <p className="mb-4 text-green-500">✓ Verification successful!</p>
              <p>You'll be redirected to your profile shortly.</p>
            </div>
          )}
          
          {status === 'error' && (
            <div>
              <p className="mb-4 text-red-500">
                {error || 'Verification failed'}
              </p>
              <button 
                onClick={() => navigate('/signin')} 
                className="btn btn-primary"
              >
                Back to Sign In
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}