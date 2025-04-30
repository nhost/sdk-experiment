import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useNhost } from '../NhostContext';

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { session, loading } = useNhost();
  const location = useLocation();

  // Show loading state if still checking authentication
  if (loading) {
    return (
      <div className="loading-container">
        <p>Loading...</p>
      </div>
    );
  }

  // If not authenticated, redirect to sign-in page
  // but preserve the intended location for redirecting back after login
  if (!session) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // If authenticated, render the protected content
  return <>{children}</>;
} 