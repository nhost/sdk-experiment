import { useState, type JSX } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../lib/nhost/AuthProvider";
import { type ErrorResponse } from "@nhost/nhost-js/auth";
import { type FetchError } from "@nhost/nhost-js/fetch";
import { isWebAuthnSupported } from "../lib/webauthn";

export default function WebAuthnSignInForm(): JSX.Element {
  const { nhost } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const startWebAuthnSignIn = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Request a challenge from the server for credential discovery
      // The server will return a challenge that allows any registered credentials
      const response = await nhost.auth.signInWebAuthn();

      if (!isWebAuthnSupported()) {
        setError("WebAuthn is not supported by your browser.");
        setIsLoading(false);
        return;
      }

      try {
        // Get credential from the browser using the challenge
        const credential = await navigator.credentials.get({
          publicKey: PublicKeyCredential.parseRequestOptionsFromJSON(
            response.body,
          ),
        });

        if (!credential) {
          setError("No credential was selected.");
          setIsLoading(false);
          return;
        }

        // Step 2: Send the credential to the server for verification
        const verifyResponse = await nhost.auth.verifySignInWebAuthn({
          credential,
        });

        if (verifyResponse.body && verifyResponse.body.session) {
          navigate("/profile");
        } else {
          setError("Authentication failed");
        }
      } catch (credError) {
        setError(
          `WebAuthn authentication failed: ${(credError as Error).message || "Unknown error"}`,
        );
      }
    } catch (err) {
      const error = err as FetchError<ErrorResponse>;
      setError(`An error occurred during WebAuthn sign in: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper functions moved to utils/webauthn.ts

  return (
    <form onSubmit={startWebAuthnSignIn} className="space-y-5">
      {error && <div className="alert alert-error">{error}</div>}

      <button
        type="submit"
        className="btn btn-primary w-full"
        disabled={isLoading}
      >
        {isLoading ? "Authenticating..." : "Sign In with Security Key"}
      </button>

      <div className="text-xs mt-2 text-gray-400">
        <p>
          You&apos;ll be prompted to use your device&apos;s security key (like
          TouchID, FaceID, Windows Hello, or a USB security key)
        </p>
        <p>
          Your browser will show available security keys that you&apos;ve
          previously registered.
        </p>
      </div>
    </form>
  );
}
