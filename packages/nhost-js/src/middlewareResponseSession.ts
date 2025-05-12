/**
 * @fileoverview Session response middleware for the Nhost SDK.
 *
 * This module provides middleware functionality to automatically extract
 * and persist session information from authentication responses, ensuring
 * that new sessions are properly stored after sign-in operations.
 */

import { type Session } from "./auth";
import { type SessionStorageInterface } from "./sessionStorage";
import { type ChainFunction } from "./fetch";

/**
 * Creates a fetch middleware that automatically extracts and stores session data from API responses.
 *
 * This middleware:
 * 1. Monitors responses from authentication-related endpoints
 * 2. Extracts session information when present
 * 3. Stores the session in the provided storage implementation
 * 4. Handles session removal on sign-out
 *
 * This ensures that session data is always up-to-date in storage after operations
 * that create or invalidate sessions.
 *
 * @param storage - Storage implementation for persisting session data
 * @returns A middleware function that can be used in the fetch chain
 */
export const createSessionResponseMiddleware = (
  storage: SessionStorageInterface,
): ChainFunction => {
  /**
   * Helper function to extract session data from various response formats
   *
   * @param data - Response data to extract session from
   * @returns Session object if found, null otherwise
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sessionExtractor = function (body: any): Session | null {
    // Look for session in common response patterns
    const session =
      // Pattern: { session: {...} }
      (body?.session as Session) ||
      // Pattern: { data: { session: {...} } }
      (body?.data?.session as Session) ||
      // Pattern: { accessToken, refreshToken, ... } where data itself is the session
      (body?.accessToken && body?.refreshToken && (body as Session)) ||
      null;

    return session;
  };

  return (next: (url: string, options?: RequestInit) => Promise<Response>) => {
    return async (url: string, options?: RequestInit) => {
      // Call the next middleware in the chain
      const response = await next(url, options);

      try {
        // Check if this is a logout request
        if (url.endsWith("/signout")) {
          // Remove session on sign-out
          storage.remove();
          return response;
        }

        // Check if this is an auth-related endpoint that might return session data
        if (
          url.endsWith("/token") ||
          url.includes("/signin/") ||
          url.includes("/signup/")
        ) {
          // Clone the response to avoid consuming it
          const clonedResponse = response.clone();

          // Parse the JSON data
          const body = await clonedResponse.json().catch(() => null);

          if (body) {
            // Extract session data from response using provided extractor
            const session = sessionExtractor(body);

            // If session data is found, store it
            if (session && session.accessToken && session.refreshToken) {
              storage.set(session);
            }
          }
        }
      } catch (error) {
        console.warn("Error in session response middleware:", error);
      }

      // Return the original response
      return response;
    };
  };
};
