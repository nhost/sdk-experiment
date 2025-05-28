import { useState, type JSX } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../lib/nhost/AuthProvider";
import { type ErrorResponse } from "@nhost/nhost-js/auth";
import { type FetchError } from "@nhost/nhost-js/fetch";

// Email is maintained for backward compatibility but no longer required for WebAuthn sign in
interface WebAuthnSignInFormProps {
  email?: string;
  setEmail?: (email: string) => void;
}

export default function WebAuthnSignInForm({
  email = "",
  setEmail = () => {},
}: WebAuthnSignInFormProps): JSX.Element {
  const { nhost } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const startWebAuthnSignIn = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Step 1: Request a challenge from the server without email for credential discovery
      // The server will return a challenge that allows any registered credentials
      const response = await nhost.auth.signInWebAuthn();

      // Start the WebAuthn authentication process
      if (response.body && window.PublicKeyCredential) {
        // WebAuthn is supported
        const publicKey = response.body;
        
        // Create a copy to modify
        const publicKeyCredentialRequestOptions = structuredClone(publicKey);
        
        console.log("Received WebAuthn signin options:", publicKeyCredentialRequestOptions);
        
        // Convert ArrayBuffer fields from base64 to the right format
        if (publicKeyCredentialRequestOptions && 
            publicKeyCredentialRequestOptions.challenge) {
          const challenge = publicKeyCredentialRequestOptions.challenge;
          if (typeof challenge === "string") {
            publicKeyCredentialRequestOptions.challenge = base64URLToArrayBuffer(challenge);
          }
        } else {
          console.error("Challenge is missing from the response", publicKeyCredentialRequestOptions);
          throw new Error("Invalid challenge data received from server");
        }

        // Convert allowCredentials ids from base64 if present
        if (publicKeyCredentialRequestOptions.allowCredentials) {
          publicKeyCredentialRequestOptions.allowCredentials = 
            publicKeyCredentialRequestOptions.allowCredentials.map((credential: any) => {
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
          // Get credential
          const credential = await navigator.credentials.get({
            publicKey: publicKeyCredentialRequestOptions,
          }) as PublicKeyCredential;

          // Prepare credential for verification
          const credentialForVerify = {
            id: credential.id,
            type: credential.type,
            rawId: arrayBufferToBase64URL(credential.rawId),
            response: {
              clientDataJSON: arrayBufferToBase64URL(
                (credential.response as AuthenticatorAssertionResponse).clientDataJSON
              ),
              authenticatorData: arrayBufferToBase64URL(
                (credential.response as AuthenticatorAssertionResponse).authenticatorData
              ),
              signature: arrayBufferToBase64URL(
                (credential.response as AuthenticatorAssertionResponse).signature
              ),
              userHandle: (credential.response as AuthenticatorAssertionResponse).userHandle ? 
                arrayBufferToBase64URL((credential.response as AuthenticatorAssertionResponse).userHandle as ArrayBuffer) : 
                null,
            },
          };

          // Step 2: Send the credential to the server for verification
          const verifyResponse = await nhost.auth.signInWebAuthnVerify({
            credential: credentialForVerify,
          });

          if (verifyResponse.body && verifyResponse.body.session) {
            // Success! User is now authenticated
            navigate("/profile");
          } else if (verifyResponse.body?.mfa) {
            // MFA is required
            navigate(`/signin/mfa?ticket=${verifyResponse.body.mfa.ticket}`);
          } else {
            setError("Authentication failed");
          }
        } catch (credError) {
          console.error("Error authenticating with credential:", credError);
          setError(`WebAuthn authentication failed: ${(credError as Error).message || "Unknown error"}`);
        }
      } else {
        setError("WebAuthn is not supported by your browser.");
      }
    } catch (err) {
      const error = err as FetchError<ErrorResponse>;
      setError(`An error occurred during WebAuthn sign in: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to convert base64URL to ArrayBuffer
  function base64URLToArrayBuffer(base64URL: string): ArrayBuffer {
    // Convert base64URL to base64
    const base64 = base64URL.replace(/-/g, '+').replace(/_/g, '/');
    const padLength = (4 - (base64.length % 4)) % 4;
    const paddedBase64 = base64 + '='.repeat(padLength);
    
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
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    // Convert binary to base64 and then to base64URL
    return window.btoa(binary)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }

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
        <p>You'll be prompted to use your device's security key (like TouchID, FaceID, Windows Hello, or a USB security key)</p>
        <p>Your browser will show available security keys that you've previously registered.</p>
      </div>
    </form>
  );
}