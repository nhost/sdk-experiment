'use client';

import { createClient, NhostClient, Session } from 'nhost-js';
import { CookieStorage } from 'nhost-js';
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode
} from 'react';

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
    subdomain: 'local',
    storage: new CookieStorage()
  });

  const refreshSession = () => {
    const currentSession = nhost.getUserSession();
    setSession(currentSession);
  };

  // Improved signout function
  const signout = () => {
    try {
      document.cookie = 'nhostSession=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax;';
    } catch (error) {
      console.error("Error signing out:", error);
    }

    // Update state
    setSession(null);
  };

  useEffect(() => {
    // Initial session check
    refreshSession();
    setLoading(false);

    // Setup a listener for storage events to keep session in sync across tabs
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'nhostSession') {
        refreshSession();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
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
