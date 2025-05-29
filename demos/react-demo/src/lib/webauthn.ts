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

/**
 * Converts a Base64URL string to an ArrayBuffer
 */
export function base64URLToArrayBuffer(base64URL: string): ArrayBuffer {
  const base64 = base64URL.replace(/-/g, "+").replace(/_/g, "/");
  const padLength = (4 - (base64.length % 4)) % 4;
  const paddedBase64 = base64 + "=".repeat(padLength);

  // Convert base64 to binary string
  const binaryString = window.atob(paddedBase64);

  // Convert binary string to ArrayBuffer
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

/**
 * Converts an ArrayBuffer to a Base64URL string
 */
export function arrayBufferToBase64URL(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i] as number);
  }
  // Convert binary to base64 and then to base64URL
  return window
    .btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

/**
 * Prepares WebAuthn credential creation options by converting Base64URL strings to ArrayBuffers
 */
export function preparePublicKeyCredentialCreationOptions(
  publicKeyOptions: PublicKeyCredentialCreationOptions,
): PublicKeyCredentialCreationOptions {
  // Convert challenge from base64 to ArrayBuffer
  if (
    publicKeyOptions.challenge &&
    typeof publicKeyOptions.challenge === "string"
  ) {
    publicKeyOptions.challenge = base64URLToArrayBuffer(
      publicKeyOptions.challenge,
    );
  }

  // Convert user.id from base64 if necessary
  if (
    publicKeyOptions.user?.id &&
    typeof publicKeyOptions.user.id === "string"
  ) {
    publicKeyOptions.user.id = base64URLToArrayBuffer(publicKeyOptions.user.id);
  }

  // Convert excludeCredentials ids from base64 if present
  if (publicKeyOptions.excludeCredentials) {
    publicKeyOptions.excludeCredentials =
      publicKeyOptions.excludeCredentials.map(
        (credential: PublicKeyCredentialDescriptor) => {
          if (credential.id && typeof credential.id === "string") {
            return {
              ...credential,
              id: base64URLToArrayBuffer(credential.id),
            };
          }
          return credential;
        },
      );
  }

  return publicKeyOptions;
}

/**
 * Formats a newly created credential for server verification
 */
export function formatRegistrationCredentialForVerification(
  credential: PublicKeyCredential,
) {
  return {
    id: credential.id,
    type: credential.type,
    rawId: arrayBufferToBase64URL(credential.rawId),
    response: {
      clientDataJSON: arrayBufferToBase64URL(
        (credential.response as AuthenticatorAttestationResponse)
          .clientDataJSON,
      ),
      attestationObject: arrayBufferToBase64URL(
        (credential.response as AuthenticatorAttestationResponse)
          .attestationObject,
      ),
    },
  };
}

/**
 * Formats an authentication credential for server verification
 */
export function formatAuthenticationCredentialForVerification(
  credential: PublicKeyCredential,
) {
  return {
    id: credential.id,
    type: credential.type,
    rawId: arrayBufferToBase64URL(credential.rawId),
    response: {
      clientDataJSON: arrayBufferToBase64URL(
        (credential.response as AuthenticatorAssertionResponse).clientDataJSON,
      ),
      authenticatorData: arrayBufferToBase64URL(
        (credential.response as AuthenticatorAssertionResponse)
          .authenticatorData,
      ),
      signature: arrayBufferToBase64URL(
        (credential.response as AuthenticatorAssertionResponse).signature,
      ),
      userHandle: (credential.response as AuthenticatorAssertionResponse)
        .userHandle
        ? arrayBufferToBase64URL(
            (credential.response as AuthenticatorAssertionResponse)
              .userHandle as ArrayBuffer,
          )
        : null,
    },
  };
}
