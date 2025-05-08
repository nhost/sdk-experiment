import { createAPIClient as createAuthClient } from "./auth";
import { createAPIClient as createStorageClient } from "./storage";
import { createAPIClient as createGraphQLClient } from "./graphql";
import {
  type StorageInterface,
  detectStorage,
  DEFAULT_SESSION_KEY,
  CookieStorage,
  LocalStorage,
  MemoryStorage,
} from "./auth/storage";
import type { Session } from "./auth";
import { createSessionRefreshMiddleware } from "./auth/middlewareRefreshSession";
import { createSessionResponseMiddleware } from "./auth/middlewareResponseSession";

import type {
  GraphQLRequest,
  GraphQLResponse,
  GraphQLVariables,
  GraphQLError,
} from "./graphql/client";

// Re-export storage utilities
export { detectStorage, DEFAULT_SESSION_KEY };

// Re-export storage classes
export { CookieStorage, LocalStorage, MemoryStorage };

// Re-export types
export type { StorageInterface, Session };

// Re-export GraphQL types
export type { GraphQLRequest, GraphQLResponse, GraphQLVariables, GraphQLError };

/**
 * Generates a base URL for a Nhost service based on configuration
 * @param serviceType - Type of service (auth, storage, graphql)
 * @param customUrl - Custom URL override if provided
 * @param subdomain - Nhost project subdomain
 * @param region - Nhost region
 * @returns The base URL for the service
 */
export const generateServiceUrl = (
  serviceType: "auth" | "storage" | "graphql",
  customUrl?: string,
  subdomain?: string,
  region?: string,
): string => {
  if (customUrl) {
    return customUrl;
  } else if (subdomain && region) {
    return `https://${subdomain}.${serviceType}.${region}.nhost.run/v1`;
  } else if (subdomain) {
    return `https://${subdomain}.${serviceType}.nhost.run/v1`;
  } else {
    return `https://local.${serviceType}.local.nhost.run/v1`;
  }
};

export interface NhostClientOptions {
  /**
   * Nhost project subdomain (e.g., 'abcdefgh')
   */
  subdomain?: string;

  /**
   * Nhost region (e.g., 'eu-central-1')
   */
  region?: string;

  /**
   * Complete base URL for the auth service (overrides subdomain/region)
   */
  authUrl?: string;

  /**
   * Complete base URL for the storage service (overrides subdomain/region)
   */
  storageUrl?: string;

  /**
   * Complete base URL for the GraphQL service (overrides subdomain/region)
   */
  graphqlUrl?: string;

  /**
   * Storage implementation to use for session persistence
   */
  storage?: StorageInterface;
}

export class NhostClient {
  auth: ReturnType<typeof createAuthClient>;
  storage: ReturnType<typeof createStorageClient>;
  graphql: ReturnType<typeof createGraphQLClient>;
  sessionStorage: StorageInterface;

  /**
   * Create a new Nhost client
   * @param options - Configuration options for the client
   */
  constructor(options: NhostClientOptions = {}) {
    const {
      subdomain,
      region,
      authUrl,
      storageUrl,
      graphqlUrl,
      storage = detectStorage(),
    } = options;

    // Store storage references for future use
    this.sessionStorage = storage;

    // Determine base URLs for each service
    const authBaseUrl = generateServiceUrl("auth", authUrl, subdomain, region);
    const storageBaseUrl = generateServiceUrl(
      "storage",
      storageUrl,
      subdomain,
      region,
    );
    const graphqlBaseUrl = generateServiceUrl(
      "graphql",
      graphqlUrl,
      subdomain,
      region,
    );

    this.auth = createAuthClient(authBaseUrl);
    const refreshToken = createSessionRefreshMiddleware(this.auth, storage);
    this.auth.pushChainFunction(refreshToken);
    this.auth.pushChainFunction(createSessionResponseMiddleware(storage));

    this.storage = createStorageClient(storageBaseUrl, [refreshToken]);
    this.graphql = createGraphQLClient(graphqlBaseUrl, [refreshToken]);
  }

  /**
   * Get the current session from storage
   * @returns The current session or null if no session exists
   */
  getUserSession(): Session | null {
    return this.sessionStorage.get();
  }

  /**
   * Refresh the session using the current refresh token
   * in the storage and update the storage with the new session
   * @returns The new session or an error if the refresh fails
   */
  async refreshSession(): Promise<Session | null> {
    const session = this.sessionStorage.get();
    if (!session) {
      throw new Error("No session found");
    }

    const response = await this.auth.refreshToken({
      refreshToken: session.refreshToken,
    });

    this.sessionStorage.set(response.data);

    return response.data;
  }
}

/**
 * Create a new Nhost client
 * @param options - Configuration options for the client
 * @returns A configured Nhost client
 */
export function createClient(options: NhostClientOptions = {}): NhostClient {
  return new NhostClient(options);
}
