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
 * const resp = await nhost.storage.uploadFiles({
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
import { type SessionStorageInterface, detectStorage } from "./auth/storage";
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
  storage?: SessionStorageInterface;
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
  sessionStorage: SessionStorageInterface;

  /**
   * Create a new Nhost client. This constructor is reserved for advanced use cases.
   * For typical usage, use createClient instead.
   *
   * @param auth - Authentication client
   * @param storage - Storage client
   * @param graphql - GraphQL client
   * @param sessionStorage - Storage implementation for session persistence
   */
  constructor(
    auth: ReturnType<typeof createAuthClient>,
    storage: ReturnType<typeof createStorageClient>,
    graphql: ReturnType<typeof createGraphQLClient>,
    sessionStorage: SessionStorageInterface,
  ) {
    this.auth = auth;
    this.storage = storage;
    this.graphql = graphql;
    this.sessionStorage = sessionStorage;
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

  /**
   * Clear the session from storage
   */
  async clearSession(): Promise<void> {
    this.sessionStorage.remove();
  }
}

/**
 * Creates and configures a new Nhost client instance
 *
 * This is the recommended way to initialize the Nhost SDK in your application.
 *
 * @param options - Configuration options for the client
 * @returns A configured Nhost client
 */
export function createClient(options: NhostClientOptions = {}): NhostClient {
  const {
    subdomain,
    region,
    authUrl,
    storageUrl,
    graphqlUrl,
    storage = detectStorage(),
  } = options;

  // Determine base URLs for each service
  const authBaseUrl = generateServiceUrl("auth", subdomain, region, authUrl);
  const storageBaseUrl = generateServiceUrl(
    "storage",
    subdomain,
    region,
    storageUrl,
  );
  const graphqlBaseUrl = generateServiceUrl(
    "graphql",
    subdomain,
    region,
    graphqlUrl,
  );

  // Create auth client
  const auth = createAuthClient(authBaseUrl);

  // Setup middleware
  const refreshToken = createSessionRefreshMiddleware(auth, storage);
  auth.pushChainFunction(refreshToken);
  auth.pushChainFunction(createSessionResponseMiddleware(storage));

  // Create storage and graphql clients with the refresh middleware
  const storageClient = createStorageClient(storageBaseUrl, [refreshToken]);
  const graphqlClient = createGraphQLClient(graphqlBaseUrl, [refreshToken]);

  // Return an initialized NhostClient
  return new NhostClient(auth, storageClient, graphqlClient, storage);
}
