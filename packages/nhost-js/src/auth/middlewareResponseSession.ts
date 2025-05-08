import { type Session } from "./client";
import { type StorageInterface } from "./storage";
import { type ChainFunction } from "../fetch";

/**
 * Creates a fetch middleware that stores session data from responses
 * @param options - Configuration options for the middleware
 * @returns A chain function to be used with createEnhancedFetch
 */
export const createSessionResponseMiddleware = (
  storage: StorageInterface,
): ChainFunction => {
  return (next: (url: string, options?: RequestInit) => Promise<Response>) => {
    return async (url: string, options?: RequestInit) => {
      // Call the next middleware in the chain
      const response = await next(url, options);

      try {
        // Check if this is a logout request
        if (url.endsWith("/signout")) {
          storage.remove();
          return response;
        }

        if (
          url.endsWith("/token") ||
          url.includes("/signin/") ||
          url.includes("/signup/")
        ) {
          // Clone the response to avoid consuming it
          const clonedResponse = response.clone();

          // Parse the JSON data
          const data = await clonedResponse.json().catch(() => null);

          if (data) {
            // Extract session data from response using provided extractor
            const session = (data?.session as Session) || null;

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
