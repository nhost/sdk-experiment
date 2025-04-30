import { AxiosInstance } from 'axios';
import { createApiClient, Session } from './auth';

/**
 * Creates an axios interceptor that automatically refreshes tokens when they're about to expire
 * @param authClient - Nhost Auth API client for authentication
 * @param session - Initial user session with accessToken and refreshToken
 * @param marginSeconds - Seconds before expiration to trigger refresh (default: 60)
 * @returns A function to attach the interceptor to an axios instance
 */
export const createTokenRefreshInterceptor = (
  authClient: ReturnType<typeof createApiClient>,
  session: Session,
  marginSeconds = 60
) => {
  let currentSession = { ...session };
  let tokenExpiresAt = Date.now() + (currentSession.accessTokenExpiresIn * 1000);

  return (axiosInstance: AxiosInstance): void => {
    axiosInstance.interceptors.request.use(
      async (config) => {
        config.headers = config.headers || {};

        try {
          // Check if token exists
          if (!currentSession.accessToken) {
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
              }
            }
          }

          // Always use the latest token
          config.headers['Authorization'] = `Bearer ${currentSession.accessToken}`;
        } catch (error) {
          console.error('Error in token refresh interceptor:', error);
        }

        return config;
      },
      (error) => Promise.reject(error)
    );
  };
};
