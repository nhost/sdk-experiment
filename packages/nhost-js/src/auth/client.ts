/**
 * This file is auto-generated. Do not edit manually.
 */

import { FetchError, createEnhancedFetch } from "../fetch";
import type { ChainFunction, FetchResponse } from "../fetch";

/**
 * JSON Web Key Set for verifying JWT signatures
 @property keys (`JWK[]`) - Array of public keys*/
export interface JWKSet {
  /**
   * Array of public keys
   */
  keys: JWK[];
}

/**
 * JSON Web Key for JWT verification
 @property alg (`string`) - Algorithm used with this key
    *    Example - `"RS256"`
 @property e (`string`) - RSA public exponent
    *    Example - `"AQAB"`
 @property kid (`string`) - Key ID
    *    Example - `"key-id-1"`
 @property kty (`string`) - Key type
    *    Example - `"RSA"`
 @property n (`string`) - RSA modulus
    *    Example - `"abcd1234..."`
 @property use (`string`) - Key usage
    *    Example - `"sig"`*/
export interface JWK {
  /**
   * Algorithm used with this key
   *    Example - `"RS256"`
   */
  alg: string;
  /**
   * RSA public exponent
   *    Example - `"AQAB"`
   */
  e: string;
  /**
   * Key ID
   *    Example - `"key-id-1"`
   */
  kid: string;
  /**
   * Key type
   *    Example - `"RSA"`
   */
  kty: string;
  /**
   * RSA modulus
   *    Example - `"abcd1234..."`
   */
  n: string;
  /**
   * Key usage
   *    Example - `"sig"`
   */
  use: string;
}

/**
 * Request to refresh an access token
 @property refreshToken (`string`) - Refresh token used to generate a new access token
    *    Example - `"2c35b6f3-c4b9-48e3-978a-d4d0f1d42e24"`
    *    Pattern - \b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b*/
export interface RefreshTokenRequest {
  /**
   * Refresh token used to generate a new access token
   *    Example - `"2c35b6f3-c4b9-48e3-978a-d4d0f1d42e24"`
   *    Pattern - \b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b
   */
  refreshToken: string;
}

/**
 * 
 @property refreshToken (`string`) - Refresh token for the current session
 @property all? (`boolean`) - Sign out from all connected devices*/
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
 @property expiresAt (`string`) - Expiration date of the PAT
    *    Format - date-time
 @property metadata? (`Record<string, unknown>`) - 
    *    Example - `{"name":"my-pat","used-by":"my-app-cli"}`*/
export interface CreatePATRequest {
  /**
   * Expiration date of the PAT
   *    Format - date-time
   */
  expiresAt: string;
  /**
   *
   *    Example - `{"name":"my-pat","used-by":"my-app-cli"}`
   */
  metadata?: Record<string, unknown>;
}

/**
 * 
 @property id (`string`) - ID of the PAT
    *    Example - `"2c35b6f3-c4b9-48e3-978a-d4d0f1d42e24"`
    *    Pattern - \b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b
 @property personalAccessToken (`string`) - PAT
    *    Example - `"2c35b6f3-c4b9-48e3-978a-d4d0f1d42e24"`
    *    Pattern - \b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b*/
export interface CreatePATResponse {
  /**
   * ID of the PAT
   *    Example - `"2c35b6f3-c4b9-48e3-978a-d4d0f1d42e24"`
   *    Pattern - \b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b
   */
  id: string;
  /**
   * PAT
   *    Example - `"2c35b6f3-c4b9-48e3-978a-d4d0f1d42e24"`
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
 @property status (`number`) - HTTP status error code
    *    Example - `400`
 @property message (`string`) - Human-friendly error message
    *    Example - `"Invalid email format"`
 @property error (`ErrorResponseError`) - Error code identifying the specific application error*/
export interface ErrorResponse {
  /**
   * HTTP status error code
   *    Example - `400`
   */
  status: number;
  /**
   * Human-friendly error message
   *    Example - `"Invalid email format"`
   */
  message: string;
  /**
   * Error code identifying the specific application error
   */
  error: ErrorResponseError;
}

/**
 * Response for email-password authentication that may include a session or MFA challenge
 @property session? (`Session`) - User authentication session containing tokens and user information
 @property mfa? (`MFAChallengePayload`) - Challenge payload for multi-factor authentication*/
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
 @property ticket (`string`) - Ticket to use when completing the MFA challenge
    *    Example - `"mfaTotp:abc123def456"`*/
export interface MFAChallengePayload {
  /**
   * Ticket to use when completing the MFA challenge
   *    Example - `"mfaTotp:abc123def456"`
   */
  ticket: string;
}

/**
 * Container for session information
 @property session? (`Session`) - User authentication session containing tokens and user information*/
export interface SessionPayload {
  /**
   * User authentication session containing tokens and user information
   */
  session?: Session;
}

/**
 * User authentication session containing tokens and user information
 @property accessToken (`string`) - JWT token for authenticating API requests
    *    Example - `"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."`
 @property accessTokenExpiresIn (`number`) - Expiration time of the access token in seconds
    *    Example - `900`
    *    Format - int64
 @property refreshTokenId (`string`) - Identifier for the refresh token
    *    Example - `"2c35b6f3-c4b9-48e3-978a-d4d0f1d42e24"`
    *    Pattern - \b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b
 @property refreshToken (`string`) - Token used to refresh the access token
    *    Example - `"2c35b6f3-c4b9-48e3-978a-d4d0f1d42e24"`
    *    Pattern - \b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b
 @property user? (`User`) - User profile and account information*/
export interface Session {
  /**
   * JWT token for authenticating API requests
   *    Example - `"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."`
   */
  accessToken: string;
  /**
   * Expiration time of the access token in seconds
   *    Example - `900`
   *    Format - int64
   */
  accessTokenExpiresIn: number;
  /**
   * Identifier for the refresh token
   *    Example - `"2c35b6f3-c4b9-48e3-978a-d4d0f1d42e24"`
   *    Pattern - \b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b
   */
  refreshTokenId: string;
  /**
   * Token used to refresh the access token
   *    Example - `"2c35b6f3-c4b9-48e3-978a-d4d0f1d42e24"`
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
 @property personalAccessToken (`string`) - PAT
    *    Example - `"2c35b6f3-c4b9-48e3-978a-d4d0f1d42e24"`
    *    Pattern - \b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b*/
export interface SignInPATRequest {
  /**
   * PAT
   *    Example - `"2c35b6f3-c4b9-48e3-978a-d4d0f1d42e24"`
   *    Pattern - \b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b
   */
  personalAccessToken: string;
}

/**
 * User profile and account information
 @property avatarUrl (`string`) - URL to the user's profile picture
    *    Example - `"https://myapp.com/avatars/user123.jpg"`
 @property createdAt (`string`) - Timestamp when the user account was created
    *    Example - `"2023-01-15T12:34:56Z"`
    *    Format - date-time
 @property defaultRole (`string`) - Default authorization role for the user
    *    Example - `"user"`
 @property displayName (`string`) - User's display name
    *    Example - `"John Smith"`
 @property email? (`string`) - User's email address
    *    Example - `"john.smith@nhost.io"`
    *    Format - email
 @property emailVerified (`boolean`) - Whether the user's email has been verified
    *    Example - `true`
 @property id (`string`) - Unique identifier for the user
    *    Example - `"2c35b6f3-c4b9-48e3-978a-d4d0f1d42e24"`
    *    Pattern - \b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b
 @property isAnonymous (`boolean`) - Whether this is an anonymous user account
    *    Example - `false`
 @property locale (`string`) - User's preferred locale (language code)
    *    Example - `"en"`
    *    MinLength - 2
    *    MaxLength - 2
 @property metadata (`Record<string, unknown>`) - Custom metadata associated with the user
    *    Example - `{"firstName":"John","lastName":"Smith"}`
 @property phoneNumber? (`string`) - User's phone number
    *    Example - `"+12025550123"`
 @property phoneNumberVerified (`boolean`) - Whether the user's phone number has been verified
    *    Example - `false`
 @property roles (`string[]`) - List of roles assigned to the user
    *    Example - `["user","customer"]`*/
export interface User {
  /**
   * URL to the user's profile picture
   *    Example - `"https://myapp.com/avatars/user123.jpg"`
   */
  avatarUrl: string;
  /**
   * Timestamp when the user account was created
   *    Example - `"2023-01-15T12:34:56Z"`
   *    Format - date-time
   */
  createdAt: string;
  /**
   * Default authorization role for the user
   *    Example - `"user"`
   */
  defaultRole: string;
  /**
   * User's display name
   *    Example - `"John Smith"`
   */
  displayName: string;
  /**
   * User's email address
   *    Example - `"john.smith@nhost.io"`
   *    Format - email
   */
  email?: string;
  /**
   * Whether the user's email has been verified
   *    Example - `true`
   */
  emailVerified: boolean;
  /**
   * Unique identifier for the user
   *    Example - `"2c35b6f3-c4b9-48e3-978a-d4d0f1d42e24"`
   *    Pattern - \b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b
   */
  id: string;
  /**
   * Whether this is an anonymous user account
   *    Example - `false`
   */
  isAnonymous: boolean;
  /**
   * User's preferred locale (language code)
   *    Example - `"en"`
   *    MinLength - 2
   *    MaxLength - 2
   */
  locale: string;
  /**
   * Custom metadata associated with the user
   *    Example - `{"firstName":"John","lastName":"Smith"}`
   */
  metadata: Record<string, unknown>;
  /**
   * User's phone number
   *    Example - `"+12025550123"`
   */
  phoneNumber?: string;
  /**
   * Whether the user's phone number has been verified
   *    Example - `false`
   */
  phoneNumberVerified: boolean;
  /**
   * List of roles assigned to the user
   *    Example - `["user","customer"]`
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
 @property signInMethod (`UserDeanonymizeRequestSignInMethod`) - Which sign-in method to use
 @property email (`string`) - A valid email
    *    Example - `"john.smith@nhost.io"`
    *    Format - email
 @property password? (`string`) - A password of minimum 3 characters
    *    Example - `"Str0ngPassw#ord-94|%"`
    *    MinLength - 3
    *    MaxLength - 50
 @property connection? (`string`) - Deprecated, will be ignored
 @property options? (`SignUpOptions`) - */
export interface UserDeanonymizeRequest {
  /**
   * Which sign-in method to use
   */
  signInMethod: UserDeanonymizeRequestSignInMethod;
  /**
   * A valid email
   *    Example - `"john.smith@nhost.io"`
   *    Format - email
   */
  email: string;
  /**
   * A password of minimum 3 characters
   *    Example - `"Str0ngPassw#ord-94|%"`
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
 @property newEmail (`string`) - A valid email
    *    Example - `"john.smith@nhost.io"`
    *    Format - email
 @property options? (`OptionsRedirectTo`) - */
export interface UserEmailChangeRequest {
  /**
   * A valid email
   *    Example - `"john.smith@nhost.io"`
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
 @property email (`string`) - A valid email
    *    Example - `"john.smith@nhost.io"`
    *    Format - email
 @property options? (`OptionsRedirectTo`) - */
export interface UserEmailSendVerificationEmailRequest {
  /**
   * A valid email
   *    Example - `"john.smith@nhost.io"`
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
 @property email (`string`) - A valid email
    *    Example - `"john.smith@nhost.io"`
    *    Format - email
 @property options? (`OptionsRedirectTo`) - */
export interface UserPasswordResetRequest {
  /**
   * A valid email
   *    Example - `"john.smith@nhost.io"`
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
 @property newPassword (`string`) - A password of minimum 3 characters
    *    Example - `"Str0ngPassw#ord-94|%"`
    *    MinLength - 3
    *    MaxLength - 50
 @property ticket? (`string`) - Ticket to reset the password, required if the user is not authenticated
    *    Pattern - ^passwordReset\:.*$*/
export interface UserPasswordRequest {
  /**
   * A password of minimum 3 characters
   *    Example - `"Str0ngPassw#ord-94|%"`
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
 @property redirectTo? (`string`) - 
    *    Example - `"https://my-app.com/catch-redirection"`
    *    Format - uri*/
export interface OptionsRedirectTo {
  /**
   *
   *    Example - `"https://my-app.com/catch-redirection"`
   *    Format - uri
   */
  redirectTo?: string;
}

/**
 * 
 @property displayName? (`string`) - 
    *    Example - `"John Smith"`
 @property locale? (`string`) - A two-characters locale
    *    Example - `"en"`
    *    MinLength - 2
    *    MaxLength - 2
 @property metadata? (`Record<string, unknown>`) - 
    *    Example - `{"firstName":"John","lastName":"Smith"}`*/
export interface SignInAnonymousRequest {
  /**
   *
   *    Example - `"John Smith"`
   */
  displayName?: string;
  /**
   * A two-characters locale
   *    Example - `"en"`
   *    MinLength - 2
   *    MaxLength - 2
   */
  locale?: string;
  /**
   *
   *    Example - `{"firstName":"John","lastName":"Smith"}`
   */
  metadata?: Record<string, unknown>;
}

/**
 * Request to authenticate using email and password
 @property email (`string`) - User's email address
    *    Example - `"john.smith@nhost.io"`
    *    Format - email
 @property password (`string`) - User's password
    *    Example - `"Str0ngPassw#ord-94|%"`
    *    MinLength - 3
    *    MaxLength - 50*/
export interface SignInEmailPasswordRequest {
  /**
   * User's email address
   *    Example - `"john.smith@nhost.io"`
   *    Format - email
   */
  email: string;
  /**
   * User's password
   *    Example - `"Str0ngPassw#ord-94|%"`
   *    MinLength - 3
   *    MaxLength - 50
   */
  password: string;
}

/**
 * 
 @property email (`string`) - A valid email
    *    Example - `"john.smith@nhost.io"`
    *    Format - email
 @property options? (`SignUpOptions`) - */
export interface SignInPasswordlessEmailRequest {
  /**
   * A valid email
   *    Example - `"john.smith@nhost.io"`
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
 @property email (`string`) - A valid email
    *    Example - `"john.smith@nhost.io"`
    *    Format - email
 @property options? (`SignUpOptions`) - */
export interface SignInOTPEmailRequest {
  /**
   * A valid email
   *    Example - `"john.smith@nhost.io"`
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
 @property otp (`string`) - One time password
 @property email (`string`) - A valid email
    *    Example - `"john.smith@nhost.io"`
    *    Format - email*/
export interface SignInOTPEmailVerifyRequest {
  /**
   * One time password
   */
  otp: string;
  /**
   * A valid email
   *    Example - `"john.smith@nhost.io"`
   *    Format - email
   */
  email: string;
}

/**
 * 
 @property session? (`Session`) - User authentication session containing tokens and user information*/
export interface SignInOTPEmailVerifyResponse {
  /**
   * User authentication session containing tokens and user information
   */
  session?: Session;
}

/**
 * Request to register a new user with email and password
 @property email (`string`) - Email address for the new user account
    *    Example - `"john.smith@nhost.io"`
    *    Format - email
 @property password (`string`) - Password for the new user account
    *    Example - `"Str0ngPassw#ord-94|%"`
    *    MinLength - 3
    *    MaxLength - 50
 @property options? (`SignUpOptions`) - */
export interface SignUpEmailPasswordRequest {
  /**
   * Email address for the new user account
   *    Example - `"john.smith@nhost.io"`
   *    Format - email
   */
  email: string;
  /**
   * Password for the new user account
   *    Example - `"Str0ngPassw#ord-94|%"`
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
 @property allowedRoles? (`string[]`) - 
    *    Example - `["me","user"]`
 @property defaultRole? (`string`) - 
    *    Example - `"user"`
 @property displayName? (`string`) - 
    *    Example - `"John Smith"`
    *    Pattern - ^[\p{L}\p{N}\p{S} ,.'-]+$
    *    MaxLength - 32
 @property locale? (`string`) - A two-characters locale
    *    Example - `"en"`
    *    MinLength - 2
    *    MaxLength - 2
 @property metadata? (`Record<string, unknown>`) - 
    *    Example - `{"firstName":"John","lastName":"Smith"}`
 @property redirectTo? (`string`) - 
    *    Example - `"https://my-app.com/catch-redirection"`
    *    Format - uri*/
export interface SignUpOptions {
  /**
   *
   *    Example - `["me","user"]`
   */
  allowedRoles?: string[];
  /**
   *
   *    Example - `"user"`
   */
  defaultRole?: string;
  /**
   *
   *    Example - `"John Smith"`
   *    Pattern - ^[\p{L}\p{N}\p{S} ,.'-]+$
   *    MaxLength - 32
   */
  displayName?: string;
  /**
   * A two-characters locale
   *    Example - `"en"`
   *    MinLength - 2
   *    MaxLength - 2
   */
  locale?: string;
  /**
   *
   *    Example - `{"firstName":"John","lastName":"Smith"}`
   */
  metadata?: Record<string, unknown>;
  /**
   *
   *    Example - `"https://my-app.com/catch-redirection"`
   *    Format - uri
   */
  redirectTo?: string;
}

/**
 * 
 @property email? (`string`) - A valid email
    *    Example - `"john.smith@nhost.io"`
    *    Format - email*/
export interface SignInWebauthnRequest {
  /**
   * A valid email
   *    Example - `"john.smith@nhost.io"`
   *    Format - email
   */
  email?: string;
}

/**
 * 
 @property email (`string`) - A valid email
    *    Example - `"john.smith@nhost.io"`
    *    Format - email
 @property options? (`SignUpOptions`) - */
export interface SignUpWebauthnRequest {
  /**
   * A valid email
   *    Example - `"john.smith@nhost.io"`
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
 @property email? (`string`) - A valid email. Deprecated, no longer used
    *    Example - `"john.smith@nhost.io"`
    *    Format - email
 @property credential (`Record<string, unknown>`) - */
export interface SignInWebauthnVerifyRequest {
  /**
   * A valid email. Deprecated, no longer used
   *    Example - `"john.smith@nhost.io"`
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
 @property credential (`Record<string, unknown>`) - 
 @property options? (`SignUpOptions`) - 
 @property nickname? (`string`) - Nickname for the security key*/
export interface SignUpWebauthnVerifyRequest {
  /**
   *
   */
  credential: Record<string, unknown>;
  /**
   *
   */
  options?: SignUpOptions;
  /**
   * Nickname for the security key
   */
  nickname?: string;
}

/**
 * 
 @property credential (`Record<string, unknown>`) - The credential created during registration
 @property nickname? (`string`) - Optional nickname for the security key*/
export interface VerifyAddSecurityKeyRequest {
  /**
   * The credential created during registration
   */
  credential: Record<string, unknown>;
  /**
   * Optional nickname for the security key
   */
  nickname?: string;
}

/**
 * 
 @property id (`string`) - The ID of the newly added security key
    *    Example - `"123e4567-e89b-12d3-a456-426614174000"`
 @property nickname? (`string`) - The nickname of the security key if provided*/
export interface VerifyAddSecurityKeyResponse {
  /**
   * The ID of the newly added security key
   *    Example - `"123e4567-e89b-12d3-a456-426614174000"`
   */
  id: string;
  /**
   * The nickname of the security key if provided
   */
  nickname?: string;
}

/**
 * 
 @property provider (`IdTokenProvider`) - 
 @property idToken (`string`) - Apple ID token
 @property nonce? (`string`) - Nonce used during sign in process
 @property options? (`SignUpOptions`) - */
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
 @property ticket (`string`) - Ticket
    *    Pattern - ^mfaTotp:.*$
 @property otp (`string`) - One time password*/
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
 @property provider (`IdTokenProvider`) - 
 @property idToken (`string`) - Apple ID token
 @property nonce? (`string`) - Nonce used during sign in process*/
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
 @property code (`string`) - Verification code from the authenticator app when activating MFA
    *    Example - `"123456"`
 @property activeMfaType? (`UserMfaRequestActiveMfaType`) - Type of MFA to activate. Use empty string to disable MFA.
    *    Example - `"totp"`*/
export interface UserMfaRequest {
  /**
   * Verification code from the authenticator app when activating MFA
   *    Example - `"123456"`
   */
  code: string;
  /**
   * Type of MFA to activate. Use empty string to disable MFA.
   *    Example - `"totp"`
   */
  activeMfaType?: UserMfaRequestActiveMfaType;
}

/**
 * Response containing TOTP setup information for MFA
 @property imageUrl (`string`) - URL to QR code image for scanning with an authenticator app
    *    Example - `"data:image/png;base64,iVBORw0KGg..."`
 @property totpSecret (`string`) - TOTP secret key for manual setup with an authenticator app
    *    Example - `"ABCDEFGHIJK23456"`*/
export interface TotpGenerateResponse {
  /**
   * URL to QR code image for scanning with an authenticator app
   *    Example - `"data:image/png;base64,iVBORw0KGg..."`
   */
  imageUrl: string;
  /**
   * TOTP secret key for manual setup with an authenticator app
   *    Example - `"ABCDEFGHIJK23456"`
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
 @property version (`string`) - The version of the authentication service
    *    Example - `"1.2.3"`*/
export interface GetVersionResponse200 {
  /**
   * The version of the authentication service
   *    Example - `"1.2.3"`
   */
  version: string;
}

/**
 * Parameters for the verifyTicket method.
    @property ticket (TicketQuery) - Ticket
  
    *    Ticket
    @property type? (TicketTypeQuery) - Type of the ticket. Deprecated, no longer used
  
    *    Type of the ticket
    @property redirectTo (RedirectToQuery) - Target URL for the redirect
  
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
    @property allowedRoles? (string[]) - Array of allowed roles for the user
  
    @property defaultRole? (string) - Default role for the user
  
    @property displayName? (string) - Display name for the user
  
    @property locale? (string) - A two-characters locale
  
    @property metadata? (Record<string, unknown>) - Additional metadata for the user
  
    @property redirectTo? (string) - URI to redirect to
  
    @property connect? (string) - If set, this means that the user is already authenticated and wants to link their account. This needs to be a valid JWT access token.
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

export interface Client {
  baseURL: string;
  pushChainFunction(chainFunction: ChainFunction): void;
  /**
     Summary: Health check (HEAD)
     Verify if the authentication service is operational using HEAD method

     This method may return different T based on the response code:
     - 200: void
     */
  healthCheckHead(options?: RequestInit): Promise<FetchResponse<void>>;

  /**
     Summary: Health check (GET)
     Verify if the authentication service is operational using GET method

     This method may return different T based on the response code:
     - 200: OKResponse
     */
  healthCheckGet(options?: RequestInit): Promise<FetchResponse<OKResponse>>;

  /**
     Summary: Get service version
     Retrieve version information about the authentication service

     This method may return different T based on the response code:
     - 200: GetVersionResponse200
     */
  getVersion(
    options?: RequestInit,
  ): Promise<FetchResponse<GetVersionResponse200>>;

  /**
     Summary: Refresh access token
     Generate a new JWT access token using a valid refresh token. The refresh token used will be revoked and a new one will be issued.

     This method may return different T based on the response code:
     - 200: Session
     */
  refreshToken(
    body: RefreshTokenRequest,
    options?: RequestInit,
  ): Promise<FetchResponse<Session>>;

  /**
     Summary: Sign out
     

     This method may return different T based on the response code:
     - 200: OKResponse
     */
  signOut(
    body: SignOutSchema,
    options?: RequestInit,
  ): Promise<FetchResponse<OKResponse>>;

  /**
     Summary: Sign in with email and password
     Authenticate a user with their email and password. Returns a session object or MFA challenge if two-factor authentication is enabled.

     This method may return different T based on the response code:
     - 200: SignInEmailPasswordResponse
     */
  signInEmailPassword(
    body: SignInEmailPasswordRequest,
    options?: RequestInit,
  ): Promise<FetchResponse<SignInEmailPasswordResponse>>;

  /**
     Summary: Verify TOTP for MFA
     Complete the multi-factor authentication by verifying a Time-based One-Time Password (TOTP). Returns a session if validation is successful.

     This method may return different T based on the response code:
     - 200: SessionPayload
     */
  signInVerifyMfaTotp(
    body: SignInMfaTotpRequest,
    options?: RequestInit,
  ): Promise<FetchResponse<SessionPayload>>;

  /**
     Summary: Sign in with magic link email
     Initiate passwordless authentication by sending a magic link to the user's email. If the user doesn't exist, a new account will be created with the provided options.

     This method may return different T based on the response code:
     - 200: OKResponse
     */
  signInPasswordlessEmail(
    body: SignInPasswordlessEmailRequest,
    options?: RequestInit,
  ): Promise<FetchResponse<OKResponse>>;

  /**
     Summary: Sign up with email and password
     Register a new user account with email and password. Returns a session if email verification is not required, otherwise returns null session.

     This method may return different T based on the response code:
     - 200: SessionPayload
     - 403: ErrorResponse
     - 409: ErrorResponse
     */
  signUpEmailPassword(
    body: SignUpEmailPasswordRequest,
    options?: RequestInit,
  ): Promise<FetchResponse<SessionPayload>>;

  /**
     Summary: Manage multi-factor authentication
     Activate or deactivate multi-factor authentication for the authenticated user

     This method may return different T based on the response code:
     - 200: OKResponse
     */
  changeUserMfaVerify(
    body: UserMfaRequest,
    options?: RequestInit,
  ): Promise<FetchResponse<OKResponse>>;

  /**
     Summary: Generate TOTP secret
     Generate a Time-based One-Time Password (TOTP) secret for setting up multi-factor authentication

     This method may return different T based on the response code:
     - 200: TotpGenerateResponse
     */
  changeUserMfa(
    options?: RequestInit,
  ): Promise<FetchResponse<TotpGenerateResponse>>;

  /**
     Summary: Get public keys for JWT verification in JWK Set format
     

     This method may return different T based on the response code:
     - 200: JWKSet
     */
  getJWKs(options?: RequestInit): Promise<FetchResponse<JWKSet>>;

  /**
     Summary: Create a Personal Access Token (PAT)
     

     This method may return different T based on the response code:
     - 200: CreatePATResponse
     */
  createPAT(
    body: CreatePATRequest,
    options?: RequestInit,
  ): Promise<FetchResponse<CreatePATResponse>>;

  /**
     Summary: Sign in anonymously
     

     This method may return different T based on the response code:
     - 200: SessionPayload
     */
  signInAnonymous(
    body?: SignInAnonymousRequest,
    options?: RequestInit,
  ): Promise<FetchResponse<SessionPayload>>;

  /**
     Summary: Sign in with a one time password sent to user's email. If the user doesn't exist, it will be created. The options object is optional and can be used to configure the user's when signing up a new user. It is ignored if the user already exists.
     

     This method may return different T based on the response code:
     - 200: OKResponse
     */
  signInOTPEmail(
    body: SignInOTPEmailRequest,
    options?: RequestInit,
  ): Promise<FetchResponse<OKResponse>>;

  /**
     Summary: Verify OTP and return a session if validation is successful
     

     This method may return different T based on the response code:
     - 200: SignInOTPEmailVerifyResponse
     */
  verifySignInOTPEmail(
    body: SignInOTPEmailVerifyRequest,
    options?: RequestInit,
  ): Promise<FetchResponse<SignInOTPEmailVerifyResponse>>;

  /**
     Summary: Sign in with Personal Access Token (PAT)
     

     This method may return different T based on the response code:
     - 200: SessionPayload
     */
  signInPAT(
    body: SignInPATRequest,
    options?: RequestInit,
  ): Promise<FetchResponse<SessionPayload>>;

  /**
     Summary: Sign in with in an id token
     

     This method may return different T based on the response code:
     - 200: SessionPayload
     */
  signInIdToken(
    body: SignInIdTokenRequest,
    options?: RequestInit,
  ): Promise<FetchResponse<SessionPayload>>;

  /**
     Summary: Link a user account with the provider's account using an id token
     

     This method may return different T based on the response code:
     - 200: OKResponse
     */
  linkIdToken(
    body: LinkIdTokenRequest,
    options?: RequestInit,
  ): Promise<FetchResponse<OKResponse>>;

  /**
     Summary: Deanonymize an anonymous user in adding missing email or email+password, depending on the chosen authentication method. Will send a confirmation email if the server is configured to do so
     

     This method may return different T based on the response code:
     - 200: OKResponse
     */
  deanonymizeUser(
    body: UserDeanonymizeRequest,
    options?: RequestInit,
  ): Promise<FetchResponse<OKResponse>>;

  /**
     Summary: Change user email
     

     This method may return different T based on the response code:
     - 200: OKResponse
     */
  changeUserEmail(
    body: UserEmailChangeRequest,
    options?: RequestInit,
  ): Promise<FetchResponse<OKResponse>>;

  /**
     Summary: Send verification email
     

     This method may return different T based on the response code:
     - 200: OKResponse
     */
  sendVerificationEmail(
    body: UserEmailSendVerificationEmailRequest,
    options?: RequestInit,
  ): Promise<FetchResponse<OKResponse>>;

  /**
     Summary: Change user password. The user must be authenticated or provide a ticket
     

     This method may return different T based on the response code:
     - 200: OKResponse
     */
  changeUserPassword(
    body: UserPasswordRequest,
    options?: RequestInit,
  ): Promise<FetchResponse<OKResponse>>;

  /**
     Summary: Request a password reset. An email with a verification link will be sent to the user's address
     

     This method may return different T based on the response code:
     - 200: OKResponse
     */
  sendPasswordResetEmail(
    body: UserPasswordResetRequest,
    options?: RequestInit,
  ): Promise<FetchResponse<OKResponse>>;

  /**
     Summary: Verify tickets created by email verification, email passwordless authentication (magic link), or password reset
     

     As this method is a redirect, it returns a URL string instead of a Promise
     */
  verifyTicketURL(params?: VerifyTicketParams, options?: RequestInit): string;

  /**
     Summary: Sign in with an oauth2 provider
     

     As this method is a redirect, it returns a URL string instead of a Promise
     */
  signInProviderURL(
    provider: SignInProvider,
    params?: SignInProviderParams,
    options?: RequestInit,
  ): string;

  /**
     Summary: Sign in with WebAuthn
     Initiate a WebAuthn sign-in process by sending a challenge to the user's device. The user must have previously registered a WebAuthn credential.

     This method may return different T based on the response code:
     - 200: PublicKeyCredentialCreationOptions
     */
  signInWebAuthn(
    body?: SignInWebauthnRequest,
    options?: RequestInit,
  ): Promise<FetchResponse<PublicKeyCredentialCreationOptions>>;

  /**
     Summary: Verify WebAuthn sign-in
     Complete the WebAuthn sign-in process by verifying the response from the user's device. Returns a session if validation is successful.

     This method may return different T based on the response code:
     - 200: SessionPayload
     */
  verifySignInWebAuthn(
    body: SignInWebauthnVerifyRequest,
    options?: RequestInit,
  ): Promise<FetchResponse<SessionPayload>>;

  /**
     Summary: Sign up with WebAuthn
     Initiate a WebAuthn sign-up process by sending a challenge to the user's device. The user must not have an existing account.

     This method may return different T based on the response code:
     - 200: PublicKeyCredentialCreationOptions
     */
  signUpWebAuthn(
    body: SignUpWebauthnRequest,
    options?: RequestInit,
  ): Promise<FetchResponse<PublicKeyCredentialCreationOptions>>;

  /**
     Summary: Verify WebAuthn sign-up
     Complete the WebAuthn sign-up process by verifying the response from the user's device. Returns a session if validation is successful.

     This method may return different T based on the response code:
     - 200: SessionPayload
     */
  verifySignUpWebAuthn(
    body: SignUpWebauthnVerifyRequest,
    options?: RequestInit,
  ): Promise<FetchResponse<SessionPayload>>;

  /**
     Summary: Initialize adding of a new webauthn security key
     

     This method may return different T based on the response code:
     - 200: PublicKeyCredentialCreationOptions
     */
  addSecurityKey(
    options?: RequestInit,
  ): Promise<FetchResponse<PublicKeyCredentialCreationOptions>>;

  /**
     Summary: Verify adding of a new webauthn security key
     

     This method may return different T based on the response code:
     - 200: VerifyAddSecurityKeyResponse
     */
  verifyAddSecurityKey(
    body: VerifyAddSecurityKeyRequest,
    options?: RequestInit,
  ): Promise<FetchResponse<VerifyAddSecurityKeyResponse>>;
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

  const signInWebAuthn = async (
    body?: SignInWebauthnRequest,
    options?: RequestInit,
  ): Promise<FetchResponse<PublicKeyCredentialCreationOptions>> => {
    const url = baseURL + `/signin/webauthn`;
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
    const payload: PublicKeyCredentialCreationOptions = responseBody
      ? JSON.parse(responseBody)
      : {};

    return {
      body: payload,
      status: res.status,
      headers: res.headers,
    } as FetchResponse<PublicKeyCredentialCreationOptions>;
  };

  const verifySignInWebAuthn = async (
    body: SignInWebauthnVerifyRequest,
    options?: RequestInit,
  ): Promise<FetchResponse<SessionPayload>> => {
    const url = baseURL + `/signin/webauthn/verify`;
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

  const signUpWebAuthn = async (
    body: SignUpWebauthnRequest,
    options?: RequestInit,
  ): Promise<FetchResponse<PublicKeyCredentialCreationOptions>> => {
    const url = baseURL + `/signup/webauthn`;
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
    const payload: PublicKeyCredentialCreationOptions = responseBody
      ? JSON.parse(responseBody)
      : {};

    return {
      body: payload,
      status: res.status,
      headers: res.headers,
    } as FetchResponse<PublicKeyCredentialCreationOptions>;
  };

  const verifySignUpWebAuthn = async (
    body: SignUpWebauthnVerifyRequest,
    options?: RequestInit,
  ): Promise<FetchResponse<SessionPayload>> => {
    const url = baseURL + `/signup/webauthn/verify`;
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

  const addSecurityKey = async (
    options?: RequestInit,
  ): Promise<FetchResponse<PublicKeyCredentialCreationOptions>> => {
    const url = baseURL + `/user/webauthn/add`;
    const res = await fetch(url, {
      ...options,
      method: "POST",
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
    const payload: PublicKeyCredentialCreationOptions = responseBody
      ? JSON.parse(responseBody)
      : {};

    return {
      body: payload,
      status: res.status,
      headers: res.headers,
    } as FetchResponse<PublicKeyCredentialCreationOptions>;
  };

  const verifyAddSecurityKey = async (
    body: VerifyAddSecurityKeyRequest,
    options?: RequestInit,
  ): Promise<FetchResponse<VerifyAddSecurityKeyResponse>> => {
    const url = baseURL + `/user/webauthn/verify`;
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
    const payload: VerifyAddSecurityKeyResponse = responseBody
      ? JSON.parse(responseBody)
      : {};

    return {
      body: payload,
      status: res.status,
      headers: res.headers,
    } as FetchResponse<VerifyAddSecurityKeyResponse>;
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
    signInWebAuthn,
    verifySignInWebAuthn,
    signUpWebAuthn,
    verifySignUpWebAuthn,
    addSecurityKey,
    verifyAddSecurityKey,
  };
};
