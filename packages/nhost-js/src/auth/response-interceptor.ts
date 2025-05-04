import { AxiosInstance, AxiosResponse } from 'axios';
import { Session } from './client';
import { StorageInterface, detectStorage, DEFAULT_SESSION_KEY } from './storage';

/**
 * Options for session response interceptor
 */
export interface SessionResponseInterceptorOptions {
  /** Storage implementation to use for session persistence */
  storage?: StorageInterface;
  /** Key to use for storing session data */
  storageKey?: string;
  /** Function to extract session from responses */
  sessionExtractor?: (response: AxiosResponse) => Session | null;
}

/**
 * Creates an axios interceptor that stores session data from responses
 * @param options - Configuration options for the interceptor
 * @returns A function to attach the interceptor to an axios instance
 */
export const createSessionResponseInterceptor = (
  options?: SessionResponseInterceptorOptions
) => {
  const {
    storage = detectStorage(),
    storageKey = DEFAULT_SESSION_KEY,
    sessionExtractor = defaultSessionExtractor
  } = options || {};

  // Default function to extract session from response data
  function defaultSessionExtractor(response: AxiosResponse): Session | null {
    // Look for session in common response patterns
    const session =
      // Pattern: { data: { session: {...} } }
      (response.data?.session as Session) ||
      // Pattern: { data: { data: { session: {...} } } }
      (response.data?.data?.session as Session) ||
      // Pattern: { data: {...} } where data is the session
      (
        response.data?.accessToken &&
        response.data?.refreshToken &&
        response.data as Session
      ) ||
      null;

    return session;
  }

  return (axiosInstance: AxiosInstance): void => {
    axiosInstance.interceptors.response.use(
      (response) => {
        try {
          if (response.config.url === '/signout') {
            // If logout is successful, delete session from storage
            storage.removeItem(storageKey);
            return response;
          }

          // Extract session data from response using provided extractor
          const session = sessionExtractor(response);

          // If session data is found, store it
          if (session && session.accessToken && session.refreshToken) {
            storage.setItem(storageKey, JSON.stringify(session));
          }
        } catch (error) {
          console.warn('Error in session response interceptor:', error);
        }

        return response;
      },
      (error) => Promise.reject(error)
    );
  };
};
