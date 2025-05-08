import { createAPIClient, type Session } from "./client";
import { type StorageInterface, detectStorage } from "./storage";
import { type ChainFunction, type FetchFunction } from "../fetch";

/**
 * Extracts the expiration time from a JWT token
 * @param token - JWT token string
 * @returns Expiration timestamp in milliseconds, or 0 if unable to extract
 */
export const extractTokenExpiration = (token: string): number => {
  try {
    // JWT tokens are in the format header.payload.signature
    const parts = token.split(".");
    if (parts.length !== 3) {
      console.warn("Token does not have three parts");
      return 0;
    }

    // At this point, we know parts has exactly 3 elements
    // Use a non-null assertion or check explicitly
    const payloadPart = parts[1];
    if (!payloadPart) {
      console.warn("Payload part is empty");
      return 0;
    }

    // Decode the payload (middle part)
    const base64 = payloadPart.replace(/-/g, "+").replace(/_/g, "/");
    const payload = decodeTokenPayload(base64);

    if (payload.exp) {
      // exp claim is in seconds, convert to milliseconds
      return payload.exp * 1000;
    } else {
      console.warn("No exp claim found in token");
      return 0;
    }
  } catch (error) {
    console.warn("Failed to extract token expiration:", error);
    return 0;
  }
};

/**
 * Decodes a base64-encoded JWT payload
 * @param base64Payload - Base64-encoded payload
 * @returns Decoded payload as an object
 */
function decodeTokenPayload(base64Payload: string): any {
  try {
    let jsonPayload: string;

    if (typeof window !== "undefined") {
      // Browser environment
      jsonPayload = decodeURIComponent(
        window
          .atob(base64Payload)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join(""),
      );
    } else {
      // Node.js environment
      const buffer = Buffer.from(base64Payload, "base64");
      jsonPayload = buffer.toString("utf8");
    }

    return JSON.parse(jsonPayload);
  } catch (e) {
    console.warn("Error decoding token payload:", e);
    throw e;
  }
}

/**
 * Options for token refresh chain function
 */
export interface TokenRefreshOptions {
  /** Storage implementation to use for session persistence */
  storage?: StorageInterface;
  /** Seconds before expiration to trigger token refresh */
  marginSeconds?: number;
}

/**
 * Creates a fetch chain function that automatically refreshes tokens when they're about to expire
 * @param authClient - API client for authentication
 * @param options - Configuration options
 * @returns A chain function that handles token refresh
 */
export const createTokenRefreshChain = (
  authClient: ReturnType<typeof createAPIClient>,
  options?: TokenRefreshOptions,
): ChainFunction => {
  const { storage = detectStorage(), marginSeconds = 60 } = options || {};

  // Session state
  let currentSession: Session | null = null;
  let tokenExpiresAt = 0;

  // Create and return the chain function
  return (next: FetchFunction): FetchFunction => {
    return async (
      url: string,
      options: RequestInit = {},
    ): Promise<Response> => {
      // Skip token handling for certain requests
      if (shouldSkipTokenHandling(url, options, authClient.baseURL)) {
        return next(url, options);
      }

      try {
        // Get current session from storage
        currentSession = storage.get();

        if (currentSession?.accessToken) {
          tokenExpiresAt = extractTokenExpiration(currentSession.accessToken);
        }

        // If we don't have a session, proceed without authorization
        if (!currentSession) {
          return next(url, options);
        }

        // Check if token needs refresh
        if (isTokenExpiringSoon(tokenExpiresAt, marginSeconds)) {
          if (currentSession.refreshToken) {
            // Refresh the token
            const refreshedSession = await refreshToken(
              authClient,
              storage,
              currentSession.refreshToken,
            );

            if (refreshedSession) {
              currentSession = refreshedSession;
              tokenExpiresAt = extractTokenExpiration(
                refreshedSession.accessToken,
              );
              storage.set(refreshedSession);
            }
          }
        }

        // Add authorization header
        const newOptions = addAuthorizationHeader(options, currentSession);

        // Continue with the fetch chain
        return next(url, newOptions);
      } catch (error) {
        console.error("Error in token refresh chain:", error);
        // Continue with the request even if token refresh fails
        return next(url, options);
      }
    };
  };
};

async function refreshToken(
  authClient: ReturnType<typeof createAPIClient>,
  storage: StorageInterface,
  refreshToken: string,
): Promise<Session | null> {
  try {
    const refreshResponse = await authClient.refreshToken({ refreshToken });

    if (refreshResponse.status === 200) {
      const session = refreshResponse.data;
      storage.set(session);
      return session;
    }
    return null;
  } catch (error) {
    console.error("Error refreshing token:", error);
    return null;
  }
}

/**
 * Determines if token handling should be skipped for this request
 */
function shouldSkipTokenHandling(
  url: string,
  options: RequestInit,
  authApiUrl: string,
): boolean {
  const headers = new Headers(options.headers || {});

  // If Authorization header is explicitly set, skip token handling
  if (headers.has("Authorization")) {
    return true;
  }

  // If calling the token endpoint, skip to avoid infinite loops
  if (url === `${authApiUrl}/token`) {
    return true;
  }

  return false;
}

/**
 * Checks if a token is expiring soon
 */
function isTokenExpiringSoon(
  expiresAt: number,
  marginSeconds: number,
): boolean {
  const currentTime = Date.now();
  return expiresAt - currentTime < marginSeconds * 1000;
}

/**
 * Adds the Authorization header to the request options
 */
function addAuthorizationHeader(
  options: RequestInit,
  session: Session | null,
): RequestInit {
  if (!session?.accessToken) {
    return options;
  }

  const headers = new Headers(options.headers || {});
  headers.set("Authorization", `Bearer ${session.accessToken}`);

  return {
    ...options,
    headers,
  };
}
