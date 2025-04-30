import { createClient, NhostClient, Session } from 'nhost-js';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Extend NhostClient to add a signout method to the auth property
interface ExtendedNhostClient extends NhostClient {
  auth: ReturnType<typeof createClient>['auth'] & {
    signout: () => Promise<void>;
  };
}

interface NhostContextType {
  nhost: ExtendedNhostClient;
  session: Session | null;
  loading: boolean;
  refreshSession: () => void;
}

const NhostContext = createContext<NhostContextType | undefined>(undefined);

interface NhostProviderProps {
  children: ReactNode;
}

export function NhostProvider({ children }: NhostProviderProps) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Create Nhost client with region and subdomain set to local
  const nhostClient = createClient({
    region: 'local',
    subdomain: 'local'
  });
  
  // Add a signout method to the auth client
  const nhost = {
    ...nhostClient,
    auth: {
      ...nhostClient.auth,
      // Implement signout by directly removing the session from localStorage
      signout: async () => {
        // Remove the session from localStorage
        localStorage.removeItem('nhostSession');
        // Update state to reflect the user is logged out
        setSession(null);
      }
    }
  } as ExtendedNhostClient;

  const refreshSession = () => {
    const currentSession = nhostClient.getUserSession();
    setSession(currentSession);
  };

  useEffect(() => {
    // Initial session check
    refreshSession();
    setLoading(false);
  }, []);

  const value = {
    nhost,
    session,
    loading,
    refreshSession
  };

  return <NhostContext.Provider value={value}>{children}</NhostContext.Provider>;
}

export function useNhost() {
  const context = useContext(NhostContext);
  if (context === undefined) {
    throw new Error('useNhost must be used within a NhostProvider');
  }
  return context;
} 