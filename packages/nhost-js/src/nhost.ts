import {
  createAPIClient as createAuthClient,
  type Client as AuthClient,
  type Session,
} from "./auth";
import {
  createAPIClient as createStorageClient,
  type Client as StorageClient,
} from "./storage";
import {
  type Client as GraphQLClient,
  createAPIClient as createGraphQLClient,
} from "./graphql";
import {
  type Client as FunctionsClient,
  createAPIClient as createFunctionsClient,
} from "./functions";
import { generateServiceUrl } from "./";
import {
  type ChainFunction,
  attachAccessTokenMiddleware,
  updateSessionFromResponseMiddleware,
  sessionRefreshMiddleware,
} from "./fetch";
import {
  detectStorage,
  SessionStorage,
  type SessionStorageBackend,
  refreshSession,
} from "./session/";

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
  sessionStorage: SessionStorage;

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
    sessionStorage: SessionStorage,
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
   * Storage backend to use for session persistence. If not provided, the SDK will
   * default to localStorage in the browser or memory in other environments.
   */
  storage?: SessionStorageBackend;
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
  } = options;

  const sessionStorage = new SessionStorage(storage);

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

  const mwChain = getMiddlewareChain(auth, sessionStorage, true);

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
    sessionStorage,
  );
}

export interface NhostServerClientOptions extends NhostClientOptions {
  /**
   * Storage backend to use for session persistence. If not provided, the SDK will
   * default to localStorage in the browser or memory in other environments.
   */
  storage: SessionStorageBackend;
}

/**
 * Creates and configures a new Nhost client instance to be used on a server component or middleware.
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
export function createSSRClient(
  options: NhostServerClientOptions,
): NhostClient {
  const {
    subdomain,
    region,
    authUrl,
    storageUrl,
    graphqlUrl,
    functionsUrl,
    storage,
  } = options;
  const sessionStorage = new SessionStorage(storage);

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

  const mwChain = getMiddlewareChain(auth, sessionStorage, false);

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
    sessionStorage,
  );
}

function getMiddlewareChain(
  auth: AuthClient,
  storage: SessionStorage,
  autoRefresh: boolean,
): ChainFunction[] {
  const mwChain = [
    updateSessionFromResponseMiddleware(storage),
    attachAccessTokenMiddleware(storage),
  ];

  if (autoRefresh) {
    mwChain.unshift(sessionRefreshMiddleware(auth, storage));
  }

  return mwChain;
}
