import { AxiosInstance } from 'axios';
import { createApiClient, Session } from './client';
import { StorageInterface, detectStorage, DEFAULT_SESSION_KEY } from './storage';

/**
 * Extracts the expiration time from a JWT token
 * @param token - JWT token string
 * @returns Expiration timestamp in milliseconds, or 0 if unable to extract
 */
export const extractTokenExpiration = (token: string): number => {
  try {
    // JWT tokens are in the format header.payload.signature
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.warn('Token does not have three parts');
      return 0;
    }

    // Decode the payload (middle part)
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');

    try {
      // Cross-platform base64 decoding
      let jsonPayload: string;

      if (typeof window !== 'undefined') {
        // Browser environment
        jsonPayload = decodeURIComponent(
          window.atob(base64)
            .split('')
            .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        );
      } else {
        // Node.js environment
        const buffer = Buffer.from(base64, 'base64');
        jsonPayload = buffer.toString('utf8');
      }

      const payload = JSON.parse(jsonPayload);

      if (payload.exp) {
        // exp claim is in seconds, convert to milliseconds
        const expTime = payload.exp * 1000;
        return expTime;
      } else {
        console.warn('No exp claim found in token');
        return 0;
      }
    } catch (e) {
      console.warn('Error decoding token payload:', e);
      return 0;
    }
  } catch (error) {
    console.warn('Failed to extract token expiration:', error);
    return 0;
  }
};

/**
 * Options for token refresh interceptor
 */
export interface TokenInterceptorOptions {
  /** Storage implementation to use for session persistence */
  storage?: StorageInterface;
  /** Key to use for storing session data */
  storageKey?: string;
  /** Seconds before expiration to trigger token refresh */
  marginSeconds?: number;
}

/**
 * Creates an axios interceptor that automatically refreshes tokens when they're about to expire
 * @param authClient - Nhost Auth API client for authentication
 * @param options - Configuration options for the interceptor
 * @returns A function to attach the interceptor to an axios instance
 */
export const createTokenRefreshInterceptor = (
  authClient: ReturnType<typeof createApiClient>,
  options?: TokenInterceptorOptions
) => {
  const {
    storage = detectStorage(),
    storageKey = DEFAULT_SESSION_KEY,
    marginSeconds = 60,
  } = options || {};

  // Try to load session from storage
  let currentSession: Session | null = null;

  // Helper to persist session to storage
  const saveSessionToStorage = (session: Session): void => {
    try {
      storage.setItem(storageKey, JSON.stringify(session));
      currentSession = session;
    } catch (error) {
      console.warn('Failed to save session to storage:', error);
    }
  };

  // Variable to track token expiration time
  let tokenExpiresAt = 0;

  return (axiosInstance: AxiosInstance): void => {
    axiosInstance.interceptors.request.use(
      async (config) => {
        config.headers = config.headers || {};

        try {
          if ('Authorization' in config.headers) {
            delete config.headers['Authorization'];
            return config;
          }

          // If calling /token, don't refresh token to avoid infinite loops
          if (config.url === '/token') {
            return config;
          }

          // Always get the latest session from storage
          try {
            const storedSession = storage.getItem(storageKey);
            if (storedSession) {
              const parsedSession = JSON.parse(storedSession) as Session;
              // Always use stored session if it has valid tokens
              if (parsedSession.accessToken && parsedSession.refreshToken) {
                currentSession = parsedSession;
                tokenExpiresAt = extractTokenExpiration(currentSession.accessToken);
              }
            }
          } catch (error) {
            console.warn('Failed to load session from storage:', error);
          }

          // If we don't have a session, cannot add authorization header
          if (!currentSession) {
            return config;
          }

          const currentTime = Date.now();

          // Check if token is expired or about to expire (within marginSeconds)
          if (tokenExpiresAt - currentTime < marginSeconds * 1000) {
            // Token is about to expire, refresh it
            if (currentSession && currentSession.refreshToken) {
              try {
                const refreshResponse = await authClient.axios.post('/token', {
                  refreshToken: currentSession.refreshToken
                });

                if (refreshResponse.data) {
                  // Make sure response data has the right shape before updating
                  const sessionData = refreshResponse.data as Session;
                  currentSession = sessionData;
                  // Update expiration time for the new token
                  tokenExpiresAt = extractTokenExpiration(sessionData.accessToken);
                  saveSessionToStorage(sessionData);
                }
              } catch (error) {
                console.error('Error refreshing token:', error);
              }
            }
          }

          // Add authorization header if we have a session
          if (currentSession?.accessToken) {
            config.headers['Authorization'] = `Bearer ${currentSession.accessToken}`;
          }
        } catch (error) {
          console.error('Error in token refresh interceptor:', error);
        }

        return config;
      },
      (error) => Promise.reject(error)
    );
  };
};
