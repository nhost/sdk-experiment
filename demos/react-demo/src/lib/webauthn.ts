/**
 * WebAuthn utility functions for handling security keys
 */

/**
 * Checks if WebAuthn is supported in the current browser
 */
export const isWebAuthnSupported = (): boolean => {
  return (
    typeof window !== "undefined" &&
    !!window.PublicKeyCredential &&
    !!navigator.credentials
  );
};
