/**
 * @fileoverview Auth token refresh middleware for the Nhost SDK.
 *
 * This module provides middleware functionality to automatically refresh
 * authentication tokens before they expire, ensuring seamless API access
 * without requiring manual token refresh by the application.
 */

import type { Client, ErrorResponse, FetchResponse, Session } from "./auth";
import { type SessionStorageInterface } from "./sessionStorage";
import { type ChainFunction, type FetchFunction } from "./fetch";

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
// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
 * Configuration options for the session refresh middleware
 */
export type SessionRefreshOptions = {
  /**
   * Number of seconds before token expiration when a refresh should be triggered.
   * Default is 60 seconds (1 minute).
   */
  marginSeconds?: number;
};

/**
 * Creates a fetch middleware that automatically refreshes authentication tokens.
 *
 * This middleware:
 * 1. Checks if the current token is about to expire
 * 2. If so, uses the refresh token to obtain a new access token
 *
 * The middleware handles token refresh transparently, so the application
 * doesn't need to manually refresh tokens.
 *
 * @param authClient - Auth API client for token refresh operations
 * @param storage - Storage implementation for persisting session data
 * @param options - Configuration options for token refresh behavior
 * @returns A middleware function that can be used in the fetch chain
 */
export const createSessionRefreshMiddleware = (
  authClient: Client,
  storage: SessionStorageInterface,
  options?: SessionRefreshOptions,
): ChainFunction => {
  const { marginSeconds = 60 } = options || {};

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

        // Continue with the fetch chain
        return next(url, options);
      } catch (error) {
        console.error("Error in token refresh chain:", error);
        // Continue with the request even if token refresh fails
        return next(url, options);
      }
    };
  };
};

/**
 * Performs the actual token refresh operation using the auth client
 *
 * @param authClient - Auth API client to use for token refresh
 * @param storage - Storage implementation for persisting the new session
 * @param refreshToken - Current refresh token to use
 * @returns A new session if refresh was successful, null otherwise
 */
async function refreshToken(
  authClient: Client,
  storage: SessionStorageInterface,
  refreshToken: string,
): Promise<Session | null> {
  try {
    const refreshResponse = await authClient.refreshToken({ refreshToken });
    storage.set(refreshResponse.body);
    return refreshResponse.body;
  } catch (error) {
    const err = error as FetchResponse<ErrorResponse>;
    if (err.status === 401) {
      storage.remove();
    }
    return null;
  }
}

/**
 * Determines if token handling should be skipped for this request
 *
 * @param url - Request URL
 * @param options - Request options
 * @param authApiUrl - Base URL for auth API
 * @returns True if token handling should be skipped, false otherwise
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
 * Checks if a token is expiring soon and needs to be refreshed
 *
 * @param expiresAt - Token expiration timestamp in milliseconds
 * @param marginSeconds - Number of seconds before expiration to trigger refresh
 * @returns True if token is expiring soon, false otherwise
 */
function isTokenExpiringSoon(
  expiresAt: number,
  marginSeconds: number,
): boolean {
  const currentTime = Date.now();
  console.log(`token epires in ${(expiresAt - currentTime) / 1000} seconds`);
  console.log(
    `is token expiring soon? ${(expiresAt - currentTime) / 1000 < marginSeconds}`,
  );
  return expiresAt - currentTime < marginSeconds * 1000;
}
