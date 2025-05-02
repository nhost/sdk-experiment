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
import { usePathname, useSearchParams } from 'next/navigation';

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

/**
 * NhostProvider creates a context that manages authentication state using Nhost.
 * 
 * This provider is intended for client-side use only, as indicated by the 'use client' directive.
 * 
 * This provider handles:
 * - Creating and configuring the Nhost client
 * - Managing authentication session state
 * - Syncing sessions across browser tabs
 * - Refreshing the session on route changes
 * - Providing sign-out functionality
 * 
 * Wrap your application with this provider to make Nhost authentication
 * available throughout the component tree via the useNhost hook.
 * 
 * @param {NhostProviderProps} props - The component props
 * @param {ReactNode} props.children - Child components that will have access to the Nhost context
 */
export function NhostProvider({ children }: NhostProviderProps) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const searchParams = useSearchParams();

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

  // Refresh session on route changes
  useEffect(() => {
    refreshSession();
  }, [pathname, searchParams]);

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

/**
 * Hook to access the Nhost authentication context.
 * 
 * This hook is intended for client-side use only, as it depends on the NhostProvider.
 * 
 * Provides access to:
 * - The Nhost client instance
 * - Current session information
 * - Loading state
 * - Session refresh function
 * - Sign-out function
 * 
 * @returns {NhostContextType} The Nhost context containing client, session, and authentication utilities
 * @throws {Error} When used outside of an NhostProvider
 */
export function useNhost() {
  const context = useContext(NhostContext);
  if (context === undefined) {
    throw new Error('useNhost must be used within a NhostProvider');
  }
  return context;
}
