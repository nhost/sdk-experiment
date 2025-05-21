import {
  type Client as AuthClient,
  type Session,
  type ErrorResponse,
} from "../auth";

import { type SessionStorage } from "./storage";
import type { FetchResponse } from "../fetch";

interface JWTToken {
  exp: number;
}

class DummyLock implements Lock {
  async request(
    _name: string,
    _options: { mode: "exclusive" | "shared" },
    callback: () => Promise<any>, //eslint-disable-line @typescript-eslint/no-explicit-any
  ) {
    return callback(); //eslint-disable-line @typescript-eslint/no-unsafe-return
  }
}

interface Lock {
  request: (
    name: string,
    options: { mode: "exclusive" | "shared" },
    callback: () => Promise<any>, //eslint-disable-line @typescript-eslint/no-explicit-any
  ) => Promise<any>; //eslint-disable-line @typescript-eslint/no-explicit-any
}

const lock: Lock =
  typeof navigator !== "undefined" && navigator.locks
    ? navigator.locks
    : new DummyLock();

/**
 * Extracts the expiration time from a JWT token
 * @param token - JWT token string
 * @returns Expiration timestamp in milliseconds, or 0 if unable to extract
 */
const extractTokenExpiration = (token: string): number => {
  try {
    // JWT tokens are in the format header.payload.signature
    const parts = token.split(".");
    if (parts.length !== 3) {
      return 0;
    }

    // At this point, we know parts has exactly 3 elements
    // Use a non-null assertion or check explicitly
    const payloadPart = parts[1];
    if (!payloadPart) {
      return 0;
    }

    // Decode the payload (middle part)
    const base64 = payloadPart.replace(/-/g, "+").replace(/_/g, "/");
    const payload = decodeTokenPayload(base64) as JWTToken;

    if (payload.exp) {
      // exp claim is in seconds, convert to milliseconds
      return payload.exp * 1000;
    } else {
      return 0;
    }
  } catch {
    return 0;
  }
};

/**
 * Decodes a base64-encoded JWT payload
 * @param base64Payload - Base64-encoded payload
 * @returns Decoded payload as an object
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function decodeTokenPayload(base64Payload: string): any {
  let jsonPayload: string;

  if (typeof window !== "undefined") {
    // Browser environment
    jsonPayload = decodeURIComponent(
      window
        .atob(base64Payload)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );
  } else {
    // Node.js environment
    const buffer = Buffer.from(base64Payload, "base64");
    jsonPayload = buffer.toString("utf8");
  }

  return JSON.parse(jsonPayload);
}

/**
 * Refreshes the authentication session if needed
 *
 * This function checks if the current session needs to be refreshed based on
 * the access token expiration time. If a refresh is needed, it will attempt to
 * refresh the token using the provided auth client.
 *
 * @param auth - The authentication client to use for token refresh
 * @param storage - The session storage implementation
 * @param marginSeconds - How many seconds before expiration to trigger a refresh (defaults to 60 seconds)
 * @returns A promise that resolves to the current session (refreshed if needed) or null if no session exists
 */
export const refreshSession = async (
  auth: AuthClient,
  storage: SessionStorage,
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

/**
 * Internal implementation of the refresh session logic
 *
 * @param auth - The authentication client to use for token refresh
 * @param storage - The session storage implementation
 * @param marginSeconds - How many seconds before expiration to trigger a refresh
 * @returns A promise that resolves to the current session (refreshed if needed) or null if no session exists
 * @private
 */
const _refreshSession = async (
  auth: AuthClient,
  storage: SessionStorage,
  marginSeconds = 60,
): Promise<Session | null> => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { session, needsRefresh }: { session: Session | null; needsRefresh: boolean } =
    //eslint-disable-next-line @typescript-eslint/require-await
    await lock.request("nhostSessionLock", { mode: "shared" }, async () => {
      return _needsRefresh(storage, marginSeconds);
    });

  if (!session) {
    return null; // No session found
  }

  if (!needsRefresh) {
    return session; // No need to refresh
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const refreshedSession: Session | null = await lock.request(
    "nhostSessionLock",
    { mode: "exclusive" },
    async () => {
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
          return session;
        }

        throw error;
      }
    },
  );

  return refreshedSession;
};

/**
 * Checks if the current session needs to be refreshed based on token expiration
 *
 * @param storage - The session storage implementation
 * @param marginSeconds - How many seconds before expiration to trigger a refresh
 * @returns An object containing the session, whether it needs refreshing, and whether it has expired
 * @private
 */
const _needsRefresh = (storage: SessionStorage, marginSeconds = 60) => {
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
