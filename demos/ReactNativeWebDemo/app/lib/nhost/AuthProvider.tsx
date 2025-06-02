import {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  type ReactNode,
} from "react";
import { createClient, type NhostClient } from "@nhost/nhost-js";
import { MemoryStorage } from "@nhost/nhost-js/session";
import { type Session } from "@nhost/nhost-js/auth";
import Constants from "expo-constants";

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

  // Create the nhost client
  const nhost = useMemo(
    () =>
      createClient({
        subdomain:
          Constants.expoConfig?.extra?.NHOST_SUBDOMAIN || "192-168-1-103",
        region: Constants.expoConfig?.extra?.NHOST_REGION || "local",
        storage: new MemoryStorage(),
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

    const unsubscribe = nhost.sessionStorage.onChange((currentSession) => {
      setUser(currentSession?.user || null);
      setSession(currentSession);
      setIsAuthenticated(!!currentSession);
    });

    // Clean up subscription on unmount
    return () => {
      unsubscribe();
    };
  }, [nhost]);

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
