import { createClient, extractTokenExpiration } from 'nhost-js';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

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


export async function handleNhostMiddleware(request: NextRequest, response: NextResponse<unknown>) {
  // Create the Nhost client with server storage
  const nhost = createClient({
    region: 'local',
    subdomain: 'local',
    storage: {
      getItem: (key: string) => {
        return request.cookies.get(key)?.value || null;
      },
      setItem: (key: string, value: string) => {
        response.cookies.set({
          name: key,
          value: value,
          path: '/',
          httpOnly: false, //if set to true we can't access it in the client
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 30, // 30 days in seconds
        });
      },
      removeItem: (key: string) => {
        response.cookies.delete(key);
      },
    }
  });

  // Get the session from the storage
  const session = nhost.getUserSession();

  // Check if the request has a refreshToken in the URL and exchange it for a new session
  const refreshToken = request.nextUrl.searchParams.get('refreshToken');
  if (refreshToken && !session) {
    await nhost.auth.refreshToken({ refreshToken });
    return nhost.getUserSession();
  }

  // Check if the session needs to be refreshed
  const tokenExpiresAt = extractTokenExpiration(session?.accessToken || '');
  const currentTime = Date.now();
  if (tokenExpiresAt - currentTime < 60 * 1000) {
      await nhost.storage.getVersion();
      return nhost.getUserSession();
  }

  return session;
}
