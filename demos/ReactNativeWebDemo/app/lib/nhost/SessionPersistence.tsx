import { AppState, type AppStateStatus } from "react-native";
import { useEffect } from "react";
import { type NhostClient } from "@nhost/nhost-js";

/**
 * Hook to ensure session persistence when the app goes to background
 * and returns to the foreground in Expo Go.
 *
 * This hook:
 * 1. Listens for app state changes
 * 2. Ensures session data is properly persisted when app goes to background
 * 3. Refreshes the session when app comes back to foreground
 *
 * @param nhost - The Nhost client instance
 */
export function useSessionPersistence(nhost: NhostClient): void {
  useEffect(() => {
    // Handle app state changes
    const handleAppStateChange = async (nextAppState: AppStateStatus) => {
      // When app goes to background
      if (nextAppState === "background") {
        // Ensure the current session is persisted before app pauses
        const currentSession = nhost.getUserSession();
        if (currentSession) {
          try {
            // Force session persistence by explicitly setting it again
            nhost.sessionStorage.set(currentSession);
          } catch (error) {
            console.warn("Error persisting session before background:", error);
          }
        }
      }

      // When app comes back to foreground
      if (nextAppState === "active") {
        // Try to refresh the session to ensure it's still valid
        try {
          await nhost.refreshSession();
        } catch (error) {
          console.warn("Error refreshing session after foreground:", error);
        }
      }
    };

    // Subscribe to app state changes
    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange,
    );

    // Cleanup subscription when component unmounts
    return () => {
      subscription.remove();
    };
  }, [nhost]);
}

/**
 * Component to add session persistence management to your app
 */
interface SessionPersistenceProps {
  nhost: NhostClient;
}

export function SessionPersistenceManager({
  nhost,
}: SessionPersistenceProps): null {
  // Use the persistence hook
  useSessionPersistence(nhost);

  // This component doesn't render anything
  return null;
}

/**
 * Default export component to satisfy the Router's requirements
 */
export default function SessionPersistenceContainer() {
  return null;
}
