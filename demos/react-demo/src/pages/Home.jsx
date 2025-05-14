import { Navigate } from 'react-router-dom';
import { useAuth } from '../lib/auth/AuthProvider';

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();
  
  // If authentication is still loading, show a loading state
  if (isLoading) {
    return (
      <div className="loading-container">
        <p>Loading...</p>
      </div>
    );
  }
  
  // Redirect based on authentication status
  if (isAuthenticated) {
    return <Navigate to="/profile" />;
  }
  
  // If not authenticated, redirect to signin page
  return <Navigate to="/signin" />;
}