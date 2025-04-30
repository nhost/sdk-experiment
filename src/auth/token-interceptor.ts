import { AxiosInstance } from 'axios';
import { createApiClient, Session, RefreshTokenRequest } from './auth';

interface JwtPayload {
  exp: number;
  [key: string]: any;
}

/**
 * Decodes a JWT token to extract its payload
 * @param token - JWT token string
 * @returns Decoded token payload
 */
function decodeJwt(token: string): JwtPayload {
  // JWT has 3 parts: header.payload.signature
  const parts = token.split('.');
  if (parts.length !== 3) {
    throw new Error('Invalid JWT token format');
  }

  // Base64 decode the payload (middle part)
  const payload = parts[1];
  const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  );

  return JSON.parse(jsonPayload);
}

/**
 * Creates an axios interceptor that automatically refreshes tokens when they're about to expire
 * @param baseURL - Auth API base URL (e.g., "https://local.auth.local.nhost.run/v1")
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

  return (axiosInstance: AxiosInstance): void => {
    axiosInstance.interceptors.request.use(
      async (config) => {
        config.headers = config.headers || {};

        try {
          // Check if token exists
          if (!currentSession.accessToken) {
            return config;
          }

          // Decode token to check expiration
          const decoded = decodeJwt(currentSession.accessToken);
          const currentTime = Math.floor(Date.now() / 1000);

          // Check if token is expired or about to expire (within marginSeconds)
          if (decoded.exp - currentTime < marginSeconds) {
            // Token is about to expire, refresh it
            if (currentSession.refreshToken) {
              const refreshResponse = await authClient.postToken({
                refreshToken: currentSession.refreshToken
              });

              if (refreshResponse.data) {
                // Update the current session with new tokens
                currentSession = refreshResponse.data;
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
