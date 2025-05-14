import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { nhost } from '../lib/nhost/client';

export default function Verify() {
  const location = useLocation();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying');
  const [error, setError] = useState('');
  
  useEffect(() => {
    // Extract the refresh token from the URL
    const params = new URLSearchParams(location.search);
    const refreshToken = params.get('refreshToken');
    
    if (!refreshToken) {
      setStatus('error');
      setError('No refresh token found in URL');
      return;
    }
    
    // Flag to handle component unmounting during async operations
    let isMounted = true;
    
    async function processToken() {
      try {
        // First display the verifying message for at least a moment
        await new Promise(resolve => setTimeout(resolve, 500));
        
        if (!isMounted) return;
        
        // Process the token
        const response = await nhost.auth.refreshToken({ refreshToken });
        
        if (!isMounted) return;
        
        if (response.error) {
          setStatus('error');
          setError(response.error.message || 'Failed to verify your email');
        } else {
          setStatus('success');
          
          // Wait to show success message briefly, then redirect
          setTimeout(() => {
            if (isMounted) navigate('/profile');
          }, 1500);
        }
      } catch (err) {
        if (!isMounted) return;
        
        console.error('Verification error:', err);
        setStatus('error');
        setError(err.message || 'An error occurred during verification');
      }
    }
    
    processToken();
    
    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [location.search, navigate]);
  
  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-3xl mb-6 gradient-text">Nhost SDK Demo</h1>
      
      <div className="glass-card w-full p-8 mb-6">
        <h2 className="text-2xl mb-6">Email Verification</h2>
        
        <div className="text-center py-4">
          {status === 'verifying' && (
            <div>
              <p className="mb-4">Verifying your email...</p>
              <div className="w-8 h-8 border-t-2 border-blue-500 rounded-full animate-spin mx-auto"></div>
            </div>
          )}
          
          {status === 'success' && (
            <div>
              <p className="mb-4 text-green-500 font-bold">✓ Successfully verified!</p>
              <p>You'll be redirected to your profile page shortly...</p>
            </div>
          )}
          
          {status === 'error' && (
            <div>
              <p className="mb-4 text-red-500 font-semibold">
                Verification failed
              </p>
              <p className="mb-4">{error}</p>
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