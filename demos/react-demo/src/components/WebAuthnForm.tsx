import { useState, type JSX, useEffect } from "react";
import { useAuth } from "../lib/nhost/AuthProvider";
import { type ErrorResponse } from "@nhost/nhost-js/auth";
import { type FetchError } from "@nhost/nhost-js/fetch";

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

  // Check if WebAuthn is supported
  useEffect(() => {
    if (!window.PublicKeyCredential) {
      console.warn("WebAuthn is not supported in this browser");
    }
  }, []);

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
      console.log("Starting WebAuthn registration for:", email);

      // Step 1: Request a challenge from the server
      const response = await nhost.auth.signUpWebAuthn({
        email,
        options: {
          displayName,
        },
      });

      console.log("WebAuthn registration response:", response);

      // Store the challenge data
      setChallengeData(response.body);

      // Start the WebAuthn registration process
      if (response.body && window.PublicKeyCredential) {
        // WebAuthn is supported
        const publicKey = response.body;

        // Create a copy to modify
        const publicKeyCredentialCreationOptions = structuredClone(publicKey);

        console.log(
          "Raw WebAuthn options:",
          publicKeyCredentialCreationOptions,
        );

        // Check if we need to access nested publicKey property
        const credentialOptions = publicKeyCredentialCreationOptions.publicKey
          ? structuredClone(publicKeyCredentialCreationOptions.publicKey)
          : structuredClone(publicKeyCredentialCreationOptions);

        console.log("Credential options to use:", credentialOptions);

        // Convert some ArrayBuffer fields from base64 to the right format
        if (credentialOptions && credentialOptions.challenge) {
          const challenge = credentialOptions.challenge;
          if (typeof challenge === "string") {
            console.log("Converting challenge from base64:", challenge);
            credentialOptions.challenge = base64URLToArrayBuffer(challenge);
          }
        } else {
          console.error(
            "Challenge is missing from the response",
            credentialOptions,
          );
          throw new Error("Invalid challenge data received from server");
        }

        // Convert user.id from base64 if necessary
        if (credentialOptions.user?.id) {
          const userId = credentialOptions.user.id;
          if (typeof userId === "string") {
            console.log("Converting user ID from base64:", userId);
            credentialOptions.user.id = base64URLToArrayBuffer(userId);
          }
        }

        // Convert excludeCredentials ids from base64 if present
        if (credentialOptions.excludeCredentials) {
          console.log("Converting exclude credentials from base64");
          credentialOptions.excludeCredentials =
            credentialOptions.excludeCredentials.map((credential: any) => {
              if (credential.id && typeof credential.id === "string") {
                return {
                  ...credential,
                  id: base64URLToArrayBuffer(credential.id),
                };
              }
              return credential;
            });
        }

        try {
          console.log(
            "Calling navigator.credentials.create with options:",
            credentialOptions,
          );

          // Create new credential
          const credential = (await navigator.credentials.create({
            publicKey: credentialOptions,
          })) as PublicKeyCredential;

          console.log("Created credential:", credential);

          // Prepare credential for verification
          const credentialForVerify = {
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

          // Step 2: Send the credential to the server for verification
          const verifyResponse = await nhost.auth.verifySignUpWebAuthn({
            credential: credentialForVerify,
            options: {
              displayName: displayName || undefined,
            },
            nickname:
              keyNickname || `Security Key for ${displayName || email}`,
          });

          if (verifyResponse.body && verifyResponse.body.session) {
            // Success! User is now registered and authenticated
            console.log(
              "WebAuthn registration successful!",
              verifyResponse.body,
            );
            window.location.href =
              redirectTo || window.location.origin + "/profile";
          }
        } catch (credError) {
          console.error("Error creating credential:", credError);
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

  // Helper function to convert base64URL to ArrayBuffer
  function base64URLToArrayBuffer(base64URL: string): ArrayBuffer {
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

  // Helper function to convert ArrayBuffer to base64URL
  function arrayBufferToBase64URL(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = "";
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    // Convert binary to base64 and then to base64URL
    return window
      .btoa(binary)
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=/g, "");
  }

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
