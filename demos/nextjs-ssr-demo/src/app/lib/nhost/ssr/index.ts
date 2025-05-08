import { createClient } from "nhost-js";
import { extractTokenExpiration, type Session } from "nhost-js/auth";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

/**
 * Creates an authenticated Nhost client for server-side usage.
 *
 * This function is specifically designed to be used in server components or API routes.
 * It retrieves authentication credentials from cookies and initializes an Nhost client
 * with those credentials, allowing server-side code to make authenticated requests
 * on behalf of the user.
 *
 * @returns {Promise<ReturnType<typeof createClient>>} An authenticated Nhost client instance
 */
export async function createServerNhostClient(): Promise<
  ReturnType<typeof createClient>
> {
  const cookieStore = await cookies();

  const key = "nhostSession";

  const nhost = createClient({
    region: process.env["NHOST_REGION"] || "local",
    subdomain: process.env["NHOST_SUBDOMAIN"] || "local",
    storage: {
      get: (): Session | null => {
        const raw = cookieStore.get(key)?.value || null;
        if (!raw) {
          return null;
        }
        const session: Session = JSON.parse(raw);
        return session;
      },
      set: (value: Session) => {
        cookieStore.set(key, JSON.stringify(value));
      },
      remove: () => {
        cookieStore.delete(key);
      },
    },
  });

  return nhost;
}

/**
 * Middleware function to handle Nhost authentication and session management.
 *
 * This function is designed to be used in Next.js middleware to manage user sessions
 * and refresh tokens. It checks for the presence of a refresh token in the request URL,
 * exchanges it for a new session if necessary, and manages the session expiration.
 *
 * @param {NextRequest} request - The incoming Next.js request object
 * @param {NextResponse} response - The outgoing Next.js response object
 * @returns {Promise<unknown>} The user session or undefined
 */
export async function handleNhostMiddleware(
  request: NextRequest,
  response: NextResponse<unknown>,
): Promise<Session | null> {
  const key = "nhostSession";

  const nhost = createClient({
    region: process.env["NHOST_REGION"] || "local",
    subdomain: process.env["NHOST_SUBDOMAIN"] || "local",
    storage: {
      get: (): Session | null => {
        const raw = request.cookies.get(key)?.value || null;
        if (!raw) {
          return null;
        }
        const session: Session = JSON.parse(raw);
        return session;
      },
      set: (value: Session) => {
        response.cookies.set({
          name: key,
          value: JSON.stringify(value),
          path: "/",
          httpOnly: false, //if set to true we can't access it in the client
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 30, // 30 days in seconds
        });
      },
      remove: () => {
        response.cookies.delete(key);
      },
    },
  });

  // Get the session from the storage
  const session = nhost.getUserSession();

  if (session?.accessToken) {
    const tokenExpiresAt = extractTokenExpiration(session?.accessToken || "");
    const currentTime = Date.now();
    if (tokenExpiresAt - currentTime < 60 * 1000) {
      await nhost.refreshSession();
      return nhost.getUserSession();
    }
  }

  return session;
}
