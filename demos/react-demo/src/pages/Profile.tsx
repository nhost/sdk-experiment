import { Navigate } from 'react-router-dom';
import { useNhost } from '../NhostContext';
import { useState } from 'react';

export function Profile() {
  const { nhost, session, refreshSession } = useNhost();
  const [loading, setLoading] = useState(false);

  // If not logged in, redirect to homepage
  if (!session) {
    return <Navigate to="/" />;
  }

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await nhost.auth.signout();
      refreshSession();
    } catch (err) {
      console.error('Error signing out:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-container">
      <h1>Your Profile</h1>
      
      <div className="profile-info">
        <div className="profile-detail">
          <strong>Display Name:</strong>
          <span>{session.user?.displayName || 'Not set'}</span>
        </div>
        
        <div className="profile-detail">
          <strong>Email:</strong>
          <span>{session.user?.email || 'Not available'}</span>
        </div>
        
        <div className="profile-detail">
          <strong>User ID:</strong>
          <span>{session.user?.id || 'Not available'}</span>
        </div>
        
        <div className="profile-detail">
          <strong>Roles:</strong>
          <span>{session.user?.roles?.join(', ') || 'None'}</span>
        </div>
        
        <div className="profile-detail">
          <strong>Email Verified:</strong>
          <span>{session.user?.emailVerified ? 'Yes' : 'No'}</span>
        </div>
      </div>
      
      <div className="profile-actions">
        <button onClick={handleSignOut} disabled={loading}>
          {loading ? 'Signing Out...' : 'Sign Out'}
        </button>
      </div>
      
      <div className="session-info">
        <h3>Session Information</h3>
        <pre>
          {JSON.stringify(
            {
              refreshTokenId: session.refreshTokenId,
              accessTokenExpiresIn: session.accessTokenExpiresIn
            },
            null,
            2
          )}
        </pre>
      </div>
    </div>
  );
} 