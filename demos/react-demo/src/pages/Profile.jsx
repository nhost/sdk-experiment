import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../lib/auth/AuthProvider';
import { nhost } from '../lib/nhost/client';
import MFASettings from '../components/MFASettings';

export default function Profile() {
  const { user, session, isAuthenticated, isLoading } = useAuth();
  const [isMfaEnabled, setIsMfaEnabled] = useState(false);
  const [isLoadingMfa, setIsLoadingMfa] = useState(true);
  
  // Fetch MFA status when user is authenticated
  useEffect(() => {
    const fetchMfaStatus = async () => {
      if (!user?.id) return;
      
      try {
        setIsLoadingMfa(true);
        const response = await nhost.graphql.request(`
          query GetUserMfaStatus {
            user(id: "${user.id}") {
              activeMfaType
            }
          }
        `);

        const userData = response.data;
        setIsMfaEnabled(userData?.user?.activeMfaType === "totp");
      } catch (err) {
        console.error("Failed to query MFA status:", err);
      } finally {
        setIsLoadingMfa(false);
      }
    };

    if (isAuthenticated && user?.id) {
      fetchMfaStatus();
    }
  }, [user, isAuthenticated]);

  // If not authenticated or still loading, show appropriate UI
  if (isLoading) {
    return (
      <div className="loading-container">
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/signin" />;
  }

  return (
    <div className="flex flex-col">
      <h1 className="text-3xl mb-6 gradient-text">Your Profile</h1>

      <div className="glass-card p-8 mb-6">
        <div className="space-y-5">
          <div className="profile-item">
            <strong>Display Name:</strong>
            <span className="ml-2">
              {user?.displayName || "Not set"}
            </span>
          </div>

          <div className="profile-item">
            <strong>Email:</strong>
            <span className="ml-2">
              {user?.email || "Not available"}
            </span>
          </div>

          <div className="profile-item">
            <strong>User ID:</strong>
            <span
              className="ml-2"
              style={{
                fontFamily: "monospace",
                fontSize: "0.875rem",
              }}
            >
              {user?.id || "Not available"}
            </span>
          </div>

          <div className="profile-item">
            <strong>Roles:</strong>
            <span className="ml-2">
              {user?.roles?.join(", ") || "None"}
            </span>
          </div>

          <div className="profile-item">
            <strong>Email Verified:</strong>
            <span className="ml-2">
              {user?.emailVerified ? "Yes" : "No"}
            </span>
          </div>
        </div>
      </div>

      <div className="glass-card p-8 mb-6">
        <h3 className="text-xl mb-4">Session Information</h3>
        <pre>
          {JSON.stringify(
            {
              refreshTokenId: session?.refreshTokenId,
              accessTokenExpiresIn: session?.accessTokenExpiresIn,
            },
            null,
            2,
          )}
        </pre>
      </div>

      <MFASettings initialMfaEnabled={isMfaEnabled} />
    </div>
  );
}