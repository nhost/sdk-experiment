import {
  type Client as AuthClient,
  type Session,
  type ErrorResponse,
} from "./auth";

import { type SessionStorage } from "./sessionStorage";
import { extractTokenExpiration } from "./fetch/middlewareRefreshSession";
import type { FetchResponse } from "./fetch";

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

const _refreshSession = async (
  auth: AuthClient,
  storage: SessionStorage,
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
