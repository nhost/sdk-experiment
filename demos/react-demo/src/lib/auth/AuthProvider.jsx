import { createContext, useContext, useEffect, useState } from "react";
import { nhost } from "../nhost/client";

// Create context for authentication state
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Initialize authentication state
    setIsLoading(true);

    // Set initial values
    const currentSession = nhost.getUserSession();
    setUser(currentSession?.user || null);
    setSession(currentSession);
    setIsAuthenticated(!!currentSession);

    // Create a function to check auth status
    // Since the SDK doesn't provide an event-based API in this version
    const checkAuthStatus = () => {
      const currentSession = nhost.getUserSession();
      const sessionStr = JSON.stringify(currentSession);
      const prevSessionStr = JSON.stringify(session);

      // Only update if the session has changed
      if (sessionStr !== prevSessionStr) {
        setUser(currentSession?.user || null);
        setSession(currentSession);
        setIsAuthenticated(!!currentSession);
      }

      setIsLoading(false);
    };

    // Check immediately and then set up interval
    checkAuthStatus();

    // Set up interval to check auth status - shorter interval for better UX
    const intervalId = setInterval(checkAuthStatus, 1000);

    // Clean up interval on unmount
    return () => {
      clearInterval(intervalId);
    };
  }, []); // Remove the session dependency to avoid the dependency cycle

  // Authentication methods
  const signIn = async (email, password) => {
    const response = await nhost.auth.signInEmailPassword({
      email,
      password,
    });

    // If sign-in successful, update the auth state immediately
    if (response.body?.session) {
      // Update state with the new session
      const currentSession = response.body.session;
      setUser(currentSession?.user || null);
      setSession(currentSession);
      setIsAuthenticated(true);
    }

    return response;
  };

  const signUp = async (email, password, options = {}) => {
    return nhost.auth.signUpEmailPassword({
      email,
      password,
      options,
    });
  };

  const signOut = async () => {
    // Get the current session for the refresh token
    const session = nhost.getUserSession();
    if (session) {
      await nhost.auth.signOut({
        refreshToken: session.refreshToken,
      });

      // Clear state immediately after sign out
      setUser(null);
      setSession(null);
      setIsAuthenticated(false);
    }
  };

  const sendMagicLink = async (email, options = {}) => {
    return await nhost.auth.signInPasswordlessEmail({
      email,
      options: {
        redirectTo: window.location.origin + "/verify",
        ...options,
      },
    });
  };

  // Context value
  const value = {
    user,
    session,
    isAuthenticated,
    isLoading,
    signIn,
    signUp,
    signOut,
    sendMagicLink,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
