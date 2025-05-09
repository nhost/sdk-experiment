/**
 * Main entry point for the Nhost JavaScript SDK.
 *
 * This package provides a unified client for interacting with Nhost services:
 * - Authentication
 * - Storage
 * - GraphQL
 * - Functions
 *
 * @example
 * You can import and use this package in your project with:
 *
 * ```ts
 * import { createClient } from '@nhost/nhost-js';
 *
 * const nhost = createClient({
 *   subdomain: 'your-project',
 *   region: 'eu-central-1'
 * });
 *
 * // Sign in with email/password
 * // This will create a session and persist it in the storage
 * // Subsequent calls will use the session from the storage
 * // If the session is about to expire, it will be refreshed
 * // automatically
 * await nhost.auth.signInEmailPassword({
 *   email: 'user@example.com',
 *   password: 'password123'
 * });
 *
 * const { data } = await nhost.graphql.query({
 *   query: `
 *     query {
 *       users {
 *         id
 *         displayName
 *       }
 *     }
 *   `
 * });
 *
 * console.log(data);
 *
 * const resp = await nhostStorage.uploadFiles({
 *   "file[]": [
 *     new Blob(["test1"], { type: "text/plain" }),
 *     new Blob(["test2 is larger"], { type: "text/plain" }),
 *   ],
 * });
 *
 * console.log(resp);
 * ```
 *
 * @packageDocumentation
 */

import { createAPIClient as createAuthClient } from "./auth";
import { createAPIClient as createStorageClient } from "./storage";
import { createAPIClient as createGraphQLClient } from "./graphql";
import { type StorageInterface, detectStorage } from "./auth/storage";
import type { Session } from "./auth";
import { createSessionRefreshMiddleware } from "./auth/middlewareRefreshSession";
import { createSessionResponseMiddleware } from "./auth/middlewareResponseSession";

/**
 * Generates a base URL for a Nhost service based on configuration
 *
 * @param serviceType - Type of service (auth, storage, graphql, functions)
 * @param subdomain - Nhost project subdomain
 * @param region - Nhost region
 * @param customUrl - Custom URL override if provided
 * @returns The base URL for the service
 *
 * @internal
 */
export const generateServiceUrl = (
  serviceType: "auth" | "storage" | "graphql" | "functions",
  subdomain?: string,
  region?: string,
  customUrl?: string,
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

/**
 * Configuration options for creating an Nhost client
 */
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

/**
 * Main client class that provides access to all Nhost services
 */
export class NhostClient {
  /**
   * Authentication client providing methods for user sign-in, sign-up, and session management
   */
  auth: ReturnType<typeof createAuthClient>;

  /**
   * Storage client providing methods for file operations (upload, download, delete)
   */
  storage: ReturnType<typeof createStorageClient>;

  /**
   * GraphQL client providing methods for executing GraphQL operations against your Hasura backend
   */
  graphql: ReturnType<typeof createGraphQLClient>;

  /**
   * Storage implementation used for persisting session information
   */
  sessionStorage: StorageInterface;

  /**
   * Create a new Nhost client
   *
   * @param options - Configuration options for the client
   *
   * @example
   * ```ts
   * const nhost = new NhostClient({
   *   subdomain: 'your-project',
   *   region: 'eu-central-1'
   * });
   * ```
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
   *
   * @returns The current session or null if no session exists
   *
   * @example
   * ```ts
   * const session = nhost.getUserSession();
   * if (session) {
   *   console.log('User is authenticated:', session.user.id);
   * } else {
   *   console.log('No active session');
   * }
   * ```
   */
  getUserSession(): Session | null {
    return this.sessionStorage.get();
  }

  /**
   * Refresh the session using the current refresh token
   * in the storage and update the storage with the new session
   *
   * @returns The new session or null if refresh fails
   * @throws Error if no session exists in storage
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
 * Creates and configures a new Nhost client instance
 *
 * This is the recommended way to initialize the Nhost SDK in your application.
 *
 * @param options - Configuration options for the client
 * @returns A configured Nhost client
 * ```
 */
export function createClient(options: NhostClientOptions = {}): NhostClient {
  return new NhostClient(options);
}
