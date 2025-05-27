/**
 * This file is auto-generated. Do not edit manually.
 */

import { FetchError, createEnhancedFetch } from "../fetch";
import type { ChainFunction, FetchResponse } from "../fetch";

import type { Client } from "./interface";

/**
 * JSON Web Key Set for verifying JWT signatures
 */
export interface JWKSet {
  /**
   * Array of public keys
   */
  keys: JWK[];
}

/**
 * JSON Web Key for JWT verification
 */
export interface JWK {
  /**
   * Algorithm used with this key
   *    Example - "RS256"
   */
  alg: string;
  /**
   * RSA public exponent
   *    Example - "AQAB"
   */
  e: string;
  /**
   * Key ID
   *    Example - "key-id-1"
   */
  kid: string;
  /**
   * Key type
   *    Example - "RSA"
   */
  kty: string;
  /**
   * RSA modulus
   *    Example - "abcd1234..."
   */
  n: string;
  /**
   * Key usage
   *    Example - "sig"
   */
  use: string;
}

/**
 * Request to refresh an access token
 */
export interface RefreshTokenRequest {
  /**
   * Refresh token used to generate a new access token
   *    Example - "2c35b6f3-c4b9-48e3-978a-d4d0f1d42e24"
   *    Pattern - \b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b
   */
  refreshToken: string;
}

/**
 *
 */
export interface SignOutSchema {
  /**
   * Refresh token for the current session
   */
  refreshToken: string;
  /**
   * Sign out from all connected devices
   */
  all?: boolean;
}

/**
 *
 */
export interface CreatePATRequest {
  /**
   * Expiration date of the PAT
   *    Format - date-time
   */
  expiresAt: string;
  /**
   *
   *    Example - {"name":"my-pat","used-by":"my-app-cli"}
   */
  metadata?: Record<string, unknown>;
}

/**
 *
 */
export interface CreatePATResponse {
  /**
   * ID of the PAT
   *    Example - "2c35b6f3-c4b9-48e3-978a-d4d0f1d42e24"
   *    Pattern - \b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b
   */
  id: string;
  /**
   * PAT
   *    Example - "2c35b6f3-c4b9-48e3-978a-d4d0f1d42e24"
   *    Pattern - \b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b
   */
  personalAccessToken: string;
}

/**
 * Error code identifying the specific application error
 */
export type ErrorResponseError =
  | "default-role-must-be-in-allowed-roles"
  | "disabled-endpoint"
  | "disabled-user"
  | "email-already-in-use"
  | "email-already-verified"
  | "forbidden-anonymous"
  | "internal-server-error"
  | "invalid-email-password"
  | "invalid-request"
  | "locale-not-allowed"
  | "password-too-short"
  | "password-in-hibp-database"
  | "redirectTo-not-allowed"
  | "role-not-allowed"
  | "signup-disabled"
  | "unverified-user"
  | "user-not-anonymous"
  | "invalid-pat"
  | "invalid-refresh-token"
  | "invalid-ticket"
  | "disabled-mfa-totp"
  | "no-totp-secret"
  | "invalid-totp"
  | "mfa-type-not-found"
  | "totp-already-active";

/**
 * Standardized error response
 */
export interface ErrorResponse {
  /**
   * HTTP status error code
   *    Example - 400
   */
  status: number;
  /**
   * Human-friendly error message
   *    Example - "Invalid email format"
   */
  message: string;
  /**
   * Error code identifying the specific application error
   */
  error: ErrorResponseError;
}

/**
 * Response for email-password authentication that may include a session or MFA challenge
 */
export interface SignInEmailPasswordResponse {
  /**
   * User authentication session containing tokens and user information
   */
  session?: Session;
  /**
   * Challenge payload for multi-factor authentication
   */
  mfa?: MFAChallengePayload;
}

/**
 * Challenge payload for multi-factor authentication
 */
export interface MFAChallengePayload {
  /**
   * Ticket to use when completing the MFA challenge
   *    Example - "mfaTotp:abc123def456"
   */
  ticket: string;
}

/**
 * Container for session information
 */
export interface SessionPayload {
  /**
   * User authentication session containing tokens and user information
   */
  session?: Session;
}

/**
 * User authentication session containing tokens and user information
 */
export interface Session {
  /**
   * JWT token for authenticating API requests
   *    Example - "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   */
  accessToken: string;
  /**
   * Expiration time of the access token in seconds
   *    Example - 900
   *    Format - int64
   */
  accessTokenExpiresIn: number;
  /**
   * Identifier for the refresh token
   *    Example - "2c35b6f3-c4b9-48e3-978a-d4d0f1d42e24"
   *    Pattern - \b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b
   */
  refreshTokenId: string;
  /**
   * Token used to refresh the access token
   *    Example - "2c35b6f3-c4b9-48e3-978a-d4d0f1d42e24"
   *    Pattern - \b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b
   */
  refreshToken: string;
  /**
   * User profile and account information
   */
  user?: User;
}

/**
 *
 */
export interface SignInPATRequest {
  /**
   * PAT
   *    Example - "2c35b6f3-c4b9-48e3-978a-d4d0f1d42e24"
   *    Pattern - \b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b
   */
  personalAccessToken: string;
}

/**
 * User profile and account information
 */
export interface User {
  /**
   * URL to the user's profile picture
   *    Example - "https://myapp.com/avatars/user123.jpg"
   */
  avatarUrl: string;
  /**
   * Timestamp when the user account was created
   *    Example - "2023-01-15T12:34:56Z"
   *    Format - date-time
   */
  createdAt: string;
  /**
   * Default authorization role for the user
   *    Example - "user"
   */
  defaultRole: string;
  /**
   * User's display name
   *    Example - "John Smith"
   */
  displayName: string;
  /**
   * User's email address
   *    Example - "john.smith@nhost.io"
   *    Format - email
   */
  email?: string;
  /**
   * Whether the user's email has been verified
   *    Example - true
   */
  emailVerified: boolean;
  /**
   * Unique identifier for the user
   *    Example - "2c35b6f3-c4b9-48e3-978a-d4d0f1d42e24"
   *    Pattern - \b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b
   */
  id: string;
  /**
   * Whether this is an anonymous user account
   *    Example - false
   */
  isAnonymous: boolean;
  /**
   * User's preferred locale (language code)
   *    Example - "en"
   *    MinLength - 2
   *    MaxLength - 2
   */
  locale: string;
  /**
   * Custom metadata associated with the user
   *    Example - {"firstName":"John","lastName":"Smith"}
   */
  metadata: Record<string, unknown>;
  /**
   * User's phone number
   *    Example - "+12025550123"
   */
  phoneNumber?: string;
  /**
   * Whether the user's phone number has been verified
   *    Example - false
   */
  phoneNumberVerified: boolean;
  /**
   * List of roles assigned to the user
   *    Example - ["user","customer"]
   */
  roles: string[];
}

/**
 * Which sign-in method to use
 */
export type UserDeanonymizeRequestSignInMethod =
  | "email-password"
  | "passwordless";

/**
 *
 */
export interface UserDeanonymizeRequest {
  /**
   * Which sign-in method to use
   */
  signInMethod: UserDeanonymizeRequestSignInMethod;
  /**
   * A valid email
   *    Example - "john.smith@nhost.io"
   *    Format - email
   */
  email: string;
  /**
   * A password of minimum 3 characters
   *    Example - "Str0ngPassw#ord-94|%"
   *    MinLength - 3
   *    MaxLength - 50
   */
  password?: string;
  /**
   * Deprecated, will be ignored
   */
  connection?: string;
  /**
   *
   */
  options?: SignUpOptions;
}

/**
 *
 */
export interface UserEmailChangeRequest {
  /**
   * A valid email
   *    Example - "john.smith@nhost.io"
   *    Format - email
   */
  newEmail: string;
  /**
   *
   */
  options?: OptionsRedirectTo;
}

/**
 *
 */
export interface UserEmailSendVerificationEmailRequest {
  /**
   * A valid email
   *    Example - "john.smith@nhost.io"
   *    Format - email
   */
  email: string;
  /**
   *
   */
  options?: OptionsRedirectTo;
}

/**
 *
 */
export interface UserPasswordResetRequest {
  /**
   * A valid email
   *    Example - "john.smith@nhost.io"
   *    Format - email
   */
  email: string;
  /**
   *
   */
  options?: OptionsRedirectTo;
}

/**
 *
 */
export interface UserPasswordRequest {
  /**
   * A password of minimum 3 characters
   *    Example - "Str0ngPassw#ord-94|%"
   *    MinLength - 3
   *    MaxLength - 50
   */
  newPassword: string;
  /**
   * Ticket to reset the password, required if the user is not authenticated
   *    Pattern - ^passwordReset\:.*$
   */
  ticket?: string;
}

/**
 *
 */
export type OKResponse = "OK";

/**
 *
 */
export interface OptionsRedirectTo {
  /**
   *
   *    Example - "https://my-app.com/catch-redirection"
   *    Format - uri
   */
  redirectTo?: string;
}

/**
 *
 */
export interface SignInAnonymousRequest {
  /**
   *
   *    Example - "John Smith"
   */
  displayName?: string;
  /**
   * A two-characters locale
   *    Example - "en"
   *    MinLength - 2
   *    MaxLength - 2
   */
  locale?: string;
  /**
   *
   *    Example - {"firstName":"John","lastName":"Smith"}
   */
  metadata?: Record<string, unknown>;
}

/**
 * Request to authenticate using email and password
 */
export interface SignInEmailPasswordRequest {
  /**
   * User's email address
   *    Example - "john.smith@nhost.io"
   *    Format - email
   */
  email: string;
  /**
   * User's password
   *    Example - "Str0ngPassw#ord-94|%"
   *    MinLength - 3
   *    MaxLength - 50
   */
  password: string;
}

/**
 *
 */
export interface SignInPasswordlessEmailRequest {
  /**
   * A valid email
   *    Example - "john.smith@nhost.io"
   *    Format - email
   */
  email: string;
  /**
   *
   */
  options?: SignUpOptions;
}

/**
 *
 */
export interface SignInOTPEmailRequest {
  /**
   * A valid email
   *    Example - "john.smith@nhost.io"
   *    Format - email
   */
  email: string;
  /**
   *
   */
  options?: SignUpOptions;
}

/**
 *
 */
export interface SignInOTPEmailVerifyRequest {
  /**
   * One time password
   */
  otp: string;
  /**
   * A valid email
   *    Example - "john.smith@nhost.io"
   *    Format - email
   */
  email: string;
}

/**
 *
 */
export interface SignInOTPEmailVerifyResponse {
  /**
   * User authentication session containing tokens and user information
   */
  session?: Session;
}

/**
 * Request to register a new user with email and password
 */
export interface SignUpEmailPasswordRequest {
  /**
   * Email address for the new user account
   *    Example - "john.smith@nhost.io"
   *    Format - email
   */
  email: string;
  /**
   * Password for the new user account
   *    Example - "Str0ngPassw#ord-94|%"
   *    MinLength - 3
   *    MaxLength - 50
   */
  password: string;
  /**
   *
   */
  options?: SignUpOptions;
}

/**
 *
 */
export interface SignUpOptions {
  /**
   *
   *    Example - ["me","user"]
   */
  allowedRoles?: string[];
  /**
   *
   *    Example - "user"
   */
  defaultRole?: string;
  /**
   *
   *    Example - "John Smith"
   *    Pattern - ^[\p{L}\p{N}\p{S} ,.'-]+$
   *    MaxLength - 32
   */
  displayName?: string;
  /**
   * A two-characters locale
   *    Example - "en"
   *    MinLength - 2
   *    MaxLength - 2
   */
  locale?: string;
  /**
   *
   *    Example - {"firstName":"John","lastName":"Smith"}
   */
  metadata?: Record<string, unknown>;
  /**
   *
   *    Example - "https://my-app.com/catch-redirection"
   *    Format - uri
   */
  redirectTo?: string;
}

/**
 *
 */
export interface SignInWebauthnRequest {
  /**
   * A valid email
   *    Example - "john.smith@nhost.io"
   *    Format - email
   */
  email?: string;
}

/**
 *
 */
export interface SignUpWebauthnRequest {
  /**
   * A valid email
   *    Example - "john.smith@nhost.io"
   *    Format - email
   */
  email: string;
  /**
   *
   */
  options?: SignUpOptions;
}

/**
 *
 */
export interface SignInWebauthnVerifyRequest {
  /**
   * A valid email. Deprecated, no longer used
   *    Example - "john.smith@nhost.io"
   *    Format - email
   */
  email?: string;
  /**
   *
   */
  credential: Record<string, unknown>;
}

/**
 *
 */
export interface SignInIdTokenRequest {
  /**
   *
   */
  provider: IdTokenProvider;
  /**
   * Apple ID token
   */
  idToken: string;
  /**
   * Nonce used during sign in process
   */
  nonce?: string;
  /**
   *
   */
  options?: SignUpOptions;
}

/**
 *
 */
export interface SignInMfaTotpRequest {
  /**
   * Ticket
   *    Pattern - ^mfaTotp:.*$
   */
  ticket: string;
  /**
   * One time password
   */
  otp: string;
}

/**
 *
 */
export type IdTokenProvider = "apple" | "google";

/**
 *
 */
export interface LinkIdTokenRequest {
  /**
   *
   */
  provider: IdTokenProvider;
  /**
   * Apple ID token
   */
  idToken: string;
  /**
   * Nonce used during sign in process
   */
  nonce?: string;
}

/**
 * Type of MFA to activate. Use empty string to disable MFA.
 */
export type UserMfaRequestActiveMfaType = "totp" | "";

/**
 * Request to activate or deactivate multi-factor authentication
 */
export interface UserMfaRequest {
  /**
   * Verification code from the authenticator app when activating MFA
   *    Example - "123456"
   */
  code: string;
  /**
   * Type of MFA to activate. Use empty string to disable MFA.
   *    Example - "totp"
   */
  activeMfaType?: UserMfaRequestActiveMfaType;
}

/**
 * Response containing TOTP setup information for MFA
 */
export interface TotpGenerateResponse {
  /**
   * URL to QR code image for scanning with an authenticator app
   *    Example - "data:image/png;base64,iVBORw0KGg..."
   */
  imageUrl: string;
  /**
   * TOTP secret key for manual setup with an authenticator app
   *    Example - "ABCDEFGHIJK23456"
   */
  totpSecret: string;
}

/**
 *
 */
export type SignInProvider =
  | "apple"
  | "github"
  | "google"
  | "linkedin"
  | "discord"
  | "spotify";

/**
 * Ticket
 */
export type TicketQuery = string;

/**
 * Type of the ticket
 */
export type TicketTypeQuery =
  | "emailVerify"
  | "emailConfirmChange"
  | "signinPasswordless"
  | "passwordReset";

/**
 * Target URL for the redirect
 */
export type RedirectToQuery = string;

/**
 *
 */
export interface GetVersionResponse200 {
  /**
   * The version of the authentication service
   *    Example - "1.2.3"
   */
  version: string;
}

/**
 * Parameters for the verifyTicket method.
    * @param ticket - Ticket

    *    Ticket
    * @param type - Type of the ticket. Deprecated, no longer used

    *    Type of the ticket
    * @param redirectTo - Target URL for the redirect

    *    Target URL for the redirect*/
export interface VerifyTicketParams {
  /**
   * Ticket

    *    Ticket
   */
  ticket: TicketQuery;
  /**
   * Type of the ticket. Deprecated, no longer used

    *    Type of the ticket
   */
  type?: TicketTypeQuery;
  /**
   * Target URL for the redirect

    *    Target URL for the redirect
   */
  redirectTo: RedirectToQuery;
}
/**
 * Parameters for the signInProvider method.
    * @param allowedRoles - Array of allowed roles for the user

    * @param defaultRole - Default role for the user

    * @param displayName - Display name for the user

    * @param locale - A two-characters locale

    * @param metadata - Additional metadata for the user

    * @param redirectTo - URI to redirect to

    * @param connect - If set, this means that the user is already authenticated and wants to link their account. This needs to be a valid JWT access token.
  */
export interface SignInProviderParams {
  /**
   * Array of allowed roles for the user

   */
  allowedRoles?: string[];
  /**
   * Default role for the user

   */
  defaultRole?: string;
  /**
   * Display name for the user

   */
  displayName?: string;
  /**
   * A two-characters locale

   */
  locale?: string;
  /**
   * Additional metadata for the user

   */
  metadata?: Record<string, unknown>;
  /**
   * URI to redirect to

   */
  redirectTo?: string;
  /**
   * If set, this means that the user is already authenticated and wants to link their account. This needs to be a valid JWT access token.

   */
  connect?: string;
}

export const createAPIClient = (
  baseURL: string,
  chainFunctions: ChainFunction[] = [],
): Client => {
  let fetch = createEnhancedFetch(chainFunctions);

  const pushChainFunction = (chainFunction: ChainFunction) => {
    chainFunctions.push(chainFunction);
    fetch = createEnhancedFetch(chainFunctions);
  };
  const healthCheckHead = async (
    options?: RequestInit,
  ): Promise<FetchResponse<void>> => {
    const url = baseURL + `/healthz`;
    const res = await fetch(url, {
      ...options,
      method: "HEAD",
      headers: {
        ...options?.headers,
      },
    });

    if (res.status >= 300) {
      const responseBody = [412].includes(res.status) ? null : await res.text();
      const payload: unknown = responseBody ? JSON.parse(responseBody) : {};
      throw new FetchError(payload, res.status, res.headers);
    }

    const payload: void = undefined;

    return {
      body: payload,
      status: res.status,
      headers: res.headers,
    } as FetchResponse<void>;
  };

  const healthCheckGet = async (
    options?: RequestInit,
  ): Promise<FetchResponse<OKResponse>> => {
    const url = baseURL + `/healthz`;
    const res = await fetch(url, {
      ...options,
      method: "GET",
      headers: {
        ...options?.headers,
      },
    });

    if (res.status >= 300) {
      const responseBody = [412].includes(res.status) ? null : await res.text();
      const payload: unknown = responseBody ? JSON.parse(responseBody) : {};
      throw new FetchError(payload, res.status, res.headers);
    }

    const responseBody = [204, 205, 304].includes(res.status)
      ? null
      : await res.text();
    const payload: OKResponse = responseBody ? JSON.parse(responseBody) : {};

    return {
      body: payload,
      status: res.status,
      headers: res.headers,
    } as FetchResponse<OKResponse>;
  };

  const getVersion = async (
    options?: RequestInit,
  ): Promise<FetchResponse<GetVersionResponse200>> => {
    const url = baseURL + `/version`;
    const res = await fetch(url, {
      ...options,
      method: "GET",
      headers: {
        ...options?.headers,
      },
    });

    if (res.status >= 300) {
      const responseBody = [412].includes(res.status) ? null : await res.text();
      const payload: unknown = responseBody ? JSON.parse(responseBody) : {};
      throw new FetchError(payload, res.status, res.headers);
    }

    const responseBody = [204, 205, 304].includes(res.status)
      ? null
      : await res.text();
    const payload: GetVersionResponse200 = responseBody
      ? JSON.parse(responseBody)
      : {};

    return {
      body: payload,
      status: res.status,
      headers: res.headers,
    } as FetchResponse<GetVersionResponse200>;
  };

  const refreshToken = async (
    body: RefreshTokenRequest,
    options?: RequestInit,
  ): Promise<FetchResponse<Session>> => {
    const url = baseURL + `/token`;
    const res = await fetch(url, {
      ...options,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      body: JSON.stringify(body),
    });

    if (res.status >= 300) {
      const responseBody = [412].includes(res.status) ? null : await res.text();
      const payload: unknown = responseBody ? JSON.parse(responseBody) : {};
      throw new FetchError(payload, res.status, res.headers);
    }

    const responseBody = [204, 205, 304].includes(res.status)
      ? null
      : await res.text();
    const payload: Session = responseBody ? JSON.parse(responseBody) : {};

    return {
      body: payload,
      status: res.status,
      headers: res.headers,
    } as FetchResponse<Session>;
  };

  const signOut = async (
    body: SignOutSchema,
    options?: RequestInit,
  ): Promise<FetchResponse<OKResponse>> => {
    const url = baseURL + `/signout`;
    const res = await fetch(url, {
      ...options,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      body: JSON.stringify(body),
    });

    if (res.status >= 300) {
      const responseBody = [412].includes(res.status) ? null : await res.text();
      const payload: unknown = responseBody ? JSON.parse(responseBody) : {};
      throw new FetchError(payload, res.status, res.headers);
    }

    const responseBody = [204, 205, 304].includes(res.status)
      ? null
      : await res.text();
    const payload: OKResponse = responseBody ? JSON.parse(responseBody) : {};

    return {
      body: payload,
      status: res.status,
      headers: res.headers,
    } as FetchResponse<OKResponse>;
  };

  const signInEmailPassword = async (
    body: SignInEmailPasswordRequest,
    options?: RequestInit,
  ): Promise<FetchResponse<SignInEmailPasswordResponse>> => {
    const url = baseURL + `/signin/email-password`;
    const res = await fetch(url, {
      ...options,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      body: JSON.stringify(body),
    });

    if (res.status >= 300) {
      const responseBody = [412].includes(res.status) ? null : await res.text();
      const payload: unknown = responseBody ? JSON.parse(responseBody) : {};
      throw new FetchError(payload, res.status, res.headers);
    }

    const responseBody = [204, 205, 304].includes(res.status)
      ? null
      : await res.text();
    const payload: SignInEmailPasswordResponse = responseBody
      ? JSON.parse(responseBody)
      : {};

    return {
      body: payload,
      status: res.status,
      headers: res.headers,
    } as FetchResponse<SignInEmailPasswordResponse>;
  };

  const signInVerifyMfaTotp = async (
    body: SignInMfaTotpRequest,
    options?: RequestInit,
  ): Promise<FetchResponse<SessionPayload>> => {
    const url = baseURL + `/signin/mfa/totp`;
    const res = await fetch(url, {
      ...options,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      body: JSON.stringify(body),
    });

    if (res.status >= 300) {
      const responseBody = [412].includes(res.status) ? null : await res.text();
      const payload: unknown = responseBody ? JSON.parse(responseBody) : {};
      throw new FetchError(payload, res.status, res.headers);
    }

    const responseBody = [204, 205, 304].includes(res.status)
      ? null
      : await res.text();
    const payload: SessionPayload = responseBody
      ? JSON.parse(responseBody)
      : {};

    return {
      body: payload,
      status: res.status,
      headers: res.headers,
    } as FetchResponse<SessionPayload>;
  };

  const signInPasswordlessEmail = async (
    body: SignInPasswordlessEmailRequest,
    options?: RequestInit,
  ): Promise<FetchResponse<OKResponse>> => {
    const url = baseURL + `/signin/passwordless/email`;
    const res = await fetch(url, {
      ...options,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      body: JSON.stringify(body),
    });

    if (res.status >= 300) {
      const responseBody = [412].includes(res.status) ? null : await res.text();
      const payload: unknown = responseBody ? JSON.parse(responseBody) : {};
      throw new FetchError(payload, res.status, res.headers);
    }

    const responseBody = [204, 205, 304].includes(res.status)
      ? null
      : await res.text();
    const payload: OKResponse = responseBody ? JSON.parse(responseBody) : {};

    return {
      body: payload,
      status: res.status,
      headers: res.headers,
    } as FetchResponse<OKResponse>;
  };

  const signUpEmailPassword = async (
    body: SignUpEmailPasswordRequest,
    options?: RequestInit,
  ): Promise<FetchResponse<SessionPayload>> => {
    const url = baseURL + `/signup/email-password`;
    const res = await fetch(url, {
      ...options,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      body: JSON.stringify(body),
    });

    if (res.status >= 300) {
      const responseBody = [412].includes(res.status) ? null : await res.text();
      const payload: unknown = responseBody ? JSON.parse(responseBody) : {};
      throw new FetchError(payload, res.status, res.headers);
    }

    const responseBody = [204, 205, 304].includes(res.status)
      ? null
      : await res.text();
    const payload: SessionPayload = responseBody
      ? JSON.parse(responseBody)
      : {};

    return {
      body: payload,
      status: res.status,
      headers: res.headers,
    } as FetchResponse<SessionPayload>;
  };

  const changeUserMfaVerify = async (
    body: UserMfaRequest,
    options?: RequestInit,
  ): Promise<FetchResponse<OKResponse>> => {
    const url = baseURL + `/user/mfa`;
    const res = await fetch(url, {
      ...options,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      body: JSON.stringify(body),
    });

    if (res.status >= 300) {
      const responseBody = [412].includes(res.status) ? null : await res.text();
      const payload: unknown = responseBody ? JSON.parse(responseBody) : {};
      throw new FetchError(payload, res.status, res.headers);
    }

    const responseBody = [204, 205, 304].includes(res.status)
      ? null
      : await res.text();
    const payload: OKResponse = responseBody ? JSON.parse(responseBody) : {};

    return {
      body: payload,
      status: res.status,
      headers: res.headers,
    } as FetchResponse<OKResponse>;
  };

  const changeUserMfa = async (
    options?: RequestInit,
  ): Promise<FetchResponse<TotpGenerateResponse>> => {
    const url = baseURL + `/mfa/totp/generate`;
    const res = await fetch(url, {
      ...options,
      method: "GET",
      headers: {
        ...options?.headers,
      },
    });

    if (res.status >= 300) {
      const responseBody = [412].includes(res.status) ? null : await res.text();
      const payload: unknown = responseBody ? JSON.parse(responseBody) : {};
      throw new FetchError(payload, res.status, res.headers);
    }

    const responseBody = [204, 205, 304].includes(res.status)
      ? null
      : await res.text();
    const payload: TotpGenerateResponse = responseBody
      ? JSON.parse(responseBody)
      : {};

    return {
      body: payload,
      status: res.status,
      headers: res.headers,
    } as FetchResponse<TotpGenerateResponse>;
  };

  const getJWKs = async (
    options?: RequestInit,
  ): Promise<FetchResponse<JWKSet>> => {
    const url = baseURL + `/.well-known/jwks.json`;
    const res = await fetch(url, {
      ...options,
      method: "GET",
      headers: {
        ...options?.headers,
      },
    });

    if (res.status >= 300) {
      const responseBody = [412].includes(res.status) ? null : await res.text();
      const payload: unknown = responseBody ? JSON.parse(responseBody) : {};
      throw new FetchError(payload, res.status, res.headers);
    }

    const responseBody = [204, 205, 304].includes(res.status)
      ? null
      : await res.text();
    const payload: JWKSet = responseBody ? JSON.parse(responseBody) : {};

    return {
      body: payload,
      status: res.status,
      headers: res.headers,
    } as FetchResponse<JWKSet>;
  };

  const createPAT = async (
    body: CreatePATRequest,
    options?: RequestInit,
  ): Promise<FetchResponse<CreatePATResponse>> => {
    const url = baseURL + `/pat`;
    const res = await fetch(url, {
      ...options,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      body: JSON.stringify(body),
    });

    if (res.status >= 300) {
      const responseBody = [412].includes(res.status) ? null : await res.text();
      const payload: unknown = responseBody ? JSON.parse(responseBody) : {};
      throw new FetchError(payload, res.status, res.headers);
    }

    const responseBody = [204, 205, 304].includes(res.status)
      ? null
      : await res.text();
    const payload: CreatePATResponse = responseBody
      ? JSON.parse(responseBody)
      : {};

    return {
      body: payload,
      status: res.status,
      headers: res.headers,
    } as FetchResponse<CreatePATResponse>;
  };

  const signInAnonymous = async (
    body?: SignInAnonymousRequest,
    options?: RequestInit,
  ): Promise<FetchResponse<SessionPayload>> => {
    const url = baseURL + `/signin/anonymous`;
    const res = await fetch(url, {
      ...options,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      body: JSON.stringify(body),
    });

    if (res.status >= 300) {
      const responseBody = [412].includes(res.status) ? null : await res.text();
      const payload: unknown = responseBody ? JSON.parse(responseBody) : {};
      throw new FetchError(payload, res.status, res.headers);
    }

    const responseBody = [204, 205, 304].includes(res.status)
      ? null
      : await res.text();
    const payload: SessionPayload = responseBody
      ? JSON.parse(responseBody)
      : {};

    return {
      body: payload,
      status: res.status,
      headers: res.headers,
    } as FetchResponse<SessionPayload>;
  };

  const signInOTPEmail = async (
    body: SignInOTPEmailRequest,
    options?: RequestInit,
  ): Promise<FetchResponse<OKResponse>> => {
    const url = baseURL + `/signin/otp/email`;
    const res = await fetch(url, {
      ...options,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      body: JSON.stringify(body),
    });

    if (res.status >= 300) {
      const responseBody = [412].includes(res.status) ? null : await res.text();
      const payload: unknown = responseBody ? JSON.parse(responseBody) : {};
      throw new FetchError(payload, res.status, res.headers);
    }

    const responseBody = [204, 205, 304].includes(res.status)
      ? null
      : await res.text();
    const payload: OKResponse = responseBody ? JSON.parse(responseBody) : {};

    return {
      body: payload,
      status: res.status,
      headers: res.headers,
    } as FetchResponse<OKResponse>;
  };

  const verifySignInOTPEmail = async (
    body: SignInOTPEmailVerifyRequest,
    options?: RequestInit,
  ): Promise<FetchResponse<SignInOTPEmailVerifyResponse>> => {
    const url = baseURL + `/signin/otp/email/verify`;
    const res = await fetch(url, {
      ...options,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      body: JSON.stringify(body),
    });

    if (res.status >= 300) {
      const responseBody = [412].includes(res.status) ? null : await res.text();
      const payload: unknown = responseBody ? JSON.parse(responseBody) : {};
      throw new FetchError(payload, res.status, res.headers);
    }

    const responseBody = [204, 205, 304].includes(res.status)
      ? null
      : await res.text();
    const payload: SignInOTPEmailVerifyResponse = responseBody
      ? JSON.parse(responseBody)
      : {};

    return {
      body: payload,
      status: res.status,
      headers: res.headers,
    } as FetchResponse<SignInOTPEmailVerifyResponse>;
  };

  const signInPAT = async (
    body: SignInPATRequest,
    options?: RequestInit,
  ): Promise<FetchResponse<SessionPayload>> => {
    const url = baseURL + `/signin/pat`;
    const res = await fetch(url, {
      ...options,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      body: JSON.stringify(body),
    });

    if (res.status >= 300) {
      const responseBody = [412].includes(res.status) ? null : await res.text();
      const payload: unknown = responseBody ? JSON.parse(responseBody) : {};
      throw new FetchError(payload, res.status, res.headers);
    }

    const responseBody = [204, 205, 304].includes(res.status)
      ? null
      : await res.text();
    const payload: SessionPayload = responseBody
      ? JSON.parse(responseBody)
      : {};

    return {
      body: payload,
      status: res.status,
      headers: res.headers,
    } as FetchResponse<SessionPayload>;
  };

  const signInIdToken = async (
    body: SignInIdTokenRequest,
    options?: RequestInit,
  ): Promise<FetchResponse<SessionPayload>> => {
    const url = baseURL + `/signin/idtoken`;
    const res = await fetch(url, {
      ...options,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      body: JSON.stringify(body),
    });

    if (res.status >= 300) {
      const responseBody = [412].includes(res.status) ? null : await res.text();
      const payload: unknown = responseBody ? JSON.parse(responseBody) : {};
      throw new FetchError(payload, res.status, res.headers);
    }

    const responseBody = [204, 205, 304].includes(res.status)
      ? null
      : await res.text();
    const payload: SessionPayload = responseBody
      ? JSON.parse(responseBody)
      : {};

    return {
      body: payload,
      status: res.status,
      headers: res.headers,
    } as FetchResponse<SessionPayload>;
  };

  const linkIdToken = async (
    body: LinkIdTokenRequest,
    options?: RequestInit,
  ): Promise<FetchResponse<OKResponse>> => {
    const url = baseURL + `/link/idtoken`;
    const res = await fetch(url, {
      ...options,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      body: JSON.stringify(body),
    });

    if (res.status >= 300) {
      const responseBody = [412].includes(res.status) ? null : await res.text();
      const payload: unknown = responseBody ? JSON.parse(responseBody) : {};
      throw new FetchError(payload, res.status, res.headers);
    }

    const responseBody = [204, 205, 304].includes(res.status)
      ? null
      : await res.text();
    const payload: OKResponse = responseBody ? JSON.parse(responseBody) : {};

    return {
      body: payload,
      status: res.status,
      headers: res.headers,
    } as FetchResponse<OKResponse>;
  };

  const deanonymizeUser = async (
    body: UserDeanonymizeRequest,
    options?: RequestInit,
  ): Promise<FetchResponse<OKResponse>> => {
    const url = baseURL + `/user/deanonymize`;
    const res = await fetch(url, {
      ...options,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      body: JSON.stringify(body),
    });

    if (res.status >= 300) {
      const responseBody = [412].includes(res.status) ? null : await res.text();
      const payload: unknown = responseBody ? JSON.parse(responseBody) : {};
      throw new FetchError(payload, res.status, res.headers);
    }

    const responseBody = [204, 205, 304].includes(res.status)
      ? null
      : await res.text();
    const payload: OKResponse = responseBody ? JSON.parse(responseBody) : {};

    return {
      body: payload,
      status: res.status,
      headers: res.headers,
    } as FetchResponse<OKResponse>;
  };

  const changeUserEmail = async (
    body: UserEmailChangeRequest,
    options?: RequestInit,
  ): Promise<FetchResponse<OKResponse>> => {
    const url = baseURL + `/user/email/change`;
    const res = await fetch(url, {
      ...options,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      body: JSON.stringify(body),
    });

    if (res.status >= 300) {
      const responseBody = [412].includes(res.status) ? null : await res.text();
      const payload: unknown = responseBody ? JSON.parse(responseBody) : {};
      throw new FetchError(payload, res.status, res.headers);
    }

    const responseBody = [204, 205, 304].includes(res.status)
      ? null
      : await res.text();
    const payload: OKResponse = responseBody ? JSON.parse(responseBody) : {};

    return {
      body: payload,
      status: res.status,
      headers: res.headers,
    } as FetchResponse<OKResponse>;
  };

  const sendVerificationEmail = async (
    body: UserEmailSendVerificationEmailRequest,
    options?: RequestInit,
  ): Promise<FetchResponse<OKResponse>> => {
    const url = baseURL + `/user/email/send-verification-email`;
    const res = await fetch(url, {
      ...options,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      body: JSON.stringify(body),
    });

    if (res.status >= 300) {
      const responseBody = [412].includes(res.status) ? null : await res.text();
      const payload: unknown = responseBody ? JSON.parse(responseBody) : {};
      throw new FetchError(payload, res.status, res.headers);
    }

    const responseBody = [204, 205, 304].includes(res.status)
      ? null
      : await res.text();
    const payload: OKResponse = responseBody ? JSON.parse(responseBody) : {};

    return {
      body: payload,
      status: res.status,
      headers: res.headers,
    } as FetchResponse<OKResponse>;
  };

  const changeUserPassword = async (
    body: UserPasswordRequest,
    options?: RequestInit,
  ): Promise<FetchResponse<OKResponse>> => {
    const url = baseURL + `/user/password`;
    const res = await fetch(url, {
      ...options,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      body: JSON.stringify(body),
    });

    if (res.status >= 300) {
      const responseBody = [412].includes(res.status) ? null : await res.text();
      const payload: unknown = responseBody ? JSON.parse(responseBody) : {};
      throw new FetchError(payload, res.status, res.headers);
    }

    const responseBody = [204, 205, 304].includes(res.status)
      ? null
      : await res.text();
    const payload: OKResponse = responseBody ? JSON.parse(responseBody) : {};

    return {
      body: payload,
      status: res.status,
      headers: res.headers,
    } as FetchResponse<OKResponse>;
  };

  const sendPasswordResetEmail = async (
    body: UserPasswordResetRequest,
    options?: RequestInit,
  ): Promise<FetchResponse<OKResponse>> => {
    const url = baseURL + `/user/password/reset`;
    const res = await fetch(url, {
      ...options,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      body: JSON.stringify(body),
    });

    if (res.status >= 300) {
      const responseBody = [412].includes(res.status) ? null : await res.text();
      const payload: unknown = responseBody ? JSON.parse(responseBody) : {};
      throw new FetchError(payload, res.status, res.headers);
    }

    const responseBody = [204, 205, 304].includes(res.status)
      ? null
      : await res.text();
    const payload: OKResponse = responseBody ? JSON.parse(responseBody) : {};

    return {
      body: payload,
      status: res.status,
      headers: res.headers,
    } as FetchResponse<OKResponse>;
  };

  const verifyTicketURL = (params?: VerifyTicketParams): string => {
    const normalizedParams = new URLSearchParams();

    Object.entries(params || {}).forEach(([key, value]) => {
      if (value !== undefined) {
        normalizedParams.append(
          key,
          value === null ? "null" : value.toString(),
        );
      }
    });

    const stringifiedParams = normalizedParams.toString();

    const url =
      stringifiedParams.length > 0
        ? baseURL + `/verify?${stringifiedParams}`
        : baseURL + `/verify`;
    return url;
  };

  const signInProviderURL = (
    provider: SignInProvider,
    params?: SignInProviderParams,
  ): string => {
    const normalizedParams = new URLSearchParams();

    Object.entries(params || {}).forEach(([key, value]) => {
      if (value !== undefined) {
        normalizedParams.append(
          key,
          value === null ? "null" : value.toString(),
        );
      }
    });

    const stringifiedParams = normalizedParams.toString();

    const url =
      stringifiedParams.length > 0
        ? baseURL + `/signin/provider/${provider}?${stringifiedParams}`
        : baseURL + `/signin/provider/${provider}`;
    return url;
  };

  return {
    baseURL,
    pushChainFunction,
    healthCheckHead,
    healthCheckGet,
    getVersion,
    refreshToken,
    signOut,
    signInEmailPassword,
    signInVerifyMfaTotp,
    signInPasswordlessEmail,
    signUpEmailPassword,
    changeUserMfaVerify,
    changeUserMfa,
    getJWKs,
    createPAT,
    signInAnonymous,
    signInOTPEmail,
    verifySignInOTPEmail,
    signInPAT,
    signInIdToken,
    linkIdToken,
    deanonymizeUser,
    changeUserEmail,
    sendVerificationEmail,
    changeUserPassword,
    sendPasswordResetEmail,
    verifyTicketURL,
    signInProviderURL,
  };
};
