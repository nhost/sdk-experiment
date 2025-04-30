import { AxiosInstance } from 'axios';
import { createApiClient, Session } from './client';
import { StorageInterface, detectStorage, DEFAULT_SESSION_KEY } from './storage';

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
          if (config.headers['Authorization']) {
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
                tokenExpiresAt = Date.now() + (currentSession.accessTokenExpiresIn * 1000);
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
            if (currentSession.refreshToken) {
              const refreshResponse = await authClient.postToken({
                refreshToken: currentSession.refreshToken
              });

              if (refreshResponse.data) {
                // Update the current session with new tokens
                currentSession = refreshResponse.data;
                // Update the expiration time based on accessTokenExpiresIn
                tokenExpiresAt = Date.now() + (currentSession.accessTokenExpiresIn * 1000);
                // Persist the updated session
                saveSessionToStorage(currentSession);
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
