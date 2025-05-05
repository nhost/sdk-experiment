import { createClient } from 'nhost-js';
import { MemoryStorage } from 'nhost-js';
import { cookies } from 'next/headers';

/**
 * Creates an authenticated Nhost client for server-side usage.
 *
 * This function is specifically designed to be used in server components or API routes.
 * It retrieves authentication credentials from cookies and initializes an Nhost client
 * with those credentials, allowing server-side code to make authenticated requests
 * on behalf of the user.
 *
 * The function:
 * 1. Extracts the 'nhostSession' cookie containing user authentication data
 * 2. Initializes a MemoryStorage instance with this session data
 * 3. Creates and returns an Nhost client configured with this storage
 *
 * @returns {Promise<ReturnType<typeof createClient>>} An authenticated Nhost client instance
 */
export async function createServerNhostClient(): Promise<ReturnType<typeof createClient>> {
  // Get the cookie value using the async cookies() API
  const cookieStore = await cookies();

  // Initialize the client with the storage
  const nhost = createClient({
    region: 'local',
    subdomain: 'local',
    storage: {
      getItem: (key: string) => {
        return cookieStore.get(key)?.value || null;
      },
      setItem: (key: string, value: string) => {
        cookieStore.set(key, value);
      },
      removeItem: (key: string) => {
        cookieStore.delete(key);
      },
    },
  });

  return nhost;
}
