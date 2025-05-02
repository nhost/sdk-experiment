import { createApiClient as createAuthClient } from './auth/client';
import { createApiClient as createStorageClient } from './storage/client';
import { createApiClient as createGraphQLClient } from './graphql/client';
import {
  StorageInterface,
  detectStorage,
  DEFAULT_SESSION_KEY,
  CookieStorage,
  LocalStorage,
  MemoryStorage
} from './auth/storage';
import {
  createTokenRefreshInterceptor
} from './auth/token-interceptor';
import {
  createSessionResponseInterceptor
} from './auth/response-interceptor';
import type { Session } from './auth/client';
import type {
  GraphQLRequest,
  GraphQLResponse,
  GraphQLVariables,
  GraphQLError
} from './graphql/client';

// Re-export storage utilities
export {
  detectStorage,
  DEFAULT_SESSION_KEY
};

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
  serviceType: 'auth' | 'storage' | 'graphql',
  customUrl?: string,
  subdomain?: string,
  region?: string
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

  /**
   * Key to use for storing session data
   */
  storageKey?: string;
}

export class NhostClient {
  auth: ReturnType<typeof createAuthClient>;
  storage: ReturnType<typeof createStorageClient>;
  graphql: ReturnType<typeof createGraphQLClient>;
  private _storage: StorageInterface;
  private _storageKey: string;

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
      storageKey = DEFAULT_SESSION_KEY,
    } = options;

    // Store storage references for future use
    this._storage = storage;
    this._storageKey = storageKey;

    // Determine base URLs for each service
    const authBaseUrl = generateServiceUrl('auth', authUrl, subdomain, region);
    const storageBaseUrl = generateServiceUrl('storage', storageUrl, subdomain, region);
    const graphqlBaseUrl = generateServiceUrl('graphql', graphqlUrl, subdomain, region);

    // Create client instances
    this.auth = createAuthClient({
      baseURL: authBaseUrl
    });

    this.storage = createStorageClient({
      baseURL: storageBaseUrl
    });

    this.graphql = createGraphQLClient({
      baseURL: graphqlBaseUrl
    });

    // Set up interceptors for authentication
    const tokenRefreshInterceptor = createTokenRefreshInterceptor(
      this.auth,
      {
        storage,
        storageKey
      }
    );

    const sessionResponseInterceptor = createSessionResponseInterceptor({
      storage,
      storageKey
    });

    // Apply interceptors to all clients
    tokenRefreshInterceptor(this.auth.axios);
    tokenRefreshInterceptor(this.storage.axios);
    tokenRefreshInterceptor(this.graphql.axios);
    sessionResponseInterceptor(this.auth.axios);
  }

  /**
   * Get the current session from storage
   * @returns The current session or null if no session exists
   */
  getUserSession(): Session | null {
    try {
      const storedSession = this._storage.getItem(this._storageKey);
      if (storedSession) {
        return JSON.parse(storedSession) as Session;
      }
    } catch (error) {
      console.warn('Failed to get session from storage:', error);
    }
    return null;
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
