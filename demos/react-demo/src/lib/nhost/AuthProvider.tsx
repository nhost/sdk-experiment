import {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  type ReactNode,
} from "react";
import { createClient, NhostClient } from "@nhost/nhost-js";
import { type Session } from "@nhost/nhost-js/auth";
import { EventEmitterStorage } from "./EventEmitterStorage";

interface AuthContextType {
  user: Session["user"] | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  nhost: NhostClient;
}

// Create context for authentication state and nhost client
const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<Session["user"] | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Create the nhost client with EventEmitterStorage
  const nhost = useMemo(
    () =>
      createClient({
        region: import.meta.env.VITE_NHOST_REGION || "local",
        subdomain: import.meta.env.VITE_NHOST_SUBDOMAIN || "local",
        storage: new EventEmitterStorage({
          secure: import.meta.env.VITE_ENV === "production",
        }),
        disableAutoRefreshToken: true,
      }),
    [],
  );

  useEffect(() => {
    // Initialize authentication state
    setIsLoading(true);

    // Set initial values
    const currentSession = nhost.getUserSession();
    setUser(currentSession?.user || null);
    setSession(currentSession);
    setIsAuthenticated(!!currentSession);
    setIsLoading(false);

    // Use the event emitter instead of polling for changes
    const sessionStorage = nhost.sessionStorage;
    if (sessionStorage instanceof EventEmitterStorage) {
      const unsubscribe = sessionStorage.onSessionChange((currentSession) => {
        setUser(currentSession?.user || null);
        setSession(currentSession);
        setIsAuthenticated(!!currentSession);
      });

      // Clean up subscription on unmount
      return () => {
        unsubscribe();
      };
    }
    
    return undefined;
  }, [nhost]);

  // Effect to refresh the session every 10 seconds
  useEffect(() => {
    if (!isAuthenticated) return;

    const intervalId = setInterval(() => {
      nhost.refreshSession();
    }, 10000);

    return () => {
      clearInterval(intervalId);
    };
  }, [nhost, isAuthenticated]);

  // Context value with nhost client directly exposed
  const value: AuthContextType = {
    user,
    session,
    isAuthenticated,
    isLoading,
    nhost,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
