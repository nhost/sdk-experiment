import { CookieStorage } from "@nhost/nhost-js";
import { type Session } from "@nhost/nhost-js/auth";

/**
 * Type definition for session change listener
 */
type SessionChangeListener = (session: Session | null) => void;

/**
 * A custom storage implementation for Nhost that extends CookieStorage
 * and adds event emitting capabilities to solve the issue with
 * having to poll for session changes.
 */
export class EventEmitterStorage extends CookieStorage {
  private listeners: Set<SessionChangeListener>;
  private lastSession: Session | null;

  constructor(options?: { secure?: boolean }) {
    super(options);
    this.listeners = new Set();
    this.lastSession = super.get();
  }

  /**
   * Adds an event listener for session changes
   * @param {SessionChangeListener} listener - Callback function that will receive the session
   * @returns {function} - Function to remove the listener
   */
  onSessionChange(listener: SessionChangeListener): () => void {
    this.listeners.add(listener);

    // Return a function to remove the listener
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Notifies all listeners about the current session
   * @param {UserSession|null} session - The current session
   * @private
   */
  private _notifyListeners(session: Session | null): void {
    this.listeners.forEach((listener) => {
      try {
        listener(session);
      } catch (error) {
        console.error("Error in session change listener:", error);
      }
    });
  }

  /**
   * Sets the session in storage and notifies listeners if it changed
   * @param {UserSession} value - The session to store
   * @override
   */
  override set(value: Session): void {
    super.set(value);

    // Compare with last known session to avoid unnecessary notifications
    const lastSessionStr = JSON.stringify(this.lastSession);
    const newSessionStr = JSON.stringify(value);

    if (lastSessionStr !== newSessionStr) {
      this.lastSession = value;
      this._notifyListeners(value);
    }
  }

  /**
   * Removes the session from storage and notifies listeners
   * @override
   */
  override remove(): void {
    super.remove();

    if (this.lastSession !== null) {
      this.lastSession = null;
      this._notifyListeners(null);
    }
  }
}
