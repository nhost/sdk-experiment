import { createClient } from 'nhost-js';
import { MemoryStorage } from 'nhost-js';
import { cookies } from 'next/headers';

/**
 * Server-side Nhost client creator
 * This allows server components to access the Nhost client
 */
export async function createServerNhostClient() {
  // Get the cookie value using the async cookies() API
  const cookieStore = await cookies();
  const nhostCookie = cookieStore.get('nhostSession');
  const cookieValue = nhostCookie?.value || '';

  // Create storage with the cookie value
  const storage = new MemoryStorage();
  storage.setItem('nhostSession', cookieValue);

  // Initialize the client with the storage
  const nhost = createClient({
    region: 'local',
    subdomain: 'local',
    storage
  });

  return nhost;
}
