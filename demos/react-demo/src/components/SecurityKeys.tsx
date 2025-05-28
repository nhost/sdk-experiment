import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../lib/nhost/AuthProvider";
import type { FetchError, FetchResponse } from "@nhost/nhost-js/fetch";
import type { ErrorResponse } from "@nhost/nhost-js/auth";
import {
  isWebAuthnSupported,
  prepareRegistrationOptions,
  formatRegistrationCredentialForVerification,
} from "../lib/webauthn";

interface SecurityKey {
  id: string;
  credentialId: string;
  nickname: string | null;
}

interface SecurityKeysResponse {
  data?: {
    user?: {
      securityKeys: SecurityKey[];
    };
  };
}

export default function SecurityKeys() {
  const { nhost, user, isAuthenticated } = useAuth();
  const [securityKeys, setSecurityKeys] = useState<SecurityKey[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletingKeyId, setDeletingKeyId] = useState<string | null>(null);
  const [keyName, setKeyName] = useState("");
  const [success, setSuccess] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isWebAuthnAvailable, setIsWebAuthnAvailable] = useState<boolean>(true);

  const fetchSecurityKeys = useCallback(async (): Promise<void> => {
    if (!user?.id) return;

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response: FetchResponse<SecurityKeysResponse> =
        await nhost.graphql.post({
          query: `
          query GetUserSecurityKeys($userId: uuid!) {
            user(id: $userId) {
              securityKeys {
                id
                credentialId
                nickname
              }
            }
          }
        `,
          variables: {
            userId: user.id,
          },
        });

      const userData = response.body?.data;
      const keys = userData?.user?.securityKeys || [];
      setSecurityKeys(keys);
    } catch (err) {
      const error = err as FetchError<ErrorResponse>;
      setErrorMessage(`Failed to load security keys: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [user, isAuthenticated, nhost.graphql]);

  const deleteSecurityKey = async (keyId: string): Promise<void> => {
    if (isDeleting) return;

    setIsDeleting(true);
    setDeletingKeyId(keyId);
    setSuccess(null);
    setErrorMessage(null);

    try {
      // Delete the security key using GraphQL mutation
      const response = await nhost.graphql.post({
        query: `
          mutation DeleteSecurityKey($keyId: uuid!) {
            deleteAuthUserSecurityKey(id: $keyId) {
              id
            }
          }
        `,
        variables: {
          keyId,
        },
      });

      if (response.body?.errors) {
        throw new Error(response.body.errors[0]?.message || "Unknown error");
      }

      // Remove the key from the local state
      setSecurityKeys(securityKeys.filter((key) => key.id !== keyId));
      setSuccess(
        "Security key deleted successfully! Remember to also remove it from your authenticator app, password manager, or device credential manager to avoid future authentication issues.",
      );

      // Hide success message after 5 seconds (increased to give users time to read the reminder)
      setTimeout(() => {
        setSuccess(null);
      }, 5000);
    } catch (err) {
      const error = err as Error;
      setErrorMessage(`Failed to delete security key: ${error.message}`);
    } finally {
      setIsDeleting(false);
      setDeletingKeyId(null);
    }
  };

  useEffect(() => {
    // Check WebAuthn browser support
    setIsWebAuthnAvailable(isWebAuthnSupported());

    if (isAuthenticated && user?.id) {
      fetchSecurityKeys();
    }
  }, [user, isAuthenticated, fetchSecurityKeys]);

  if (isLoading) {
    return (
      <div className="glass-card p-8 mb-6">
        <h3 className="text-xl mb-4">Security Keys</h3>
        <p>Loading security keys...</p>
      </div>
    );
  }

  const registerNewSecurityKey = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isWebAuthnAvailable) {
      setErrorMessage(
        "WebAuthn is not supported by your browser. Please use a modern browser that supports WebAuthn.",
      );
      return;
    }

    if (!keyName.trim()) {
      setErrorMessage("Please provide a name for your security key");
      return;
    }

    setIsRegistering(true);
    setErrorMessage(null);
    setSuccess(null);

    try {
      // Step 1: Initialize WebAuthn security key registration
      const initResponse = await nhost.auth.addSecurityKey();

      if (!initResponse.body || initResponse.status >= 400) {
        const errorMessage =
          initResponse.body && (initResponse.body as any).message
            ? (initResponse.body as any).message
            : "Failed to initialize security key registration";
        throw new Error(errorMessage);
      }

      // Step 2: Browser prompts user to interact with security key
      const publicKeyCredentialCreationOptions =
        initResponse.body as PublicKeyCredentialCreationOptions;

      try {
        // Prepare credential options using utility function
        const credentialOptions = prepareRegistrationOptions(
          publicKeyCredentialCreationOptions,
        );

        if (!credentialOptions.challenge) {
          throw new Error("Invalid challenge data received from server");
        }
        // Create new credential
        const credential = (await navigator.credentials.create({
          publicKey: credentialOptions,
        })) as PublicKeyCredential;

        if (!credential) {
          throw new Error("Security key registration was cancelled or failed");
        }

        // Prepare credential for verification using utility function
        const credentialForVerification =
          formatRegistrationCredentialForVerification(credential);

        // Step 4: Verify the security key with the server
        const verifyResponse = await nhost.auth.verifyAddSecurityKey({
          credential: credentialForVerification,
          nickname: keyName.trim(),
        });

        if (!verifyResponse.body || verifyResponse.status >= 400) {
          const errorMessage =
            verifyResponse.body && (verifyResponse.body as any).message
              ? (verifyResponse.body as any).message
              : "Failed to verify security key";
          throw new Error(errorMessage);
        }

        // Registration successful
        setSuccess("Security key registered successfully!");
        setKeyName("");
        setShowAddForm(false);

        // Refresh the security keys list
        fetchSecurityKeys();
      } catch (err) {
        // Provide more specific error messages based on the error
        let errorMessage = "Failed to register security key";

        if (err instanceof Error) {
          if (err.name === "NotAllowedError") {
            errorMessage =
              "You cancelled the registration or the operation timed out";
          } else if (err.name === "NotSupportedError") {
            errorMessage =
              "Your device doesn't support this type of security key";
          } else if (err.name === "SecurityError") {
            errorMessage = "The operation was blocked for security reasons";
          } else if (err.message) {
            errorMessage = err.message;
          }
        }

        throw new Error(errorMessage);
      }
    } catch (err) {
      const error = err as Error;
      setErrorMessage(`Failed to register security key: ${error.message}`);
    } finally {
      setIsRegistering(false);
    }
  };

  const toggleAddForm = () => {
    setShowAddForm(!showAddForm);
    setErrorMessage(null);
    setSuccess(null);
    setKeyName("");
  };

  return (
    <div className="glass-card p-8 mb-6">
      <h3 className="text-xl mb-4">Security Keys</h3>

      {errorMessage && (
        <div className="alert alert-error mb-4">{errorMessage}</div>
      )}

      {success && <div className="alert alert-success mb-4">{success}</div>}

      {!isWebAuthnAvailable && (
        <div className="alert alert-error mb-4">
          <p>
            <strong>WebAuthn not supported!</strong> Your browser or device
            doesn't support WebAuthn authentication. Please use a modern browser
            (Chrome, Firefox, Safari, Edge) that supports WebAuthn.
          </p>
          <p className="mt-2 text-sm">
            Note: Even if your browser supports WebAuthn, you may need a
            compatible authenticator like a fingerprint reader, facial
            recognition, or a security key (e.g., YubiKey).
          </p>
        </div>
      )}

      {showAddForm ? (
        <div className="space-y-5">
          <p>
            Enter a name for your security key and follow the prompts from your
            browser to register it.
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Note: You'll need a security key (like YubiKey) or a device with
            biometric authentication (like Touch ID, Face ID, or Windows Hello).
            If registration fails, make sure your device has the required
            capabilities.
          </p>
          <p className="text-sm text-gray-400">
            This works the same way as when you registered during sign up.
          </p>

          <form onSubmit={registerNewSecurityKey} className="space-y-4">
            <div>
              <label
                htmlFor="keyName"
                className="block mb-2 text-sm font-medium"
              >
                Security Key Name
              </label>
              <input
                type="text"
                id="keyName"
                value={keyName}
                onChange={(e) => setKeyName(e.target.value)}
                placeholder="e.g., My YubiKey, Touch ID, Windows Hello"
                disabled={isRegistering}
                required
              />
            </div>
            <div className="flex space-x-3">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isRegistering}
              >
                {isRegistering ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Complete Registration on Your Device...
                  </>
                ) : (
                  "Register Security Key"
                )}
              </button>
              <button
                type="button"
                onClick={toggleAddForm}
                className="btn btn-secondary"
                disabled={isRegistering}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="space-y-5">
          <p>
            Security Keys (WebAuthn) provide a secure passwordless
            authentication option using hardware security keys, fingerprints, or
            facial recognition.
          </p>

          {/* List of existing security keys */}
          {securityKeys.length === 0 ? (
            <p>No security keys registered.</p>
          ) : (
            <div className="space-y-4">
              <ul className="space-y-3">
                {securityKeys.map((key) => (
                  <li
                    key={key.id}
                    className="flex items-center justify-between border-b border-gray-700 pb-2"
                  >
                    <div>
                      <span className="font-medium">
                        {key.nickname || "Unnamed key"}
                      </span>
                      <span className="text-sm text-gray-500 ml-2">
                        ID: {key.credentialId.slice(0, 8)}...
                      </span>
                    </div>
                    <button
                      onClick={() => deleteSecurityKey(key.id)}
                      disabled={isDeleting && deletingKeyId === key.id}
                      className="action-icon action-icon-delete"
                      title="Delete security key from your account"
                    >
                      {isDeleting && deletingKeyId === key.id ? (
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <path d="M12 6v6" />
                        </svg>
                      ) : (
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M3 6h18" />
                          <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                          <path d="M10 11v6M14 11v6" />
                        </svg>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button
            onClick={toggleAddForm}
            disabled={!isWebAuthnAvailable}
            className="btn btn-primary"
          >
            Register New Security Key
          </button>
        </div>
      )}
    </div>
  );
}
