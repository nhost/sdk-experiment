import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../lib/nhost/AuthProvider";

interface IProtectedRouteProps {
  redirectTo?: string;
}

const ProtectedRoute = ({ redirectTo = "/signin" }: IProtectedRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="loading-container">
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
