'use client';

import { createClient, NhostClient, Session } from 'nhost-js';
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode
} from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { revalidateAfterAuthChange } from '../../auth/actions';

interface NhostContextType {
  nhost: NhostClient;
  session: Session | null;
  refreshSession: () => Promise<void>;
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
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Create Nhost client with region and subdomain set to local
  const nhost = createClient({
    region: 'local',
    subdomain: 'local',
  });

  const refreshSession = async () => {
    const currentSession = nhost.getUserSession();

    setSession(currentSession);
    await revalidateAfterAuthChange();
  };

  // Handle refresh token authentication in URL
  useEffect(() => {
    const handleRefreshTokenInQueryArgs = async () => {
      const refreshToken = searchParams?.get('refreshToken');

      // Only process if we have a refresh token and don't already have a valid session
      const currentSession = nhost.getUserSession();

      if (refreshToken && !currentSession) {
        try {
          // Call the refreshToken method to authenticate with the token in URL
          const response = await nhost.auth.refreshToken({
            refreshToken
          });

          // If we got a successful response, refresh the session
          if (response.data) {
            await refreshSession();

            // Remove the token from the URL to prevent issues on refresh
            const url = new URL(window.location.href);
            url.searchParams.delete('refreshToken');
            window.history.replaceState({}, '', url.toString());
          }
        } catch (error) {
          console.error("Error processing magic link:", error);
        }
      }
    };

    handleRefreshTokenInQueryArgs();
  }, [searchParams, nhost.auth]);

  // Refresh session only on pathname changes, not on every searchParams change
  useEffect(() => {
    const refreshOnPathChange = async () => {
      await refreshSession();
    };

    refreshOnPathChange();
  }, [pathname]);

  // Initial session setup
  useEffect(() => {
    // Initial session check
    const initialSetup = async () => {
      await refreshSession();
    };

    initialSetup();

    // Setup a listener for storage events to keep session in sync across tabs
    const handleStorageChange = async (event: StorageEvent) => {
      if (event.key === 'nhostSession') {
        await refreshSession();
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
    refreshSession,
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
export function useNhost(): NhostContextType {
  const context = useContext(NhostContext);
  if (context === undefined) {
    throw new Error('useNhost must be used within a NhostProvider');
  }
  return context;
}
