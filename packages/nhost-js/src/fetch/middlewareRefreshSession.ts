/**
 * @fileoverview Auth token refresh middleware for the Nhost SDK.
 *
 * This module provides middleware functionality to automatically refresh
 * authentication tokens before they expire, ensuring seamless API access
 * without requiring manual token refresh by the application.
 */

import type { Client, Session } from "../auth";
import type { ChainFunction, FetchFunction } from "./fetch";
import type { SessionStorage } from "../sessionStorage";

interface JWTToken {
  exp: number;
}

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
      return 0;
    }

    // At this point, we know parts has exactly 3 elements
    // Use a non-null assertion or check explicitly
    const payloadPart = parts[1];
    if (!payloadPart) {
      return 0;
    }

    // Decode the payload (middle part)
    const base64 = payloadPart.replace(/-/g, "+").replace(/_/g, "/");
    const payload = decodeTokenPayload(base64) as JWTToken;

    if (payload.exp) {
      // exp claim is in seconds, convert to milliseconds
      return payload.exp * 1000;
    } else {
      return 0;
    }
  } catch {
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
}

/**
 * Configuration options for the session refresh middleware
 */
export interface SessionRefreshOptions {
  /**
   * Number of seconds before token expiration when a refresh should be triggered.
   * Default is 60 seconds (1 minute).
   */
  marginSeconds?: number;
}

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
  refreshSession: (
    auth: Client,
    storage: SessionStorage,
    marginSeconds: number,
  ) => Promise<Session | null>,
  auth: Client,
  storage: SessionStorage,
  options?: SessionRefreshOptions,
): ChainFunction => {
  const { marginSeconds = 60 } = options || {};

  // Create and return the chain function
  return (next: FetchFunction): FetchFunction =>
    async (url: string, options: RequestInit = {}): Promise<Response> => {
      // Skip token handling for certain requests
      if (shouldSkipTokenHandling(url, options)) {
        return next(url, options);
      }

      try {
        await refreshSession(auth, storage, marginSeconds);
      } catch {
        // do nothing, we still want to call the next function
      }
      return next(url, options);
    };
};

/**
 * Determines if token handling should be skipped for this request
 *
 * @param url - Request URL
 * @param options - Request options
 * @param authApiUrl - Base URL for auth API
 * @returns True if token handling should be skipped, false otherwise
 */
function shouldSkipTokenHandling(url: string, options: RequestInit): boolean {
  const headers = new Headers(options.headers || {});

  // If Authorization header is explicitly set, skip token handling
  if (headers.has("Authorization")) {
    return true;
  }

  // If calling the token endpoint, skip to avoid infinite loops
  if (url.endsWith("/v1/token")) {
    return true;
  }

  return false;
}
