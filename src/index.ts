import { createApiClient as createAuthClient } from './auth/client';
import { createApiClient as createStorageClient } from './storage/client';
import { 
  StorageInterface, 
  detectStorage, 
  DEFAULT_SESSION_KEY,
  BrowserStorage,
  MemoryStorage
} from './auth/storage';
import { 
  createTokenRefreshInterceptor 
} from './auth/token-interceptor';
import { 
  createSessionResponseInterceptor 
} from './auth/response-interceptor';

// Re-export storage utilities
export { 
  StorageInterface, 
  BrowserStorage, 
  MemoryStorage, 
  detectStorage, 
  DEFAULT_SESSION_KEY 
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
      storage = detectStorage(),
      storageKey = DEFAULT_SESSION_KEY,
    } = options;

    // Determine base URLs
    let authBaseUrl: string;
    let storageBaseUrl: string;

    if (authUrl) {
      authBaseUrl = authUrl;
    } else if (subdomain && region) {
      authBaseUrl = `https://${subdomain}.auth.${region}.nhost.run/v1`;
    } else if (subdomain) {
      authBaseUrl = `https://${subdomain}.auth.nhost.run/v1`;
    } else {
      authBaseUrl = 'https://local.auth.local.nhost.run/v1';
    }

    if (storageUrl) {
      storageBaseUrl = storageUrl;
    } else if (subdomain && region) {
      storageBaseUrl = `https://${subdomain}.storage.${region}.nhost.run/v1`;
    } else if (subdomain) {
      storageBaseUrl = `https://${subdomain}.storage.nhost.run/v1`;
    } else {
      storageBaseUrl = 'https://local.storage.local.nhost.run/v1';
    }

    // Create client instances
    this.auth = createAuthClient({
      baseURL: authBaseUrl
    });

    this.storage = createStorageClient({
      baseURL: storageBaseUrl
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

    // Apply interceptors to both clients
    tokenRefreshInterceptor(this.auth.axios);
    tokenRefreshInterceptor(this.storage.axios);
    sessionResponseInterceptor(this.auth.axios);
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