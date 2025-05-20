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
 * You can import and use this package with:
 *
 * ```ts
 * import { createClient } from "@nhost/nhost-js";
 * ```
 *
 * and use it like:
 *
 * {@includeCode ./__tests__/docstrings.test.ts#mainExample}
 *
 * ## Error handling
 *
 * The SDK will throw errors on most operations if the request returns a non-2xx status code or
 * if the request fails entirely (i.e., due to network errors). A continuation you can see
 * how you can handle errors thrown by the SDK.
 *
 * ### Auth
 *
 * {@includeCode ./__tests__/docstrings-auth.test.ts#errorHandling}
 *
 * ### Storage
 *
 * {@includeCode ./__tests__/docstrings-storage.test.ts#errorHandling}
 *
 * ### GraphQL
 *
 * {@includeCode ./__tests__/docstrings-graphql.test.ts#errorHandling}
 *
 * ### Functions
 *
 * {@includeCode ./__tests__/docstrings-functions.test.ts#errorHandling}
 *
 * @packageDocumentation
 */

import {
  createAPIClient as createAuthClient,
  type Client as AuthClient,
  type Session,
  type ErrorResponse,
} from "./auth";
import {
  type Client as StorageClient,
  createAPIClient as createStorageClient,
} from "./storage";
import {
  type Client as GraphQLClient,
  createAPIClient as createGraphQLClient,
} from "./graphql";
import {
  type Client as FunctionsClient,
  createAPIClient as createFunctionsClient,
} from "./functions";

import { type SessionStorageInterface, detectStorage } from "./sessionStorage";
import {
  extractTokenExpiration,
  createSessionRefreshMiddleware,
} from "./middlewareRefreshSession";
import { createAttachAccessTokenMiddleware } from "./middlewareAttachToken";
import { createSessionResponseMiddleware } from "./middlewareResponseSession";
import type { ChainFunction, FetchResponse } from "./fetch";

export {
  type SessionStorageInterface,
  DEFAULT_SESSION_KEY,
  LocalStorage,
  MemoryStorage,
  CookieStorage,
} from "./sessionStorage";

export {
  type SessionRefreshOptions,
  createSessionRefreshMiddleware,
} from "./middlewareRefreshSession";
export { createAttachAccessTokenMiddleware } from "./middlewareAttachToken";
export { createSessionResponseMiddleware } from "./middlewareResponseSession";

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
   * Nhost project subdomain (e.g., 'abcdefgh'). Used to construct the base URL for services for the Nhost cloud.
   */
  subdomain?: string;

  /**
   * Nhost region (e.g., 'eu-central-1'). Used to construct the base URL for services for the Nhost cloud.
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
   * Complete base URL for the functions service (overrides subdomain/region)
   */
  functionsUrl?: string;

  /**
   * Storage implementation to use for session persistence. If not provided, the SDK will
   * default to localStorage in the browser or memory in other environments.
   */
  storage?: SessionStorageInterface;

  /**
   * Disable automatic session refresh. If set to true, the SDK will not attempt to refresh
   */
  disableAutoRefreshToken?: boolean;
}

/**
 * Main client class that provides access to all Nhost services
 */
export class NhostClient {
  /**
   * Authentication client providing methods for user sign-in, sign-up, and session management
   */
  auth: AuthClient;

  /**
   * Storage client providing methods for file operations (upload, download, delete)
   */
  storage: StorageClient;

  /**
   * GraphQL client providing methods for executing GraphQL operations against your Hasura backend
   */
  graphql: GraphQLClient;

  /**
   * Functions client providing methods for invoking serverless functions
   */
  functions: FunctionsClient;

  /**
   * Storage implementation used for persisting session information
   */
  sessionStorage: SessionStorageInterface;

  /**
   * Create a new Nhost client. This constructor is reserved for advanced use cases.
   * For typical usage, use [createClient](#createclient) instead.
   *
   * @param auth - Authentication client
   * @param storage - Storage client
   * @param graphql - GraphQL client
   * @param functions - Functions client
   * @param sessionStorage - Storage implementation for session persistence
   */
  constructor(
    auth: AuthClient,
    storage: StorageClient,
    graphql: GraphQLClient,
    functions: FunctionsClient,
    sessionStorage: SessionStorageInterface,
  ) {
    this.auth = auth;
    this.storage = storage;
    this.graphql = graphql;
    this.functions = functions;
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
   * in the storage and update the storage with the new session.
   * @param marginSeconds - The number of seconds before the token expiration to refresh the session. If the token is still valid for this duration, it will not be refreshed. Set to 0 to force the refresh.
   *
   * @returns The new session or null if there is currently no session or if refresh fails
   */
  async refreshSession(marginSeconds = 60): Promise<Session | null> {
    return refreshSession(this.auth, this.sessionStorage, marginSeconds);
  }

  /**
   * Clear the session from storage
   */
  clearSession(): void {
    this.sessionStorage.remove();
  }
}

function getMiddlewareChain(
  auth: AuthClient,
  storage: SessionStorageInterface,
  autoRefresh: boolean,
): ChainFunction[] {
  const mwChain = [
    createSessionResponseMiddleware(storage),
    createAttachAccessTokenMiddleware(storage),
  ];
  if (autoRefresh) {
    // we need to process this one first to make sure any following middlewares
    // run after the session has been refreshed
    mwChain.unshift(
      createSessionRefreshMiddleware(refreshSession, auth, storage),
    );
  }
  return mwChain;
}

/**
 * Creates and configures a new Nhost client instance.
 *
 * This helper method instantiates a fully configured Nhost client by:
 * - Instantiating the various service clients (auth, storage, functions and graphql)
 * - Configuring a session storage if none is provided
 * - Setting up the necessary middleware for automatic session management:
 *   - Automatically attaching the authorization token to requests
 *   - Refreshing the session when it expires
 *   - Applying session tokens to function calls
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
    functionsUrl,
    storage = detectStorage(),
    disableAutoRefreshToken = false,
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

  const functionsBaseUrl = generateServiceUrl(
    "functions",
    subdomain,
    region,
    functionsUrl,
  );

  // Create auth client
  const auth = createAuthClient(authBaseUrl);

  const mwChain = getMiddlewareChain(auth, storage, !disableAutoRefreshToken);

  for (const mw of mwChain) {
    auth.pushChainFunction(mw);
  }

  // Create storage and graphql clients with the refresh and attach token middlewares
  const storageClient = createStorageClient(storageBaseUrl, mwChain);
  const graphqlClient = createGraphQLClient(graphqlBaseUrl, mwChain);
  const functionsClient = createFunctionsClient(functionsBaseUrl, mwChain);

  // Return an initialized NhostClient
  return new NhostClient(
    auth,
    storageClient,
    graphqlClient,
    functionsClient,
    storage,
  );
}

const refreshSession = async (
  auth: AuthClient,
  storage: SessionStorageInterface,
  marginSeconds = 60,
): Promise<Session | null> => {
  try {
    return await _refreshSession(auth, storage, marginSeconds);
  } catch (error) {
    try {
      // we retry the refresh token in case of transient error
      // or race conditions
      console.warn("error refreshing session, retrying:", error);
      return await _refreshSession(auth, storage, marginSeconds);
    } catch (error) {
      const errResponse = error as FetchResponse<ErrorResponse>;
      if (errResponse?.status === 401) {
        // this probably means the refresh token is invalid
        console.error("session probably expired");
        storage.remove();
      }
      return null;
    }
  }
};

const _refreshSession = async (
  auth: AuthClient,
  storage: SessionStorageInterface,
  marginSeconds = 60,
): Promise<Session | null> => {
  // we do a quick check with a shared lock to see if we need to refresh
  const { session, needsRefresh } = await navigator.locks.request(
    "nhostSessionLock",
    { mode: "shared" },
    async () => {
      return _needsRefresh(storage, marginSeconds);
    },
  );

  if (!session) {
    return null; // No session found
  }

  if (!needsRefresh) {
    return session; // No need to refresh
  }

  // as we probably need to refresh now we get an exclusive lock
  const refreshedSession: Session = await navigator.locks.request(
    "nhostSessionLock",
    { mode: "exclusive" },
    async () => {
      // we check again if we need to refresh as there is a small chance
      // someone may have done it while acquiring the exclusive lock
      const { session, needsRefresh, sessionExpired } = _needsRefresh(
        storage,
        marginSeconds,
      );

      if (!session) {
        return null; // No session found
      }

      if (!needsRefresh) {
        return session; // No need to refresh
      }

      try {
        const response = await auth.refreshToken({
          refreshToken: session.refreshToken,
        });
        storage.set(response.body);

        return response.body;
      } catch (error) {
        if (!sessionExpired) {
          // If the session is not expired, we can still use the current session
          // so there is no need to error for now
          return session;
        }

        // we throw the error so the caller can handle it
        throw error;
      }
    },
  );

  return refreshedSession;
};

const _needsRefresh = (
  storage: SessionStorageInterface,
  marginSeconds = 60,
) => {
  const session = storage.get();
  if (!session) {
    return { session: null, needsRefresh: false, sessionExpired: false };
  }

  const tokenExpiresAt = extractTokenExpiration(session?.accessToken || "");
  const currentTime = Date.now();

  if (tokenExpiresAt - currentTime > marginSeconds * 1000) {
    return { session, needsRefresh: false, sessionExpired: false };
  }

  return {
    session,
    needsRefresh: true,
    sessionExpired: tokenExpiresAt < currentTime,
  };
};
