import { createClient, NhostClient, Session } from 'nhost-js';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface NhostContextType {
  nhost: NhostClient;
  session: Session | null;
  loading: boolean;
  refreshSession: () => void;
  signout: () => void;
}

const NhostContext = createContext<NhostContextType | undefined>(undefined);

interface NhostProviderProps {
  children: ReactNode;
}

export function NhostProvider({ children }: NhostProviderProps) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Create Nhost client with region and subdomain set to local
  const nhost = createClient({
    region: 'local',
    subdomain: 'local'
  });

  const refreshSession = () => {
    const currentSession = nhost.getUserSession();
    setSession(currentSession);
  };

  // Simple signout function that clears localStorage and updates state
  const signout = () => {
    localStorage.removeItem('nhostSession');
    setSession(null);
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
    refreshSession,
    signout
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