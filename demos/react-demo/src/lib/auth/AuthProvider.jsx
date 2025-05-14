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

    // Create a function to check auth status periodically
    // Since the SDK doesn't provide an event-based API in this version
    const checkAuthStatus = () => {
      const currentSession = nhost.getUserSession();
      setUser(currentSession?.user || null);
      setSession(currentSession);
      setIsAuthenticated(!!currentSession);
      setIsLoading(false);
    };

    // Set up initial interval to check auth status
    const intervalId = setInterval(checkAuthStatus, 2000);

    // Set loading to false after initial check
    setIsLoading(false);

    // Clean up interval on unmount
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  // Authentication methods
  const signIn = async (email, password) => {
    return await nhost.auth.signInEmailPassword({
      email,
      password,
    });
  };

  const signUp = async (email, password, options = {}) => {
    return nhost.auth.signUpEmailPassword({
      email,
      password,
      options,
    });
  };

  const signOut = async () => {
    try {
      // Get the current session for the refresh token
      const session = nhost.getUserSession();
      if (session) {
        await nhost.auth.signOut({
          refreshToken: session.refreshToken,
        });
        await nhost.clearSession();
      }
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
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
