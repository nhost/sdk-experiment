/**
 * This file is auto-generated. Do not edit manually.
 */
import { FetchError, createEnhancedFetch } from "../fetch";
import type { ChainFunction, FetchResponse } from "../fetch";

import type { Client } from "./interface";

/**
 * JSON Web Key Set for verifying JWT signatures
 * @property keys - Array of public keys*/
export interface JWKSet {
  /**
   *Array of public keys
   */
  keys: JWK[];
}

/**
 * JSON Web Key for JWT verification
 * @property alg - Algorithm used with this key
 *    Example - RS256
 * @property e - RSA public exponent
 *    Example - AQAB
 * @property kid - Key ID
 *    Example - key-id-1
 * @property kty - Key type
 *    Example - RSA
 * @property n - RSA modulus
 *    Example - abcd1234...
 * @property use - Key usage
 *    Example - sig*/
export interface JWK {
  /**
   *Algorithm used with this key
   *    Example - RS256
   */
  alg: string;
  /**
   *RSA public exponent
   *    Example - AQAB
   */
  e: string;
  /**
   *Key ID
   *    Example - key-id-1
   */
  kid: string;
  /**
   *Key type
   *    Example - RSA
   */
  kty: string;
  /**
   *RSA modulus
   *    Example - abcd1234...
   */
  n: string;
  /**
   *Key usage
   *    Example - sig
   */
  use: string;
}

/**
 * Request to refresh an access token
 * @property refreshToken - Refresh token used to generate a new access token
 *    Example - 2c35b6f3-c4b9-48e3-978a-d4d0f1d42e24
 *    Pattern - \b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b*/
export interface RefreshTokenRequest {
  /**
   *Refresh token used to generate a new access token
   *    Example - 2c35b6f3-c4b9-48e3-978a-d4d0f1d42e24
   *    Pattern - \b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b
   */
  refreshToken: string;
}

/**
 *
 * @property refreshToken - Refresh token for the current session
 * @property all - Sign out from all connected devices*/
export interface SignOutSchema {
  /**
   *Refresh token for the current session
   */
  refreshToken: string;
  /**
   *Sign out from all connected devices
   */
  all?: boolean;
}

/**
 *
 * @property expiresAt - Expiration date of the PAT
 *    Format - date-time
 * @property metadata - */
export interface CreatePATRequest {
  /**
   *Expiration date of the PAT
   *    Format - date-time
   */
  expiresAt: string;
  /**
   *
   */
  metadata?: Record<string, any>;
}

/**
 *
 * @property id - ID of the PAT
 *    Example - 2c35b6f3-c4b9-48e3-978a-d4d0f1d42e24
 *    Pattern - \b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b
 * @property personalAccessToken - PAT
 *    Example - 2c35b6f3-c4b9-48e3-978a-d4d0f1d42e24
 *    Pattern - \b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b*/
export interface CreatePATResponse {
  /**
   *ID of the PAT
   *    Example - 2c35b6f3-c4b9-48e3-978a-d4d0f1d42e24
   *    Pattern - \b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b
   */
  id: string;
  /**
   *PAT
   *    Example - 2c35b6f3-c4b9-48e3-978a-d4d0f1d42e24
   *    Pattern - \b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b
   */
  personalAccessToken: string;
}

/**
 * Standardized error response
 * @property status - HTTP status error code
 *    Example - 400
 * @property message - Human-friendly error message
 *    Example - Invalid email format
 * @property error - Error code identifying the specific application error*/
export interface ErrorResponse {
  /**
   *HTTP status error code
   *    Example - 400
   */
  status: number;
  /**
   *Human-friendly error message
   *    Example - Invalid email format
   */
  message: string;
  /**
   *Error code identifying the specific application error
   */
  error: ErrorResponseError;
}

/**
 * Error code identifying the specific application error
 */
export enum ErrorResponseError {
  DefaultRoleMustBeInAllowedRoles = "default-role-must-be-in-allowed-roles",
  DisabledEndpoint = "disabled-endpoint",
  DisabledUser = "disabled-user",
  EmailAlreadyInUse = "email-already-in-use",
  EmailAlreadyVerified = "email-already-verified",
  ForbiddenAnonymous = "forbidden-anonymous",
  InternalServerError = "internal-server-error",
  InvalidEmailPassword = "invalid-email-password",
  InvalidRequest = "invalid-request",
  LocaleNotAllowed = "locale-not-allowed",
  PasswordTooShort = "password-too-short",
  PasswordInHibpDatabase = "password-in-hibp-database",
  RedirectToNotAllowed = "redirectTo-not-allowed",
  RoleNotAllowed = "role-not-allowed",
  SignupDisabled = "signup-disabled",
  UnverifiedUser = "unverified-user",
  UserNotAnonymous = "user-not-anonymous",
  InvalidPat = "invalid-pat",
  InvalidRefreshToken = "invalid-refresh-token",
  InvalidTicket = "invalid-ticket",
  DisabledMfaTotp = "disabled-mfa-totp",
  NoTotpSecret = "no-totp-secret",
  InvalidTotp = "invalid-totp",
  MfaTypeNotFound = "mfa-type-not-found",
  TotpAlreadyActive = "totp-already-active",
}

/**
 * Response for email-password authentication that may include a session or MFA challenge
 * @property session - User authentication session containing tokens and user information
 * @property mfa - Challenge payload for multi-factor authentication*/
export interface SignInEmailPasswordResponse {
  /**
   *User authentication session containing tokens and user information
   */
  session?: Session;
  /**
   *Challenge payload for multi-factor authentication
   */
  mfa?: MFAChallengePayload;
}

/**
 * User authentication session containing tokens and user information
 * @property accessToken - JWT token for authenticating API requests
 *    Example - eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 * @property accessTokenExpiresIn - Expiration time of the access token in seconds
 *    Example - 900
 *    Format - int64
 * @property refreshTokenId - Identifier for the refresh token
 *    Example - 2c35b6f3-c4b9-48e3-978a-d4d0f1d42e24
 *    Pattern - \b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b
 * @property refreshToken - Token used to refresh the access token
 *    Example - 2c35b6f3-c4b9-48e3-978a-d4d0f1d42e24
 *    Pattern - \b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b
 * @property user - User profile and account information*/
export interface SignInEmailPasswordResponseSession {
  /**
   *JWT token for authenticating API requests
   *    Example - eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   */
  accessToken: string;
  /**
   *Expiration time of the access token in seconds
   *    Example - 900
   *    Format - int64
   */
  accessTokenExpiresIn: number;
  /**
   *Identifier for the refresh token
   *    Example - 2c35b6f3-c4b9-48e3-978a-d4d0f1d42e24
   *    Pattern - \b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b
   */
  refreshTokenId: string;
  /**
   *Token used to refresh the access token
   *    Example - 2c35b6f3-c4b9-48e3-978a-d4d0f1d42e24
   *    Pattern - \b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b
   */
  refreshToken: string;
  /**
   *User profile and account information
   */
  user?: User;
}

/**
 * User profile and account information
 * @property avatarUrl - URL to the user's profile picture
 *    Example - https://myapp.com/avatars/user123.jpg
 * @property createdAt - Timestamp when the user account was created
 *    Example - 2023-01-15T12:34:56Z
 *    Format - date-time
 * @property defaultRole - Default authorization role for the user
 *    Example - user
 * @property displayName - User's display name
 *    Example - John Smith
 * @property email - User's email address
 *    Example - john.smith@nhost.io
 *    Format - email
 * @property emailVerified - Whether the user's email has been verified
 *    Example - true
 * @property id - Unique identifier for the user
 *    Example - 2c35b6f3-c4b9-48e3-978a-d4d0f1d42e24
 *    Pattern - \b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b
 * @property isAnonymous - Whether this is an anonymous user account
 *    Example - false
 * @property locale - User's preferred locale (language code)
 *    Example - en
 *    MinLength - 2
 *    MaxLength - 2
 * @property metadata - Custom metadata associated with the user
 * @property phoneNumber - User's phone number
 *    Example - +12025550123
 * @property phoneNumberVerified - Whether the user's phone number has been verified
 *    Example - false
 * @property roles - List of roles assigned to the user*/
export interface SignInEmailPasswordResponseSessionUser {
  /**
   *URL to the user's profile picture
   *    Example - https://myapp.com/avatars/user123.jpg
   */
  avatarUrl: string;
  /**
   *Timestamp when the user account was created
   *    Example - 2023-01-15T12:34:56Z
   *    Format - date-time
   */
  createdAt: string;
  /**
   *Default authorization role for the user
   *    Example - user
   */
  defaultRole: string;
  /**
   *User's display name
   *    Example - John Smith
   */
  displayName: string;
  /**
   *User's email address
   *    Example - john.smith@nhost.io
   *    Format - email
   */
  email?: string;
  /**
   *Whether the user's email has been verified
   *    Example - true
   */
  emailVerified: boolean;
  /**
   *Unique identifier for the user
   *    Example - 2c35b6f3-c4b9-48e3-978a-d4d0f1d42e24
   *    Pattern - \b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b
   */
  id: string;
  /**
   *Whether this is an anonymous user account
   *    Example - false
   */
  isAnonymous: boolean;
  /**
   *User's preferred locale (language code)
   *    Example - en
   *    MinLength - 2
   *    MaxLength - 2
   */
  locale: string;
  /**
   *Custom metadata associated with the user
   */
  metadata: Record<string, any>;
  /**
   *User's phone number
   *    Example - +12025550123
   */
  phoneNumber?: string;
  /**
   *Whether the user's phone number has been verified
   *    Example - false
   */
  phoneNumberVerified: boolean;
  /**
   *List of roles assigned to the user
   */
  roles: string[];
}

/**
 * Challenge payload for multi-factor authentication
 * @property ticket - Ticket to use when completing the MFA challenge
 *    Example - mfaTotp:abc123def456*/
export interface SignInEmailPasswordResponseMfa {
  /**
   *Ticket to use when completing the MFA challenge
   *    Example - mfaTotp:abc123def456
   */
  ticket: string;
}

/**
 * Challenge payload for multi-factor authentication
 * @property ticket - Ticket to use when completing the MFA challenge
 *    Example - mfaTotp:abc123def456*/
export interface MFAChallengePayload {
  /**
   *Ticket to use when completing the MFA challenge
   *    Example - mfaTotp:abc123def456
   */
  ticket: string;
}

/**
 * Container for session information
 * @property session - User authentication session containing tokens and user information*/
export interface SessionPayload {
  /**
   *User authentication session containing tokens and user information
   */
  session?: Session;
}

/**
 * User authentication session containing tokens and user information
 * @property accessToken - JWT token for authenticating API requests
 *    Example - eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 * @property accessTokenExpiresIn - Expiration time of the access token in seconds
 *    Example - 900
 *    Format - int64
 * @property refreshTokenId - Identifier for the refresh token
 *    Example - 2c35b6f3-c4b9-48e3-978a-d4d0f1d42e24
 *    Pattern - \b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b
 * @property refreshToken - Token used to refresh the access token
 *    Example - 2c35b6f3-c4b9-48e3-978a-d4d0f1d42e24
 *    Pattern - \b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b
 * @property user - User profile and account information*/
export interface SessionPayloadSession {
  /**
   *JWT token for authenticating API requests
   *    Example - eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   */
  accessToken: string;
  /**
   *Expiration time of the access token in seconds
   *    Example - 900
   *    Format - int64
   */
  accessTokenExpiresIn: number;
  /**
   *Identifier for the refresh token
   *    Example - 2c35b6f3-c4b9-48e3-978a-d4d0f1d42e24
   *    Pattern - \b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b
   */
  refreshTokenId: string;
  /**
   *Token used to refresh the access token
   *    Example - 2c35b6f3-c4b9-48e3-978a-d4d0f1d42e24
   *    Pattern - \b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b
   */
  refreshToken: string;
  /**
   *User profile and account information
   */
  user?: User;
}

/**
 * User profile and account information
 * @property avatarUrl - URL to the user's profile picture
 *    Example - https://myapp.com/avatars/user123.jpg
 * @property createdAt - Timestamp when the user account was created
 *    Example - 2023-01-15T12:34:56Z
 *    Format - date-time
 * @property defaultRole - Default authorization role for the user
 *    Example - user
 * @property displayName - User's display name
 *    Example - John Smith
 * @property email - User's email address
 *    Example - john.smith@nhost.io
 *    Format - email
 * @property emailVerified - Whether the user's email has been verified
 *    Example - true
 * @property id - Unique identifier for the user
 *    Example - 2c35b6f3-c4b9-48e3-978a-d4d0f1d42e24
 *    Pattern - \b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b
 * @property isAnonymous - Whether this is an anonymous user account
 *    Example - false
 * @property locale - User's preferred locale (language code)
 *    Example - en
 *    MinLength - 2
 *    MaxLength - 2
 * @property metadata - Custom metadata associated with the user
 * @property phoneNumber - User's phone number
 *    Example - +12025550123
 * @property phoneNumberVerified - Whether the user's phone number has been verified
 *    Example - false
 * @property roles - List of roles assigned to the user*/
export interface SessionPayloadSessionUser {
  /**
   *URL to the user's profile picture
   *    Example - https://myapp.com/avatars/user123.jpg
   */
  avatarUrl: string;
  /**
   *Timestamp when the user account was created
   *    Example - 2023-01-15T12:34:56Z
   *    Format - date-time
   */
  createdAt: string;
  /**
   *Default authorization role for the user
   *    Example - user
   */
  defaultRole: string;
  /**
   *User's display name
   *    Example - John Smith
   */
  displayName: string;
  /**
   *User's email address
   *    Example - john.smith@nhost.io
   *    Format - email
   */
  email?: string;
  /**
   *Whether the user's email has been verified
   *    Example - true
   */
  emailVerified: boolean;
  /**
   *Unique identifier for the user
   *    Example - 2c35b6f3-c4b9-48e3-978a-d4d0f1d42e24
   *    Pattern - \b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b
   */
  id: string;
  /**
   *Whether this is an anonymous user account
   *    Example - false
   */
  isAnonymous: boolean;
  /**
   *User's preferred locale (language code)
   *    Example - en
   *    MinLength - 2
   *    MaxLength - 2
   */
  locale: string;
  /**
   *Custom metadata associated with the user
   */
  metadata: Record<string, any>;
  /**
   *User's phone number
   *    Example - +12025550123
   */
  phoneNumber?: string;
  /**
   *Whether the user's phone number has been verified
   *    Example - false
   */
  phoneNumberVerified: boolean;
  /**
   *List of roles assigned to the user
   */
  roles: string[];
}

/**
 * User authentication session containing tokens and user information
 * @property accessToken - JWT token for authenticating API requests
 *    Example - eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 * @property accessTokenExpiresIn - Expiration time of the access token in seconds
 *    Example - 900
 *    Format - int64
 * @property refreshTokenId - Identifier for the refresh token
 *    Example - 2c35b6f3-c4b9-48e3-978a-d4d0f1d42e24
 *    Pattern - \b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b
 * @property refreshToken - Token used to refresh the access token
 *    Example - 2c35b6f3-c4b9-48e3-978a-d4d0f1d42e24
 *    Pattern - \b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b
 * @property user - User profile and account information*/
export interface Session {
  /**
   *JWT token for authenticating API requests
   *    Example - eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   */
  accessToken: string;
  /**
   *Expiration time of the access token in seconds
   *    Example - 900
   *    Format - int64
   */
  accessTokenExpiresIn: number;
  /**
   *Identifier for the refresh token
   *    Example - 2c35b6f3-c4b9-48e3-978a-d4d0f1d42e24
   *    Pattern - \b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b
   */
  refreshTokenId: string;
  /**
   *Token used to refresh the access token
   *    Example - 2c35b6f3-c4b9-48e3-978a-d4d0f1d42e24
   *    Pattern - \b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b
   */
  refreshToken: string;
  /**
   *User profile and account information
   */
  user?: User;
}

/**
 * User profile and account information
 * @property avatarUrl - URL to the user's profile picture
 *    Example - https://myapp.com/avatars/user123.jpg
 * @property createdAt - Timestamp when the user account was created
 *    Example - 2023-01-15T12:34:56Z
 *    Format - date-time
 * @property defaultRole - Default authorization role for the user
 *    Example - user
 * @property displayName - User's display name
 *    Example - John Smith
 * @property email - User's email address
 *    Example - john.smith@nhost.io
 *    Format - email
 * @property emailVerified - Whether the user's email has been verified
 *    Example - true
 * @property id - Unique identifier for the user
 *    Example - 2c35b6f3-c4b9-48e3-978a-d4d0f1d42e24
 *    Pattern - \b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b
 * @property isAnonymous - Whether this is an anonymous user account
 *    Example - false
 * @property locale - User's preferred locale (language code)
 *    Example - en
 *    MinLength - 2
 *    MaxLength - 2
 * @property metadata - Custom metadata associated with the user
 * @property phoneNumber - User's phone number
 *    Example - +12025550123
 * @property phoneNumberVerified - Whether the user's phone number has been verified
 *    Example - false
 * @property roles - List of roles assigned to the user*/
export interface SessionUser {
  /**
   *URL to the user's profile picture
   *    Example - https://myapp.com/avatars/user123.jpg
   */
  avatarUrl: string;
  /**
   *Timestamp when the user account was created
   *    Example - 2023-01-15T12:34:56Z
   *    Format - date-time
   */
  createdAt: string;
  /**
   *Default authorization role for the user
   *    Example - user
   */
  defaultRole: string;
  /**
   *User's display name
   *    Example - John Smith
   */
  displayName: string;
  /**
   *User's email address
   *    Example - john.smith@nhost.io
   *    Format - email
   */
  email?: string;
  /**
   *Whether the user's email has been verified
   *    Example - true
   */
  emailVerified: boolean;
  /**
   *Unique identifier for the user
   *    Example - 2c35b6f3-c4b9-48e3-978a-d4d0f1d42e24
   *    Pattern - \b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b
   */
  id: string;
  /**
   *Whether this is an anonymous user account
   *    Example - false
   */
  isAnonymous: boolean;
  /**
   *User's preferred locale (language code)
   *    Example - en
   *    MinLength - 2
   *    MaxLength - 2
   */
  locale: string;
  /**
   *Custom metadata associated with the user
   */
  metadata: Record<string, any>;
  /**
   *User's phone number
   *    Example - +12025550123
   */
  phoneNumber?: string;
  /**
   *Whether the user's phone number has been verified
   *    Example - false
   */
  phoneNumberVerified: boolean;
  /**
   *List of roles assigned to the user
   */
  roles: string[];
}

/**
 *
 * @property personalAccessToken - PAT
 *    Example - 2c35b6f3-c4b9-48e3-978a-d4d0f1d42e24
 *    Pattern - \b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b*/
export interface SignInPATRequest {
  /**
   *PAT
   *    Example - 2c35b6f3-c4b9-48e3-978a-d4d0f1d42e24
   *    Pattern - \b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b
   */
  personalAccessToken: string;
}

/**
 * User profile and account information
 * @property avatarUrl - URL to the user's profile picture
 *    Example - https://myapp.com/avatars/user123.jpg
 * @property createdAt - Timestamp when the user account was created
 *    Example - 2023-01-15T12:34:56Z
 *    Format - date-time
 * @property defaultRole - Default authorization role for the user
 *    Example - user
 * @property displayName - User's display name
 *    Example - John Smith
 * @property email - User's email address
 *    Example - john.smith@nhost.io
 *    Format - email
 * @property emailVerified - Whether the user's email has been verified
 *    Example - true
 * @property id - Unique identifier for the user
 *    Example - 2c35b6f3-c4b9-48e3-978a-d4d0f1d42e24
 *    Pattern - \b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b
 * @property isAnonymous - Whether this is an anonymous user account
 *    Example - false
 * @property locale - User's preferred locale (language code)
 *    Example - en
 *    MinLength - 2
 *    MaxLength - 2
 * @property metadata - Custom metadata associated with the user
 * @property phoneNumber - User's phone number
 *    Example - +12025550123
 * @property phoneNumberVerified - Whether the user's phone number has been verified
 *    Example - false
 * @property roles - List of roles assigned to the user*/
export interface User {
  /**
   *URL to the user's profile picture
   *    Example - https://myapp.com/avatars/user123.jpg
   */
  avatarUrl: string;
  /**
   *Timestamp when the user account was created
   *    Example - 2023-01-15T12:34:56Z
   *    Format - date-time
   */
  createdAt: string;
  /**
   *Default authorization role for the user
   *    Example - user
   */
  defaultRole: string;
  /**
   *User's display name
   *    Example - John Smith
   */
  displayName: string;
  /**
   *User's email address
   *    Example - john.smith@nhost.io
   *    Format - email
   */
  email?: string;
  /**
   *Whether the user's email has been verified
   *    Example - true
   */
  emailVerified: boolean;
  /**
   *Unique identifier for the user
   *    Example - 2c35b6f3-c4b9-48e3-978a-d4d0f1d42e24
   *    Pattern - \b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b
   */
  id: string;
  /**
   *Whether this is an anonymous user account
   *    Example - false
   */
  isAnonymous: boolean;
  /**
   *User's preferred locale (language code)
   *    Example - en
   *    MinLength - 2
   *    MaxLength - 2
   */
  locale: string;
  /**
   *Custom metadata associated with the user
   */
  metadata: Record<string, any>;
  /**
   *User's phone number
   *    Example - +12025550123
   */
  phoneNumber?: string;
  /**
   *Whether the user's phone number has been verified
   *    Example - false
   */
  phoneNumberVerified: boolean;
  /**
   *List of roles assigned to the user
   */
  roles: string[];
}

/**
 *
 * @property signInMethod - Which sign-in method to use
 * @property email - A valid email
 *    Example - john.smith@nhost.io
 *    Format - email
 * @property password - A password of minimum 3 characters
 *    Example - Str0ngPassw#ord-94|%
 *    MinLength - 3
 *    MaxLength - 50
 * @property connection - Deprecated, will be ignored
 * @property options - */
export interface UserDeanonymizeRequest {
  /**
   *Which sign-in method to use
   */
  signInMethod: UserDeanonymizeRequestSignInMethod;
  /**
   *A valid email
   *    Example - john.smith@nhost.io
   *    Format - email
   */
  email: string;
  /**
   *A password of minimum 3 characters
   *    Example - Str0ngPassw#ord-94|%
   *    MinLength - 3
   *    MaxLength - 50
   */
  password?: string;
  /**
   *Deprecated, will be ignored
   */
  connection?: string;
  /**
   *
   */
  options?: SignUpOptions;
}

/**
 * Which sign-in method to use
 */
export enum UserDeanonymizeRequestSignInMethod {
  EmailPassword = "email-password",
  Passwordless = "passwordless",
}

/**
 *
 * @property allowedRoles -
 * @property defaultRole -
 *    Example - user
 * @property displayName -
 *    Example - John Smith
 *    Pattern - ^[\p{L}\p{N}\p{S} ,.'-]+$
 *    MaxLength - 32
 * @property locale - A two-characters locale
 *    Example - en
 *    MinLength - 2
 *    MaxLength - 2
 * @property metadata -
 * @property redirectTo -
 *    Example - https://my-app.com/catch-redirection
 *    Format - uri*/
export interface UserDeanonymizeRequestOptions {
  /**
   *
   */
  allowedRoles?: string[];
  /**
   *
   *    Example - user
   */
  defaultRole?: string;
  /**
   *
   *    Example - John Smith
   *    Pattern - ^[\p{L}\p{N}\p{S} ,.'-]+$
   *    MaxLength - 32
   */
  displayName?: string;
  /**
   *A two-characters locale
   *    Example - en
   *    MinLength - 2
   *    MaxLength - 2
   */
  locale?: string;
  /**
   *
   */
  metadata?: Record<string, any>;
  /**
   *
   *    Example - https://my-app.com/catch-redirection
   *    Format - uri
   */
  redirectTo?: string;
}

/**
 *
 * @property newEmail - A valid email
 *    Example - john.smith@nhost.io
 *    Format - email
 * @property options - */
export interface UserEmailChangeRequest {
  /**
   *A valid email
   *    Example - john.smith@nhost.io
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
 * @property redirectTo -
 *    Example - https://my-app.com/catch-redirection
 *    Format - uri*/
export interface UserEmailChangeRequestOptions {
  /**
   *
   *    Example - https://my-app.com/catch-redirection
   *    Format - uri
   */
  redirectTo?: string;
}

/**
 *
 * @property email - A valid email
 *    Example - john.smith@nhost.io
 *    Format - email
 * @property options - */
export interface UserEmailSendVerificationEmailRequest {
  /**
   *A valid email
   *    Example - john.smith@nhost.io
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
 * @property redirectTo -
 *    Example - https://my-app.com/catch-redirection
 *    Format - uri*/
export interface UserEmailSendVerificationEmailRequestOptions {
  /**
   *
   *    Example - https://my-app.com/catch-redirection
   *    Format - uri
   */
  redirectTo?: string;
}

/**
 *
 * @property email - A valid email
 *    Example - john.smith@nhost.io
 *    Format - email
 * @property options - */
export interface UserPasswordResetRequest {
  /**
   *A valid email
   *    Example - john.smith@nhost.io
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
 * @property redirectTo -
 *    Example - https://my-app.com/catch-redirection
 *    Format - uri*/
export interface UserPasswordResetRequestOptions {
  /**
   *
   *    Example - https://my-app.com/catch-redirection
   *    Format - uri
   */
  redirectTo?: string;
}

/**
 *
 * @property newPassword - A password of minimum 3 characters
 *    Example - Str0ngPassw#ord-94|%
 *    MinLength - 3
 *    MaxLength - 50
 * @property ticket - Ticket to reset the password, required if the user is not authenticated
 *    Pattern - ^passwordReset\:.*$*/
export interface UserPasswordRequest {
  /**
   *A password of minimum 3 characters
   *    Example - Str0ngPassw#ord-94|%
   *    MinLength - 3
   *    MaxLength - 50
   */
  newPassword: string;
  /**
   *Ticket to reset the password, required if the user is not authenticated
   *    Pattern - ^passwordReset\:.*$
   */
  ticket?: string;
}

/**
 *
 */
export enum OKResponse {
  OK = "OK",
}

/**
 *
 * @property redirectTo -
 *    Example - https://my-app.com/catch-redirection
 *    Format - uri*/
export interface OptionsRedirectTo {
  /**
   *
   *    Example - https://my-app.com/catch-redirection
   *    Format - uri
   */
  redirectTo?: string;
}

/**
 *
 * @property displayName -
 *    Example - John Smith
 * @property locale - A two-characters locale
 *    Example - en
 *    MinLength - 2
 *    MaxLength - 2
 * @property metadata - */
export interface SignInAnonymousRequest {
  /**
   *
   *    Example - John Smith
   */
  displayName?: string;
  /**
   *A two-characters locale
   *    Example - en
   *    MinLength - 2
   *    MaxLength - 2
   */
  locale?: string;
  /**
   *
   */
  metadata?: Record<string, any>;
}

/**
 * Request to authenticate using email and password
 * @property email - User's email address
 *    Example - john.smith@nhost.io
 *    Format - email
 * @property password - User's password
 *    Example - Str0ngPassw#ord-94|%
 *    MinLength - 3
 *    MaxLength - 50*/
export interface SignInEmailPasswordRequest {
  /**
   *User's email address
   *    Example - john.smith@nhost.io
   *    Format - email
   */
  email: string;
  /**
   *User's password
   *    Example - Str0ngPassw#ord-94|%
   *    MinLength - 3
   *    MaxLength - 50
   */
  password: string;
}

/**
 *
 * @property email - A valid email
 *    Example - john.smith@nhost.io
 *    Format - email
 * @property options - */
export interface SignInPasswordlessEmailRequest {
  /**
   *A valid email
   *    Example - john.smith@nhost.io
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
 * @property allowedRoles -
 * @property defaultRole -
 *    Example - user
 * @property displayName -
 *    Example - John Smith
 *    Pattern - ^[\p{L}\p{N}\p{S} ,.'-]+$
 *    MaxLength - 32
 * @property locale - A two-characters locale
 *    Example - en
 *    MinLength - 2
 *    MaxLength - 2
 * @property metadata -
 * @property redirectTo -
 *    Example - https://my-app.com/catch-redirection
 *    Format - uri*/
export interface SignInPasswordlessEmailRequestOptions {
  /**
   *
   */
  allowedRoles?: string[];
  /**
   *
   *    Example - user
   */
  defaultRole?: string;
  /**
   *
   *    Example - John Smith
   *    Pattern - ^[\p{L}\p{N}\p{S} ,.'-]+$
   *    MaxLength - 32
   */
  displayName?: string;
  /**
   *A two-characters locale
   *    Example - en
   *    MinLength - 2
   *    MaxLength - 2
   */
  locale?: string;
  /**
   *
   */
  metadata?: Record<string, any>;
  /**
   *
   *    Example - https://my-app.com/catch-redirection
   *    Format - uri
   */
  redirectTo?: string;
}

/**
 *
 * @property email - A valid email
 *    Example - john.smith@nhost.io
 *    Format - email
 * @property options - */
export interface SignInOTPEmailRequest {
  /**
   *A valid email
   *    Example - john.smith@nhost.io
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
 * @property allowedRoles -
 * @property defaultRole -
 *    Example - user
 * @property displayName -
 *    Example - John Smith
 *    Pattern - ^[\p{L}\p{N}\p{S} ,.'-]+$
 *    MaxLength - 32
 * @property locale - A two-characters locale
 *    Example - en
 *    MinLength - 2
 *    MaxLength - 2
 * @property metadata -
 * @property redirectTo -
 *    Example - https://my-app.com/catch-redirection
 *    Format - uri*/
export interface SignInOTPEmailRequestOptions {
  /**
   *
   */
  allowedRoles?: string[];
  /**
   *
   *    Example - user
   */
  defaultRole?: string;
  /**
   *
   *    Example - John Smith
   *    Pattern - ^[\p{L}\p{N}\p{S} ,.'-]+$
   *    MaxLength - 32
   */
  displayName?: string;
  /**
   *A two-characters locale
   *    Example - en
   *    MinLength - 2
   *    MaxLength - 2
   */
  locale?: string;
  /**
   *
   */
  metadata?: Record<string, any>;
  /**
   *
   *    Example - https://my-app.com/catch-redirection
   *    Format - uri
   */
  redirectTo?: string;
}

/**
 *
 * @property otp - One time password
 * @property email - A valid email
 *    Example - john.smith@nhost.io
 *    Format - email*/
export interface SignInOTPEmailVerifyRequest {
  /**
   *One time password
   */
  otp: string;
  /**
   *A valid email
   *    Example - john.smith@nhost.io
   *    Format - email
   */
  email: string;
}

/**
 *
 * @property session - User authentication session containing tokens and user information*/
export interface SignInOTPEmailVerifyResponse {
  /**
   *User authentication session containing tokens and user information
   */
  session?: Session;
}

/**
 * User authentication session containing tokens and user information
 * @property accessToken - JWT token for authenticating API requests
 *    Example - eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 * @property accessTokenExpiresIn - Expiration time of the access token in seconds
 *    Example - 900
 *    Format - int64
 * @property refreshTokenId - Identifier for the refresh token
 *    Example - 2c35b6f3-c4b9-48e3-978a-d4d0f1d42e24
 *    Pattern - \b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b
 * @property refreshToken - Token used to refresh the access token
 *    Example - 2c35b6f3-c4b9-48e3-978a-d4d0f1d42e24
 *    Pattern - \b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b
 * @property user - User profile and account information*/
export interface SignInOTPEmailVerifyResponseSession {
  /**
   *JWT token for authenticating API requests
   *    Example - eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   */
  accessToken: string;
  /**
   *Expiration time of the access token in seconds
   *    Example - 900
   *    Format - int64
   */
  accessTokenExpiresIn: number;
  /**
   *Identifier for the refresh token
   *    Example - 2c35b6f3-c4b9-48e3-978a-d4d0f1d42e24
   *    Pattern - \b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b
   */
  refreshTokenId: string;
  /**
   *Token used to refresh the access token
   *    Example - 2c35b6f3-c4b9-48e3-978a-d4d0f1d42e24
   *    Pattern - \b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b
   */
  refreshToken: string;
  /**
   *User profile and account information
   */
  user?: User;
}

/**
 * User profile and account information
 * @property avatarUrl - URL to the user's profile picture
 *    Example - https://myapp.com/avatars/user123.jpg
 * @property createdAt - Timestamp when the user account was created
 *    Example - 2023-01-15T12:34:56Z
 *    Format - date-time
 * @property defaultRole - Default authorization role for the user
 *    Example - user
 * @property displayName - User's display name
 *    Example - John Smith
 * @property email - User's email address
 *    Example - john.smith@nhost.io
 *    Format - email
 * @property emailVerified - Whether the user's email has been verified
 *    Example - true
 * @property id - Unique identifier for the user
 *    Example - 2c35b6f3-c4b9-48e3-978a-d4d0f1d42e24
 *    Pattern - \b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b
 * @property isAnonymous - Whether this is an anonymous user account
 *    Example - false
 * @property locale - User's preferred locale (language code)
 *    Example - en
 *    MinLength - 2
 *    MaxLength - 2
 * @property metadata - Custom metadata associated with the user
 * @property phoneNumber - User's phone number
 *    Example - +12025550123
 * @property phoneNumberVerified - Whether the user's phone number has been verified
 *    Example - false
 * @property roles - List of roles assigned to the user*/
export interface SignInOTPEmailVerifyResponseSessionUser {
  /**
   *URL to the user's profile picture
   *    Example - https://myapp.com/avatars/user123.jpg
   */
  avatarUrl: string;
  /**
   *Timestamp when the user account was created
   *    Example - 2023-01-15T12:34:56Z
   *    Format - date-time
   */
  createdAt: string;
  /**
   *Default authorization role for the user
   *    Example - user
   */
  defaultRole: string;
  /**
   *User's display name
   *    Example - John Smith
   */
  displayName: string;
  /**
   *User's email address
   *    Example - john.smith@nhost.io
   *    Format - email
   */
  email?: string;
  /**
   *Whether the user's email has been verified
   *    Example - true
   */
  emailVerified: boolean;
  /**
   *Unique identifier for the user
   *    Example - 2c35b6f3-c4b9-48e3-978a-d4d0f1d42e24
   *    Pattern - \b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b
   */
  id: string;
  /**
   *Whether this is an anonymous user account
   *    Example - false
   */
  isAnonymous: boolean;
  /**
   *User's preferred locale (language code)
   *    Example - en
   *    MinLength - 2
   *    MaxLength - 2
   */
  locale: string;
  /**
   *Custom metadata associated with the user
   */
  metadata: Record<string, any>;
  /**
   *User's phone number
   *    Example - +12025550123
   */
  phoneNumber?: string;
  /**
   *Whether the user's phone number has been verified
   *    Example - false
   */
  phoneNumberVerified: boolean;
  /**
   *List of roles assigned to the user
   */
  roles: string[];
}

/**
 * Request to register a new user with email and password
 * @property email - Email address for the new user account
 *    Example - john.smith@nhost.io
 *    Format - email
 * @property password - Password for the new user account
 *    Example - Str0ngPassw#ord-94|%
 *    MinLength - 3
 *    MaxLength - 50
 * @property options - */
export interface SignUpEmailPasswordRequest {
  /**
   *Email address for the new user account
   *    Example - john.smith@nhost.io
   *    Format - email
   */
  email: string;
  /**
   *Password for the new user account
   *    Example - Str0ngPassw#ord-94|%
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
 * @property allowedRoles -
 * @property defaultRole -
 *    Example - user
 * @property displayName -
 *    Example - John Smith
 *    Pattern - ^[\p{L}\p{N}\p{S} ,.'-]+$
 *    MaxLength - 32
 * @property locale - A two-characters locale
 *    Example - en
 *    MinLength - 2
 *    MaxLength - 2
 * @property metadata -
 * @property redirectTo -
 *    Example - https://my-app.com/catch-redirection
 *    Format - uri*/
export interface SignUpEmailPasswordRequestOptions {
  /**
   *
   */
  allowedRoles?: string[];
  /**
   *
   *    Example - user
   */
  defaultRole?: string;
  /**
   *
   *    Example - John Smith
   *    Pattern - ^[\p{L}\p{N}\p{S} ,.'-]+$
   *    MaxLength - 32
   */
  displayName?: string;
  /**
   *A two-characters locale
   *    Example - en
   *    MinLength - 2
   *    MaxLength - 2
   */
  locale?: string;
  /**
   *
   */
  metadata?: Record<string, any>;
  /**
   *
   *    Example - https://my-app.com/catch-redirection
   *    Format - uri
   */
  redirectTo?: string;
}

/**
 *
 * @property allowedRoles -
 * @property defaultRole -
 *    Example - user
 * @property displayName -
 *    Example - John Smith
 *    Pattern - ^[\p{L}\p{N}\p{S} ,.'-]+$
 *    MaxLength - 32
 * @property locale - A two-characters locale
 *    Example - en
 *    MinLength - 2
 *    MaxLength - 2
 * @property metadata -
 * @property redirectTo -
 *    Example - https://my-app.com/catch-redirection
 *    Format - uri*/
export interface SignUpOptions {
  /**
   *
   */
  allowedRoles?: string[];
  /**
   *
   *    Example - user
   */
  defaultRole?: string;
  /**
   *
   *    Example - John Smith
   *    Pattern - ^[\p{L}\p{N}\p{S} ,.'-]+$
   *    MaxLength - 32
   */
  displayName?: string;
  /**
   *A two-characters locale
   *    Example - en
   *    MinLength - 2
   *    MaxLength - 2
   */
  locale?: string;
  /**
   *
   */
  metadata?: Record<string, any>;
  /**
   *
   *    Example - https://my-app.com/catch-redirection
   *    Format - uri
   */
  redirectTo?: string;
}

/**
 *
 * @property email - A valid email
 *    Example - john.smith@nhost.io
 *    Format - email*/
export interface SignInWebauthnRequest {
  /**
   *A valid email
   *    Example - john.smith@nhost.io
   *    Format - email
   */
  email?: string;
}

/**
 *
 * @property email - A valid email
 *    Example - john.smith@nhost.io
 *    Format - email
 * @property options - */
export interface SignUpWebauthnRequest {
  /**
   *A valid email
   *    Example - john.smith@nhost.io
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
 * @property allowedRoles -
 * @property defaultRole -
 *    Example - user
 * @property displayName -
 *    Example - John Smith
 *    Pattern - ^[\p{L}\p{N}\p{S} ,.'-]+$
 *    MaxLength - 32
 * @property locale - A two-characters locale
 *    Example - en
 *    MinLength - 2
 *    MaxLength - 2
 * @property metadata -
 * @property redirectTo -
 *    Example - https://my-app.com/catch-redirection
 *    Format - uri*/
export interface SignUpWebauthnRequestOptions {
  /**
   *
   */
  allowedRoles?: string[];
  /**
   *
   *    Example - user
   */
  defaultRole?: string;
  /**
   *
   *    Example - John Smith
   *    Pattern - ^[\p{L}\p{N}\p{S} ,.'-]+$
   *    MaxLength - 32
   */
  displayName?: string;
  /**
   *A two-characters locale
   *    Example - en
   *    MinLength - 2
   *    MaxLength - 2
   */
  locale?: string;
  /**
   *
   */
  metadata?: Record<string, any>;
  /**
   *
   *    Example - https://my-app.com/catch-redirection
   *    Format - uri
   */
  redirectTo?: string;
}

/**
 * */
export interface SignInWebauthnResponse {}

/**
 * */
export interface SignUpWebauthnResponse {}

/**
 *
 * @property email - A valid email. Deprecated, no longer used
 *    Example - john.smith@nhost.io
 *    Format - email
 * @property credential - */
export interface SignInWebauthnVerifyRequest {
  /**
   *A valid email. Deprecated, no longer used
   *    Example - john.smith@nhost.io
   *    Format - email
   */
  email?: string;
  /**
   *
   */
  credential: Record<string, any>;
}

/**
 *
 * @property credential -
 * @property options - */
export interface SignUpWebauthnVerifyRequest {
  /**
   *
   */
  credential?: Record<string, any>;
  /**
   *
   */
  options?: SignUpWebauthnVerifyRequestOptions;
}

/**
 *
 * @property nickname - */
export interface SignUpWebauthnVerifyRequestOptionsAllOf1 {
  /**
   *
   */
  nickname?: string;
}

export type SignUpWebauthnVerifyRequestOptions = SignUpOptions &
  SignUpWebauthnVerifyRequestOptionsAllOf1 & {};

/**
 *
 * @property provider -
 * @property idToken - Apple ID token
 * @property nonce - Nonce used during sign in process
 * @property options - */
export interface SignInIdTokenRequest {
  /**
   *
   */
  provider: SignInIdTokenRequestProvider;
  /**
   *Apple ID token
   */
  idToken: string;
  /**
   *Nonce used during sign in process
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
export enum SignInIdTokenRequestProvider {
  Apple = "apple",
  Google = "google",
}

/**
 *
 * @property allowedRoles -
 * @property defaultRole -
 *    Example - user
 * @property displayName -
 *    Example - John Smith
 *    Pattern - ^[\p{L}\p{N}\p{S} ,.'-]+$
 *    MaxLength - 32
 * @property locale - A two-characters locale
 *    Example - en
 *    MinLength - 2
 *    MaxLength - 2
 * @property metadata -
 * @property redirectTo -
 *    Example - https://my-app.com/catch-redirection
 *    Format - uri*/
export interface SignInIdTokenRequestOptions {
  /**
   *
   */
  allowedRoles?: string[];
  /**
   *
   *    Example - user
   */
  defaultRole?: string;
  /**
   *
   *    Example - John Smith
   *    Pattern - ^[\p{L}\p{N}\p{S} ,.'-]+$
   *    MaxLength - 32
   */
  displayName?: string;
  /**
   *A two-characters locale
   *    Example - en
   *    MinLength - 2
   *    MaxLength - 2
   */
  locale?: string;
  /**
   *
   */
  metadata?: Record<string, any>;
  /**
   *
   *    Example - https://my-app.com/catch-redirection
   *    Format - uri
   */
  redirectTo?: string;
}

/**
 *
 * @property ticket - Ticket
 *    Pattern - ^mfaTotp:.*$
 * @property otp - One time password*/
export interface SignInMfaTotpRequest {
  /**
   *Ticket
   *    Pattern - ^mfaTotp:.*$
   */
  ticket: string;
  /**
   *One time password
   */
  otp: string;
}

/**
 *
 */
export enum IdTokenProvider {
  Apple = "apple",
  Google = "google",
}

/**
 *
 * @property provider -
 * @property idToken - Apple ID token
 * @property nonce - Nonce used during sign in process*/
export interface LinkIdTokenRequest {
  /**
   *
   */
  provider: LinkIdTokenRequestProvider;
  /**
   *Apple ID token
   */
  idToken: string;
  /**
   *Nonce used during sign in process
   */
  nonce?: string;
}

/**
 *
 */
export enum LinkIdTokenRequestProvider {
  Apple = "apple",
  Google = "google",
}

/**
 * Request to activate or deactivate multi-factor authentication
 * @property code - Verification code from the authenticator app when activating MFA
 *    Example - 123456
 * @property activeMfaType - Type of MFA to activate. Use empty string to disable MFA.
 *    Example - totp*/
export interface UserMfaRequest {
  /**
   *Verification code from the authenticator app when activating MFA
   *    Example - 123456
   */
  code: string;
  /**
   *Type of MFA to activate. Use empty string to disable MFA.
   *    Example - totp
   */
  activeMfaType?: UserMfaRequestActiveMfaType;
}

/**
 * Type of MFA to activate. Use empty string to disable MFA.
 */
export enum UserMfaRequestActiveMfaType {
  Totp = "totp",
  Empty = "",
}

/**
 * Response containing TOTP setup information for MFA
 * @property imageUrl - URL to QR code image for scanning with an authenticator app
 *    Example - data:image/png;base64,iVBORw0KGg...
 * @property totpSecret - TOTP secret key for manual setup with an authenticator app
 *    Example - ABCDEFGHIJK23456*/
export interface TotpGenerateResponse {
  /**
   *URL to QR code image for scanning with an authenticator app
   *    Example - data:image/png;base64,iVBORw0KGg...
   */
  imageUrl: string;
  /**
   *TOTP secret key for manual setup with an authenticator app
   *    Example - ABCDEFGHIJK23456
   */
  totpSecret: string;
}

/**
 *
 * @property version - The version of the authentication service
 *    Example - 1.2.3*/
export interface GetVersion200 {
  /**
   *The version of the authentication service
   *    Example - 1.2.3
   */
  version: string;
}

/**
 * Type of the ticket
 */
export enum Type {
  EmailVerify = "emailVerify",
  EmailConfirmChange = "emailConfirmChange",
  SigninPasswordless = "signinPasswordless",
  PasswordReset = "passwordReset",
}

/**
 *
 */
export enum Provider {
  Apple = "apple",
  Github = "github",
  Google = "google",
  Linkedin = "linkedin",
  Discord = "discord",
  Spotify = "spotify",
}

export interface VerifyTicketParams {
  ticket: string;
  type?: Type;
  redirectTo: string;
}

export interface SignInProviderParams {
  allowedRoles?: string[];
  defaultRole?: string;
  displayName?: string;
  locale?: string;
  metadata?: Record<string, any>;
  redirectTo?: string;
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

  /**
   * Health check (GET)
   *
   * Verify if the authentication service is operational using GET method
   */
  const healthCheckGet = async (
    options?: RequestInit,
  ): Promise<FetchResponse<OKResponse>> => {
    const url = baseURL + `/healthz`;
    const res = await fetch(url, {
      ...options,
      method: "GET",
    });

    if (res.status >= 400) {
      const body = [412].includes(res.status) ? null : await res.text();
      const payload: unknown = body ? JSON.parse(body) : {};
      throw new FetchError(payload, res.status, res.headers);
    }
    const body = [204, 205, 304].includes(res.status) ? null : await res.text();
    const payload: OKResponse = body ? JSON.parse(body) : {};

    return {
      body: payload,
      status: res.status,
      headers: res.headers,
    } as FetchResponse<OKResponse>;
  };

  /**
   * Health check (HEAD)
   *
   * Verify if the authentication service is operational using HEAD method
   */
  const healthCheckHead = async (
    options?: RequestInit,
  ): Promise<FetchResponse<void>> => {
    const url = baseURL + `/healthz`;
    const res = await fetch(url, {
      ...options,
      method: "HEAD",
    });

    if (res.status >= 400) {
      const body = [412].includes(res.status) ? null : await res.text();
      const payload: unknown = body ? JSON.parse(body) : {};
      throw new FetchError(payload, res.status, res.headers);
    }
    const body = [204, 205, 304].includes(res.status) ? null : await res.text();
    const payload: void = body ? JSON.parse(body) : {};

    return {
      body: payload,
      status: res.status,
      headers: res.headers,
    } as FetchResponse<void>;
  };

  /**
   * Get service version
   *
   * Retrieve version information about the authentication service
   */
  const getVersion = async (
    options?: RequestInit,
  ): Promise<FetchResponse<GetVersion200>> => {
    const url = baseURL + `/version`;
    const res = await fetch(url, {
      ...options,
      method: "GET",
    });

    if (res.status >= 400) {
      const body = [412].includes(res.status) ? null : await res.text();
      const payload: unknown = body ? JSON.parse(body) : {};
      throw new FetchError(payload, res.status, res.headers);
    }
    const body = [204, 205, 304].includes(res.status) ? null : await res.text();
    const payload: GetVersion200 = body ? JSON.parse(body) : {};

    return {
      body: payload,
      status: res.status,
      headers: res.headers,
    } as FetchResponse<GetVersion200>;
  };

  /**
   * Refresh access token
   *
   * Generate a new JWT access token using a valid refresh token. The refresh token used will be revoked and a new one will be issued.
   */
  const refreshToken = async (
    refreshTokenBody: RefreshTokenRequest,
    options?: RequestInit,
  ): Promise<FetchResponse<Session>> => {
    const url = baseURL + `/token`;
    const res = await fetch(url, {
      ...options,
      method: "POST",
      headers: { "Content-Type": "application/json", ...options?.headers },
      body: JSON.stringify(refreshTokenBody),
    });

    if (res.status >= 400) {
      const body = [412].includes(res.status) ? null : await res.text();
      const payload: unknown = body ? JSON.parse(body) : {};
      throw new FetchError(payload, res.status, res.headers);
    }
    const body = [204, 205, 304].includes(res.status) ? null : await res.text();
    const payload: Session = body ? JSON.parse(body) : {};

    return {
      body: payload,
      status: res.status,
      headers: res.headers,
    } as FetchResponse<Session>;
  };

  /**
   * Sign out
   *
   *
   */
  const signOut = async (
    signOutBody: SignOutSchema,
    options?: RequestInit,
  ): Promise<FetchResponse<OKResponse>> => {
    const url = baseURL + `/signout`;
    const res = await fetch(url, {
      ...options,
      method: "POST",
      headers: { "Content-Type": "application/json", ...options?.headers },
      body: JSON.stringify(signOutBody),
    });

    if (res.status >= 400) {
      const body = [412].includes(res.status) ? null : await res.text();
      const payload: unknown = body ? JSON.parse(body) : {};
      throw new FetchError(payload, res.status, res.headers);
    }
    const body = [204, 205, 304].includes(res.status) ? null : await res.text();
    const payload: OKResponse = body ? JSON.parse(body) : {};

    return {
      body: payload,
      status: res.status,
      headers: res.headers,
    } as FetchResponse<OKResponse>;
  };

  /**
   * Sign in with email and password
   *
   * Authenticate a user with their email and password. Returns a session object or MFA challenge if two-factor authentication is enabled.
   */
  const signInEmailPassword = async (
    signInEmailPasswordBody: SignInEmailPasswordRequest,
    options?: RequestInit,
  ): Promise<FetchResponse<SignInEmailPasswordResponse>> => {
    const url = baseURL + `/signin/email-password`;
    const res = await fetch(url, {
      ...options,
      method: "POST",
      headers: { "Content-Type": "application/json", ...options?.headers },
      body: JSON.stringify(signInEmailPasswordBody),
    });

    if (res.status >= 400) {
      const body = [412].includes(res.status) ? null : await res.text();
      const payload: unknown = body ? JSON.parse(body) : {};
      throw new FetchError(payload, res.status, res.headers);
    }
    const body = [204, 205, 304].includes(res.status) ? null : await res.text();
    const payload: SignInEmailPasswordResponse = body ? JSON.parse(body) : {};

    return {
      body: payload,
      status: res.status,
      headers: res.headers,
    } as FetchResponse<SignInEmailPasswordResponse>;
  };

  /**
   * Verify TOTP for MFA
   *
   * Complete the multi-factor authentication by verifying a Time-based One-Time Password (TOTP). Returns a session if validation is successful.
   */
  const signInVerifyMfaTotp = async (
    signInVerifyMfaTotpBody: SignInMfaTotpRequest,
    options?: RequestInit,
  ): Promise<FetchResponse<SessionPayload>> => {
    const url = baseURL + `/signin/mfa/totp`;
    const res = await fetch(url, {
      ...options,
      method: "POST",
      headers: { "Content-Type": "application/json", ...options?.headers },
      body: JSON.stringify(signInVerifyMfaTotpBody),
    });

    if (res.status >= 400) {
      const body = [412].includes(res.status) ? null : await res.text();
      const payload: unknown = body ? JSON.parse(body) : {};
      throw new FetchError(payload, res.status, res.headers);
    }
    const body = [204, 205, 304].includes(res.status) ? null : await res.text();
    const payload: SessionPayload = body ? JSON.parse(body) : {};

    return {
      body: payload,
      status: res.status,
      headers: res.headers,
    } as FetchResponse<SessionPayload>;
  };

  /**
   * Sign in with magic link email
   *
   * Initiate passwordless authentication by sending a magic link to the user's email. If the user doesn't exist, a new account will be created with the provided options.
   */
  const signInPasswordlessEmail = async (
    signInPasswordlessEmailBody: SignInPasswordlessEmailRequest,
    options?: RequestInit,
  ): Promise<FetchResponse<OKResponse>> => {
    const url = baseURL + `/signin/passwordless/email`;
    const res = await fetch(url, {
      ...options,
      method: "POST",
      headers: { "Content-Type": "application/json", ...options?.headers },
      body: JSON.stringify(signInPasswordlessEmailBody),
    });

    if (res.status >= 400) {
      const body = [412].includes(res.status) ? null : await res.text();
      const payload: unknown = body ? JSON.parse(body) : {};
      throw new FetchError(payload, res.status, res.headers);
    }
    const body = [204, 205, 304].includes(res.status) ? null : await res.text();
    const payload: OKResponse = body ? JSON.parse(body) : {};

    return {
      body: payload,
      status: res.status,
      headers: res.headers,
    } as FetchResponse<OKResponse>;
  };

  /**
   * Sign up with email and password
   *
   * Register a new user account with email and password. Returns a session if email verification is not required, otherwise returns null session.
   */
  const signUpEmailPassword = async (
    signUpEmailPasswordBody: SignUpEmailPasswordRequest,
    options?: RequestInit,
  ): Promise<FetchResponse<SessionPayload>> => {
    const url = baseURL + `/signup/email-password`;
    const res = await fetch(url, {
      ...options,
      method: "POST",
      headers: { "Content-Type": "application/json", ...options?.headers },
      body: JSON.stringify(signUpEmailPasswordBody),
    });

    if (res.status >= 400) {
      const body = [412].includes(res.status) ? null : await res.text();
      const payload: unknown = body ? JSON.parse(body) : {};
      throw new FetchError(payload, res.status, res.headers);
    }
    const body = [204, 205, 304].includes(res.status) ? null : await res.text();
    const payload: SessionPayload = body ? JSON.parse(body) : {};

    return {
      body: payload,
      status: res.status,
      headers: res.headers,
    } as FetchResponse<SessionPayload>;
  };

  /**
   * Manage multi-factor authentication
   *
   * Activate or deactivate multi-factor authentication for the authenticated user
   */
  const changeUserMfaVerify = async (
    changeUserMfaVerifyBody: UserMfaRequest,
    options?: RequestInit,
  ): Promise<FetchResponse<OKResponse>> => {
    const url = baseURL + `/user/mfa`;
    const res = await fetch(url, {
      ...options,
      method: "POST",
      headers: { "Content-Type": "application/json", ...options?.headers },
      body: JSON.stringify(changeUserMfaVerifyBody),
    });

    if (res.status >= 400) {
      const body = [412].includes(res.status) ? null : await res.text();
      const payload: unknown = body ? JSON.parse(body) : {};
      throw new FetchError(payload, res.status, res.headers);
    }
    const body = [204, 205, 304].includes(res.status) ? null : await res.text();
    const payload: OKResponse = body ? JSON.parse(body) : {};

    return {
      body: payload,
      status: res.status,
      headers: res.headers,
    } as FetchResponse<OKResponse>;
  };

  /**
   * Generate TOTP secret
   *
   * Generate a Time-based One-Time Password (TOTP) secret for setting up multi-factor authentication
   */
  const changeUserMfa = async (
    options?: RequestInit,
  ): Promise<FetchResponse<TotpGenerateResponse>> => {
    const url = baseURL + `/mfa/totp/generate`;
    const res = await fetch(url, {
      ...options,
      method: "GET",
    });

    if (res.status >= 400) {
      const body = [412].includes(res.status) ? null : await res.text();
      const payload: unknown = body ? JSON.parse(body) : {};
      throw new FetchError(payload, res.status, res.headers);
    }
    const body = [204, 205, 304].includes(res.status) ? null : await res.text();
    const payload: TotpGenerateResponse = body ? JSON.parse(body) : {};

    return {
      body: payload,
      status: res.status,
      headers: res.headers,
    } as FetchResponse<TotpGenerateResponse>;
  };

  /**
   * Get public keys for JWT verification in JWK Set format
   *
   *
   */
  const getJWKs = async (
    options?: RequestInit,
  ): Promise<FetchResponse<JWKSet>> => {
    const url = baseURL + `/.well-known/jwks.json`;
    const res = await fetch(url, {
      ...options,
      method: "GET",
    });

    if (res.status >= 400) {
      const body = [412].includes(res.status) ? null : await res.text();
      const payload: unknown = body ? JSON.parse(body) : {};
      throw new FetchError(payload, res.status, res.headers);
    }
    const body = [204, 205, 304].includes(res.status) ? null : await res.text();
    const payload: JWKSet = body ? JSON.parse(body) : {};

    return {
      body: payload,
      status: res.status,
      headers: res.headers,
    } as FetchResponse<JWKSet>;
  };

  /**
   * Create a Personal Access Token (PAT)
   *
   *
   */
  const createPAT = async (
    createPATBody: CreatePATRequest,
    options?: RequestInit,
  ): Promise<FetchResponse<CreatePATResponse>> => {
    const url = baseURL + `/pat`;
    const res = await fetch(url, {
      ...options,
      method: "POST",
      headers: { "Content-Type": "application/json", ...options?.headers },
      body: JSON.stringify(createPATBody),
    });

    if (res.status >= 400) {
      const body = [412].includes(res.status) ? null : await res.text();
      const payload: unknown = body ? JSON.parse(body) : {};
      throw new FetchError(payload, res.status, res.headers);
    }
    const body = [204, 205, 304].includes(res.status) ? null : await res.text();
    const payload: CreatePATResponse = body ? JSON.parse(body) : {};

    return {
      body: payload,
      status: res.status,
      headers: res.headers,
    } as FetchResponse<CreatePATResponse>;
  };

  /**
   * Sign in anonymously
   *
   *
   */
  const signInAnonymous = async (
    signInAnonymousBody?: SignInAnonymousRequest,
    options?: RequestInit,
  ): Promise<FetchResponse<SessionPayload>> => {
    const url = baseURL + `/signin/anonymous`;
    const res = await fetch(url, {
      ...options,
      method: "POST",
      headers: { "Content-Type": "application/json", ...options?.headers },
      body: JSON.stringify(signInAnonymousBody),
    });

    if (res.status >= 400) {
      const body = [412].includes(res.status) ? null : await res.text();
      const payload: unknown = body ? JSON.parse(body) : {};
      throw new FetchError(payload, res.status, res.headers);
    }
    const body = [204, 205, 304].includes(res.status) ? null : await res.text();
    const payload: SessionPayload = body ? JSON.parse(body) : {};

    return {
      body: payload,
      status: res.status,
      headers: res.headers,
    } as FetchResponse<SessionPayload>;
  };

  /**
   * Sign in with a one time password sent to user's email. If the user doesn't exist, it will be created. The options object is optional and can be used to configure the user's when signing up a new user. It is ignored if the user already exists.
   *
   *
   */
  const signInOTPEmail = async (
    signInOTPEmailBody: SignInOTPEmailRequest,
    options?: RequestInit,
  ): Promise<FetchResponse<OKResponse>> => {
    const url = baseURL + `/signin/otp/email`;
    const res = await fetch(url, {
      ...options,
      method: "POST",
      headers: { "Content-Type": "application/json", ...options?.headers },
      body: JSON.stringify(signInOTPEmailBody),
    });

    if (res.status >= 400) {
      const body = [412].includes(res.status) ? null : await res.text();
      const payload: unknown = body ? JSON.parse(body) : {};
      throw new FetchError(payload, res.status, res.headers);
    }
    const body = [204, 205, 304].includes(res.status) ? null : await res.text();
    const payload: OKResponse = body ? JSON.parse(body) : {};

    return {
      body: payload,
      status: res.status,
      headers: res.headers,
    } as FetchResponse<OKResponse>;
  };

  /**
   * Verify OTP and return a session if validation is successful
   *
   *
   */
  const verifySignInOTPEmail = async (
    verifySignInOTPEmailBody: SignInOTPEmailVerifyRequest,
    options?: RequestInit,
  ): Promise<FetchResponse<SignInOTPEmailVerifyResponse>> => {
    const url = baseURL + `/signin/otp/email/verify`;
    const res = await fetch(url, {
      ...options,
      method: "POST",
      headers: { "Content-Type": "application/json", ...options?.headers },
      body: JSON.stringify(verifySignInOTPEmailBody),
    });

    if (res.status >= 400) {
      const body = [412].includes(res.status) ? null : await res.text();
      const payload: unknown = body ? JSON.parse(body) : {};
      throw new FetchError(payload, res.status, res.headers);
    }
    const body = [204, 205, 304].includes(res.status) ? null : await res.text();
    const payload: SignInOTPEmailVerifyResponse = body ? JSON.parse(body) : {};

    return {
      body: payload,
      status: res.status,
      headers: res.headers,
    } as FetchResponse<SignInOTPEmailVerifyResponse>;
  };

  /**
   * Sign in with Personal Access Token (PAT)
   *
   *
   */
  const signInPAT = async (
    signInPATBody: SignInPATRequest,
    options?: RequestInit,
  ): Promise<FetchResponse<SessionPayload>> => {
    const url = baseURL + `/signin/pat`;
    const res = await fetch(url, {
      ...options,
      method: "POST",
      headers: { "Content-Type": "application/json", ...options?.headers },
      body: JSON.stringify(signInPATBody),
    });

    if (res.status >= 400) {
      const body = [412].includes(res.status) ? null : await res.text();
      const payload: unknown = body ? JSON.parse(body) : {};
      throw new FetchError(payload, res.status, res.headers);
    }
    const body = [204, 205, 304].includes(res.status) ? null : await res.text();
    const payload: SessionPayload = body ? JSON.parse(body) : {};

    return {
      body: payload,
      status: res.status,
      headers: res.headers,
    } as FetchResponse<SessionPayload>;
  };

  /**
   * Sign in with in an id token
   *
   *
   */
  const signInIdToken = async (
    signInIdTokenBody: SignInIdTokenRequest,
    options?: RequestInit,
  ): Promise<FetchResponse<SessionPayload>> => {
    const url = baseURL + `/signin/idtoken`;
    const res = await fetch(url, {
      ...options,
      method: "POST",
      headers: { "Content-Type": "application/json", ...options?.headers },
      body: JSON.stringify(signInIdTokenBody),
    });

    if (res.status >= 400) {
      const body = [412].includes(res.status) ? null : await res.text();
      const payload: unknown = body ? JSON.parse(body) : {};
      throw new FetchError(payload, res.status, res.headers);
    }
    const body = [204, 205, 304].includes(res.status) ? null : await res.text();
    const payload: SessionPayload = body ? JSON.parse(body) : {};

    return {
      body: payload,
      status: res.status,
      headers: res.headers,
    } as FetchResponse<SessionPayload>;
  };

  /**
   * Link a user account with the provider's account using an id token
   *
   *
   */
  const linkIdToken = async (
    linkIdTokenBody: LinkIdTokenRequest,
    options?: RequestInit,
  ): Promise<FetchResponse<OKResponse>> => {
    const url = baseURL + `/link/idtoken`;
    const res = await fetch(url, {
      ...options,
      method: "POST",
      headers: { "Content-Type": "application/json", ...options?.headers },
      body: JSON.stringify(linkIdTokenBody),
    });

    if (res.status >= 400) {
      const body = [412].includes(res.status) ? null : await res.text();
      const payload: unknown = body ? JSON.parse(body) : {};
      throw new FetchError(payload, res.status, res.headers);
    }
    const body = [204, 205, 304].includes(res.status) ? null : await res.text();
    const payload: OKResponse = body ? JSON.parse(body) : {};

    return {
      body: payload,
      status: res.status,
      headers: res.headers,
    } as FetchResponse<OKResponse>;
  };

  /**
   * Deanonymize an anonymous user in adding missing email or email+password, depending on the chosen authentication method. Will send a confirmation email if the server is configured to do so
   *
   *
   */
  const deanonymizeUser = async (
    deanonymizeUserBody: UserDeanonymizeRequest,
    options?: RequestInit,
  ): Promise<FetchResponse<OKResponse>> => {
    const url = baseURL + `/user/deanonymize`;
    const res = await fetch(url, {
      ...options,
      method: "POST",
      headers: { "Content-Type": "application/json", ...options?.headers },
      body: JSON.stringify(deanonymizeUserBody),
    });

    if (res.status >= 400) {
      const body = [412].includes(res.status) ? null : await res.text();
      const payload: unknown = body ? JSON.parse(body) : {};
      throw new FetchError(payload, res.status, res.headers);
    }
    const body = [204, 205, 304].includes(res.status) ? null : await res.text();
    const payload: OKResponse = body ? JSON.parse(body) : {};

    return {
      body: payload,
      status: res.status,
      headers: res.headers,
    } as FetchResponse<OKResponse>;
  };

  /**
   * Change user email
   *
   *
   */
  const changeUserEmail = async (
    changeUserEmailBody: UserEmailChangeRequest,
    options?: RequestInit,
  ): Promise<FetchResponse<OKResponse>> => {
    const url = baseURL + `/user/email/change`;
    const res = await fetch(url, {
      ...options,
      method: "POST",
      headers: { "Content-Type": "application/json", ...options?.headers },
      body: JSON.stringify(changeUserEmailBody),
    });

    if (res.status >= 400) {
      const body = [412].includes(res.status) ? null : await res.text();
      const payload: unknown = body ? JSON.parse(body) : {};
      throw new FetchError(payload, res.status, res.headers);
    }
    const body = [204, 205, 304].includes(res.status) ? null : await res.text();
    const payload: OKResponse = body ? JSON.parse(body) : {};

    return {
      body: payload,
      status: res.status,
      headers: res.headers,
    } as FetchResponse<OKResponse>;
  };

  /**
   * Send verification email
   *
   *
   */
  const sendVerificationEmail = async (
    sendVerificationEmailBody: UserEmailSendVerificationEmailRequest,
    options?: RequestInit,
  ): Promise<FetchResponse<OKResponse>> => {
    const url = baseURL + `/user/email/send-verification-email`;
    const res = await fetch(url, {
      ...options,
      method: "POST",
      headers: { "Content-Type": "application/json", ...options?.headers },
      body: JSON.stringify(sendVerificationEmailBody),
    });

    if (res.status >= 400) {
      const body = [412].includes(res.status) ? null : await res.text();
      const payload: unknown = body ? JSON.parse(body) : {};
      throw new FetchError(payload, res.status, res.headers);
    }
    const body = [204, 205, 304].includes(res.status) ? null : await res.text();
    const payload: OKResponse = body ? JSON.parse(body) : {};

    return {
      body: payload,
      status: res.status,
      headers: res.headers,
    } as FetchResponse<OKResponse>;
  };

  /**
   * Change user password. The user must be authenticated or provide a ticket
   *
   *
   */
  const changeUserPassword = async (
    changeUserPasswordBody: UserPasswordRequest,
    options?: RequestInit,
  ): Promise<FetchResponse<OKResponse>> => {
    const url = baseURL + `/user/password`;
    const res = await fetch(url, {
      ...options,
      method: "POST",
      headers: { "Content-Type": "application/json", ...options?.headers },
      body: JSON.stringify(changeUserPasswordBody),
    });

    if (res.status >= 400) {
      const body = [412].includes(res.status) ? null : await res.text();
      const payload: unknown = body ? JSON.parse(body) : {};
      throw new FetchError(payload, res.status, res.headers);
    }
    const body = [204, 205, 304].includes(res.status) ? null : await res.text();
    const payload: OKResponse = body ? JSON.parse(body) : {};

    return {
      body: payload,
      status: res.status,
      headers: res.headers,
    } as FetchResponse<OKResponse>;
  };

  /**
   * Request a password reset. An email with a verification link will be sent to the user's address
   *
   *
   */
  const sendPasswordResetEmail = async (
    sendPasswordResetEmailBody: UserPasswordResetRequest,
    options?: RequestInit,
  ): Promise<FetchResponse<OKResponse>> => {
    const url = baseURL + `/user/password/reset`;
    const res = await fetch(url, {
      ...options,
      method: "POST",
      headers: { "Content-Type": "application/json", ...options?.headers },
      body: JSON.stringify(sendPasswordResetEmailBody),
    });

    if (res.status >= 400) {
      const body = [412].includes(res.status) ? null : await res.text();
      const payload: unknown = body ? JSON.parse(body) : {};
      throw new FetchError(payload, res.status, res.headers);
    }
    const body = [204, 205, 304].includes(res.status) ? null : await res.text();
    const payload: OKResponse = body ? JSON.parse(body) : {};

    return {
      body: payload,
      status: res.status,
      headers: res.headers,
    } as FetchResponse<OKResponse>;
  };

  /**
   * Verify tickets created by email verification, email passwordless authentication (magic link), or password reset
   *
   *
   */
  const verifyTicket = (params: VerifyTicketParams): string => {
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

    baseURL =
      stringifiedParams.length > 0
        ? baseURL + `/verify?${stringifiedParams}`
        : baseURL + `/verify`;
    return baseURL + `/verify`;
  };

  /**
   * Sign in with an oauth2 provider
   *
   *
   */
  const signInProvider = (
    provider: string,
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

    baseURL =
      stringifiedParams.length > 0
        ? baseURL + `/signin/provider/${provider}?${stringifiedParams}`
        : baseURL + `/signin/provider/${provider}`;
    return baseURL + `/signin/provider/${provider}`;
  };

  return {
    healthCheckGet,
    healthCheckHead,
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
    verifyTicket,
    signInProvider,
    baseURL,
    pushChainFunction,
  };
};
