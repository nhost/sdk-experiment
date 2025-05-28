import { useState, type JSX, useEffect } from "react";
import { useAuth } from "../lib/nhost/AuthProvider";
import { type ErrorResponse } from "@nhost/nhost-js/auth";
import { type FetchError } from "@nhost/nhost-js/fetch";
import {
  isWebAuthnSupported,
  prepareRegistrationOptions,
  formatRegistrationCredentialForVerification,
} from "../lib/webauthn";

interface WebAuthnFormProps {
  email: string;
  setEmail: (email: string) => void;
  displayName: string;
  setDisplayName: (name: string) => void;
  redirectTo?: string;
}

export default function WebAuthnForm({
  email,
  setEmail,
  displayName,
  setDisplayName,
  redirectTo,
}: WebAuthnFormProps): JSX.Element {
  const { nhost } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [keyNickname, setKeyNickname] = useState<string>("");
  const [challengeData, setChallengeData] = useState<any | null>(null);

  const startWebAuthnRegistration = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!email) {
      setError("Email is required");
      setIsLoading(false);
      return;
    }

    try {
      // Step 1: Request a challenge from the server
      const response = await nhost.auth.signUpWebAuthn({
        email,
        options: {
          displayName,
        },
      });

      // Store the challenge data
      setChallengeData(response.body);

      // Start the WebAuthn registration process
      if (response.body && isWebAuthnSupported()) {
        // WebAuthn is supported

        // Prepare credential options
        const credentialOptions = prepareRegistrationOptions(response.body);

        if (!credentialOptions.challenge) {
          throw new Error("Invalid challenge data received from server");
        }

        try {
          // Create new credential
          const credential = (await navigator.credentials.create({
            publicKey: credentialOptions,
          })) as PublicKeyCredential;

          // Prepare credential for verification
          const credentialForVerify =
            formatRegistrationCredentialForVerification(credential);

          // Step 2: Send the credential to the server for verification
          const verifyResponse = await nhost.auth.verifySignUpWebAuthn({
            credential: credentialForVerify,
            options: {
              displayName: displayName || undefined,
            },
            nickname: keyNickname || `Security Key for ${displayName || email}`,
          });

          if (verifyResponse.body && verifyResponse.body.session) {
            // Success! User is now registered and authenticated
            window.location.href =
              redirectTo || window.location.origin + "/profile";
          }
        } catch (credError) {
          setError(
            `WebAuthn registration failed: ${(credError as Error).message || "Unknown error"}`,
          );
        }
      } else {
        setError("WebAuthn is not supported by your browser.");
      }
    } catch (err) {
      const error = err as FetchError<ErrorResponse>;
      setError(`An error occurred during WebAuthn sign up: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper functions moved to utils/webauthn.ts

  return (
    <form onSubmit={startWebAuthnRegistration} className="space-y-5">
      <div>
        <label htmlFor="webauthnDisplayName">Display Name</label>
        <input
          id="webauthnDisplayName"
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="webauthnEmail">Email</label>
        <input
          id="webauthnEmail"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div>
        <label htmlFor="keyNickname">Key Nickname (Optional)</label>
        <input
          id="keyNickname"
          type="text"
          value={keyNickname}
          onChange={(e) => setKeyNickname(e.target.value)}
          placeholder="My Security Key"
        />
        <p className="text-xs mt-1 text-gray-400">
          A friendly name for your security key
        </p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <button
        type="submit"
        className="btn btn-primary w-full"
        disabled={isLoading || !email}
      >
        {isLoading
          ? challengeData
            ? "Complete Registration on Your Device..."
            : "Initializing..."
          : "Register with Security Key"}
      </button>

      <div className="text-xs mt-2 text-gray-400">
        <p>
          You'll be prompted to use your device's security key (like TouchID,
          FaceID, Windows Hello, or a USB security key)
        </p>
      </div>
    </form>
  );
}
