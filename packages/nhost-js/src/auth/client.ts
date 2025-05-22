/**
 * This file is auto-generated. Do not edit manually.
 */
import { FetchError, createEnhancedFetch } from "../fetch";
import type { ChainFunction, FetchResponse } from "../fetch";

import type { Client } from "./interface";

/**
 * JSON Web Key Set for verifying JWT signatures
 * @property keys Array of public keys*/
export interface JWKSet {
  keys: JWK[];
}

/**
 * JSON Web Key for JWT verification
 * @property alg Algorithm used with this key
 *    Example - RS256
 * @property e RSA public exponent
 *    Example - AQAB
 * @property kid Key ID
 *    Example - key-id-1
 * @property kty Key type
 *    Example - RSA
 * @property n RSA modulus
 *    Example - abcd1234...
 * @property use Key usage
 *    Example - sig*/
export interface JWK {
  alg: string;
  e: string;
  kid: string;
  kty: string;
  n: string;
  use: string;
}

/**
 * Request to refresh an access token
 * @property refreshToken Refresh token used to generate a new access token
 *    Example - 2c35b6f3-c4b9-48e3-978a-d4d0f1d42e24
 *    Pattern - \b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b*/
export interface RefreshTokenRequest {
  refreshToken: string;
}

/**
 *
 * @property refreshToken Refresh token for the current session
 * @property all Sign out from all connected devices*/
export interface SignOutSchema {
  refreshToken: string;
  all?: boolean;
}

/**
 *
 * @property expiresAt Expiration date of the PAT
 *    Format - date-time
 * @property metadata */
export interface CreatePATRequest {
  expiresAt: string;
  metadata?: Record<string, any>;
}

/**
 *
 * @property id ID of the PAT
 *    Example - 2c35b6f3-c4b9-48e3-978a-d4d0f1d42e24
 *    Pattern - \b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b
 * @property personalAccessToken PAT
 *    Example - 2c35b6f3-c4b9-48e3-978a-d4d0f1d42e24
 *    Pattern - \b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b*/
export interface CreatePATResponse {
  id: string;
  personalAccessToken: string;
}

/**
 * Standardized error response
 * @property status HTTP status error code
 *    Example - 400
 * @property message Human-friendly error message
 *    Example - Invalid email format
 * @property error Error code identifying the specific application error*/
export interface ErrorResponse {
  status: number;
  message: string;
  error: string;
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
 * @property session User authentication session containing tokens and user information
 * @property mfa Challenge payload for multi-factor authentication*/
export interface SignInEmailPasswordResponse {
  session?: Session;
  mfa?: MFAChallengePayload;
}

/**
 * User authentication session containing tokens and user information
 * @property accessToken JWT token for authenticating API requests
 *    Example - eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 * @property accessTokenExpiresIn Expiration time of the access token in seconds
 *    Example - 900
 *    Format - int64
 * @property refreshTokenId Identifier for the refresh token
 *    Example - 2c35b6f3-c4b9-48e3-978a-d4d0f1d42e24
 *    Pattern - \b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b
 * @property refreshToken Token used to refresh the access token
 *    Example - 2c35b6f3-c4b9-48e3-978a-d4d0f1d42e24
 *    Pattern - \b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b
 * @property user User profile and account information*/
export interface SignInEmailPasswordResponseSession {
  accessToken: string;
  accessTokenExpiresIn: number;
  refreshTokenId: string;
  refreshToken: string;
  user?: User;
}

/**
 * User profile and account information
 * @property avatarUrl URL to the user's profile picture
 *    Example - https://myapp.com/avatars/user123.jpg
 * @property createdAt Timestamp when the user account was created
 *    Example - 2023-01-15T12:34:56Z
 *    Format - date-time
 * @property defaultRole Default authorization role for the user
 *    Example - user
 * @property displayName User's display name
 *    Example - John Smith
 * @property email User's email address
 *    Example - john.smith@nhost.io
 *    Format - email
 * @property emailVerified Whether the user's email has been verified
 *    Example - true
 * @property id Unique identifier for the user
 *    Example - 2c35b6f3-c4b9-48e3-978a-d4d0f1d42e24
 *    Pattern - \b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b
 * @property isAnonymous Whether this is an anonymous user account
 *    Example - false
 * @property locale User's preferred locale (language code)
 *    Example - en
 *    MinLength - 2
 *    MaxLength - 2
 * @property metadata Custom metadata associated with the user
 * @property phoneNumber User's phone number
 *    Example - +12025550123
 * @property phoneNumberVerified Whether the user's phone number has been verified
 *    Example - false
 * @property roles List of roles assigned to the user*/
export interface SignInEmailPasswordResponseSessionUser {
  avatarUrl: string;
  createdAt: string;
  defaultRole: string;
  displayName: string;
  email?: string;
  emailVerified: boolean;
  id: string;
  isAnonymous: boolean;
  locale: string;
  metadata: Record<string, any>;
  phoneNumber?: string;
  phoneNumberVerified: boolean;
  roles: string[];
}

/**
 * Challenge payload for multi-factor authentication
 * @property ticket Ticket to use when completing the MFA challenge
 *    Example - mfaTotp:abc123def456*/
export interface SignInEmailPasswordResponseMfa {
  ticket: string;
}

/**
 * Challenge payload for multi-factor authentication
 * @property ticket Ticket to use when completing the MFA challenge
 *    Example - mfaTotp:abc123def456*/
export interface MFAChallengePayload {
  ticket: string;
}

/**
 * Container for session information
 * @property session User authentication session containing tokens and user information*/
export interface SessionPayload {
  session?: Session;
}

/**
 * User authentication session containing tokens and user information
 * @property accessToken JWT token for authenticating API requests
 *    Example - eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 * @property accessTokenExpiresIn Expiration time of the access token in seconds
 *    Example - 900
 *    Format - int64
 * @property refreshTokenId Identifier for the refresh token
 *    Example - 2c35b6f3-c4b9-48e3-978a-d4d0f1d42e24
 *    Pattern - \b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b
 * @property refreshToken Token used to refresh the access token
 *    Example - 2c35b6f3-c4b9-48e3-978a-d4d0f1d42e24
 *    Pattern - \b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b
 * @property user User profile and account information*/
export interface SessionPayloadSession {
  accessToken: string;
  accessTokenExpiresIn: number;
  refreshTokenId: string;
  refreshToken: string;
  user?: User;
}

/**
 * User profile and account information
 * @property avatarUrl URL to the user's profile picture
 *    Example - https://myapp.com/avatars/user123.jpg
 * @property createdAt Timestamp when the user account was created
 *    Example - 2023-01-15T12:34:56Z
 *    Format - date-time
 * @property defaultRole Default authorization role for the user
 *    Example - user
 * @property displayName User's display name
 *    Example - John Smith
 * @property email User's email address
 *    Example - john.smith@nhost.io
 *    Format - email
 * @property emailVerified Whether the user's email has been verified
 *    Example - true
 * @property id Unique identifier for the user
 *    Example - 2c35b6f3-c4b9-48e3-978a-d4d0f1d42e24
 *    Pattern - \b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b
 * @property isAnonymous Whether this is an anonymous user account
 *    Example - false
 * @property locale User's preferred locale (language code)
 *    Example - en
 *    MinLength - 2
 *    MaxLength - 2
 * @property metadata Custom metadata associated with the user
 * @property phoneNumber User's phone number
 *    Example - +12025550123
 * @property phoneNumberVerified Whether the user's phone number has been verified
 *    Example - false
 * @property roles List of roles assigned to the user*/
export interface SessionPayloadSessionUser {
  avatarUrl: string;
  createdAt: string;
  defaultRole: string;
  displayName: string;
  email?: string;
  emailVerified: boolean;
  id: string;
  isAnonymous: boolean;
  locale: string;
  metadata: Record<string, any>;
  phoneNumber?: string;
  phoneNumberVerified: boolean;
  roles: string[];
}

/**
 * User authentication session containing tokens and user information
 * @property accessToken JWT token for authenticating API requests
 *    Example - eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 * @property accessTokenExpiresIn Expiration time of the access token in seconds
 *    Example - 900
 *    Format - int64
 * @property refreshTokenId Identifier for the refresh token
 *    Example - 2c35b6f3-c4b9-48e3-978a-d4d0f1d42e24
 *    Pattern - \b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b
 * @property refreshToken Token used to refresh the access token
 *    Example - 2c35b6f3-c4b9-48e3-978a-d4d0f1d42e24
 *    Pattern - \b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b
 * @property user User profile and account information*/
export interface Session {
  accessToken: string;
  accessTokenExpiresIn: number;
  refreshTokenId: string;
  refreshToken: string;
  user?: User;
}

/**
 * User profile and account information
 * @property avatarUrl URL to the user's profile picture
 *    Example - https://myapp.com/avatars/user123.jpg
 * @property createdAt Timestamp when the user account was created
 *    Example - 2023-01-15T12:34:56Z
 *    Format - date-time
 * @property defaultRole Default authorization role for the user
 *    Example - user
 * @property displayName User's display name
 *    Example - John Smith
 * @property email User's email address
 *    Example - john.smith@nhost.io
 *    Format - email
 * @property emailVerified Whether the user's email has been verified
 *    Example - true
 * @property id Unique identifier for the user
 *    Example - 2c35b6f3-c4b9-48e3-978a-d4d0f1d42e24
 *    Pattern - \b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b
 * @property isAnonymous Whether this is an anonymous user account
 *    Example - false
 * @property locale User's preferred locale (language code)
 *    Example - en
 *    MinLength - 2
 *    MaxLength - 2
 * @property metadata Custom metadata associated with the user
 * @property phoneNumber User's phone number
 *    Example - +12025550123
 * @property phoneNumberVerified Whether the user's phone number has been verified
 *    Example - false
 * @property roles List of roles assigned to the user*/
export interface SessionUser {
  avatarUrl: string;
  createdAt: string;
  defaultRole: string;
  displayName: string;
  email?: string;
  emailVerified: boolean;
  id: string;
  isAnonymous: boolean;
  locale: string;
  metadata: Record<string, any>;
  phoneNumber?: string;
  phoneNumberVerified: boolean;
  roles: string[];
}

/**
 *
 * @property personalAccessToken PAT
 *    Example - 2c35b6f3-c4b9-48e3-978a-d4d0f1d42e24
 *    Pattern - \b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b*/
export interface SignInPATRequest {
  personalAccessToken: string;
}

/**
 * User profile and account information
 * @property avatarUrl URL to the user's profile picture
 *    Example - https://myapp.com/avatars/user123.jpg
 * @property createdAt Timestamp when the user account was created
 *    Example - 2023-01-15T12:34:56Z
 *    Format - date-time
 * @property defaultRole Default authorization role for the user
 *    Example - user
 * @property displayName User's display name
 *    Example - John Smith
 * @property email User's email address
 *    Example - john.smith@nhost.io
 *    Format - email
 * @property emailVerified Whether the user's email has been verified
 *    Example - true
 * @property id Unique identifier for the user
 *    Example - 2c35b6f3-c4b9-48e3-978a-d4d0f1d42e24
 *    Pattern - \b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b
 * @property isAnonymous Whether this is an anonymous user account
 *    Example - false
 * @property locale User's preferred locale (language code)
 *    Example - en
 *    MinLength - 2
 *    MaxLength - 2
 * @property metadata Custom metadata associated with the user
 * @property phoneNumber User's phone number
 *    Example - +12025550123
 * @property phoneNumberVerified Whether the user's phone number has been verified
 *    Example - false
 * @property roles List of roles assigned to the user*/
export interface User {
  avatarUrl: string;
  createdAt: string;
  defaultRole: string;
  displayName: string;
  email?: string;
  emailVerified: boolean;
  id: string;
  isAnonymous: boolean;
  locale: string;
  metadata: Record<string, any>;
  phoneNumber?: string;
  phoneNumberVerified: boolean;
  roles: string[];
}

/**
 *
 * @property signInMethod Which sign-in method to use
 * @property email A valid email
 *    Example - john.smith@nhost.io
 *    Format - email
 * @property password A password of minimum 3 characters
 *    Example - Str0ngPassw#ord-94|%
 *    MinLength - 3
 *    MaxLength - 50
 * @property connection Deprecated, will be ignored
 * @property options */
export interface UserDeanonymizeRequest {
  signInMethod: string;
  email: string;
  password?: string;
  connection?: string;
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
 * @property allowedRoles
 * @property defaultRole
 *    Example - user
 * @property displayName
 *    Example - John Smith
 *    Pattern - ^[\p{L}\p{N}\p{S} ,.'-]+$
 *    MaxLength - 32
 * @property locale A two-characters locale
 *    Example - en
 *    MinLength - 2
 *    MaxLength - 2
 * @property metadata
 * @property redirectTo
 *    Example - https://my-app.com/catch-redirection
 *    Format - uri*/
export interface UserDeanonymizeRequestOptions {
  allowedRoles?: string[];
  defaultRole?: string;
  displayName?: string;
  locale?: string;
  metadata?: Record<string, any>;
  redirectTo?: string;
}

/**
 *
 * @property newEmail A valid email
 *    Example - john.smith@nhost.io
 *    Format - email
 * @property options */
export interface UserEmailChangeRequest {
  newEmail: string;
  options?: OptionsRedirectTo;
}

/**
 *
 * @property redirectTo
 *    Example - https://my-app.com/catch-redirection
 *    Format - uri*/
export interface UserEmailChangeRequestOptions {
  redirectTo?: string;
}

/**
 *
 * @property email A valid email
 *    Example - john.smith@nhost.io
 *    Format - email
 * @property options */
export interface UserEmailSendVerificationEmailRequest {
  email: string;
  options?: OptionsRedirectTo;
}

/**
 *
 * @property redirectTo
 *    Example - https://my-app.com/catch-redirection
 *    Format - uri*/
export interface UserEmailSendVerificationEmailRequestOptions {
  redirectTo?: string;
}

/**
 *
 * @property email A valid email
 *    Example - john.smith@nhost.io
 *    Format - email
 * @property options */
export interface UserPasswordResetRequest {
  email: string;
  options?: OptionsRedirectTo;
}

/**
 *
 * @property redirectTo
 *    Example - https://my-app.com/catch-redirection
 *    Format - uri*/
export interface UserPasswordResetRequestOptions {
  redirectTo?: string;
}

/**
 *
 * @property newPassword A password of minimum 3 characters
 *    Example - Str0ngPassw#ord-94|%
 *    MinLength - 3
 *    MaxLength - 50
 * @property ticket Ticket to reset the password, required if the user is not authenticated
 *    Pattern - ^passwordReset\:.*$*/
export interface UserPasswordRequest {
  newPassword: string;
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
 * @property redirectTo
 *    Example - https://my-app.com/catch-redirection
 *    Format - uri*/
export interface OptionsRedirectTo {
  redirectTo?: string;
}

/**
 *
 * @property displayName
 *    Example - John Smith
 * @property locale A two-characters locale
 *    Example - en
 *    MinLength - 2
 *    MaxLength - 2
 * @property metadata */
export interface SignInAnonymousRequest {
  displayName?: string;
  locale?: string;
  metadata?: Record<string, any>;
}

/**
 * Request to authenticate using email and password
 * @property email User's email address
 *    Example - john.smith@nhost.io
 *    Format - email
 * @property password User's password
 *    Example - Str0ngPassw#ord-94|%
 *    MinLength - 3
 *    MaxLength - 50*/
export interface SignInEmailPasswordRequest {
  email: string;
  password: string;
}

/**
 *
 * @property email A valid email
 *    Example - john.smith@nhost.io
 *    Format - email
 * @property options */
export interface SignInPasswordlessEmailRequest {
  email: string;
  options?: SignUpOptions;
}

/**
 *
 * @property allowedRoles
 * @property defaultRole
 *    Example - user
 * @property displayName
 *    Example - John Smith
 *    Pattern - ^[\p{L}\p{N}\p{S} ,.'-]+$
 *    MaxLength - 32
 * @property locale A two-characters locale
 *    Example - en
 *    MinLength - 2
 *    MaxLength - 2
 * @property metadata
 * @property redirectTo
 *    Example - https://my-app.com/catch-redirection
 *    Format - uri*/
export interface SignInPasswordlessEmailRequestOptions {
  allowedRoles?: string[];
  defaultRole?: string;
  displayName?: string;
  locale?: string;
  metadata?: Record<string, any>;
  redirectTo?: string;
}

/**
 *
 * @property email A valid email
 *    Example - john.smith@nhost.io
 *    Format - email
 * @property options */
export interface SignInOTPEmailRequest {
  email: string;
  options?: SignUpOptions;
}

/**
 *
 * @property allowedRoles
 * @property defaultRole
 *    Example - user
 * @property displayName
 *    Example - John Smith
 *    Pattern - ^[\p{L}\p{N}\p{S} ,.'-]+$
 *    MaxLength - 32
 * @property locale A two-characters locale
 *    Example - en
 *    MinLength - 2
 *    MaxLength - 2
 * @property metadata
 * @property redirectTo
 *    Example - https://my-app.com/catch-redirection
 *    Format - uri*/
export interface SignInOTPEmailRequestOptions {
  allowedRoles?: string[];
  defaultRole?: string;
  displayName?: string;
  locale?: string;
  metadata?: Record<string, any>;
  redirectTo?: string;
}

/**
 *
 * @property otp One time password
 * @property email A valid email
 *    Example - john.smith@nhost.io
 *    Format - email*/
export interface SignInOTPEmailVerifyRequest {
  otp: string;
  email: string;
}

/**
 *
 * @property session User authentication session containing tokens and user information*/
export interface SignInOTPEmailVerifyResponse {
  session?: Session;
}

/**
 * User authentication session containing tokens and user information
 * @property accessToken JWT token for authenticating API requests
 *    Example - eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 * @property accessTokenExpiresIn Expiration time of the access token in seconds
 *    Example - 900
 *    Format - int64
 * @property refreshTokenId Identifier for the refresh token
 *    Example - 2c35b6f3-c4b9-48e3-978a-d4d0f1d42e24
 *    Pattern - \b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b
 * @property refreshToken Token used to refresh the access token
 *    Example - 2c35b6f3-c4b9-48e3-978a-d4d0f1d42e24
 *    Pattern - \b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b
 * @property user User profile and account information*/
export interface SignInOTPEmailVerifyResponseSession {
  accessToken: string;
  accessTokenExpiresIn: number;
  refreshTokenId: string;
  refreshToken: string;
  user?: User;
}

/**
 * User profile and account information
 * @property avatarUrl URL to the user's profile picture
 *    Example - https://myapp.com/avatars/user123.jpg
 * @property createdAt Timestamp when the user account was created
 *    Example - 2023-01-15T12:34:56Z
 *    Format - date-time
 * @property defaultRole Default authorization role for the user
 *    Example - user
 * @property displayName User's display name
 *    Example - John Smith
 * @property email User's email address
 *    Example - john.smith@nhost.io
 *    Format - email
 * @property emailVerified Whether the user's email has been verified
 *    Example - true
 * @property id Unique identifier for the user
 *    Example - 2c35b6f3-c4b9-48e3-978a-d4d0f1d42e24
 *    Pattern - \b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b
 * @property isAnonymous Whether this is an anonymous user account
 *    Example - false
 * @property locale User's preferred locale (language code)
 *    Example - en
 *    MinLength - 2
 *    MaxLength - 2
 * @property metadata Custom metadata associated with the user
 * @property phoneNumber User's phone number
 *    Example - +12025550123
 * @property phoneNumberVerified Whether the user's phone number has been verified
 *    Example - false
 * @property roles List of roles assigned to the user*/
export interface SignInOTPEmailVerifyResponseSessionUser {
  avatarUrl: string;
  createdAt: string;
  defaultRole: string;
  displayName: string;
  email?: string;
  emailVerified: boolean;
  id: string;
  isAnonymous: boolean;
  locale: string;
  metadata: Record<string, any>;
  phoneNumber?: string;
  phoneNumberVerified: boolean;
  roles: string[];
}

/**
 * Request to register a new user with email and password
 * @property email Email address for the new user account
 *    Example - john.smith@nhost.io
 *    Format - email
 * @property password Password for the new user account
 *    Example - Str0ngPassw#ord-94|%
 *    MinLength - 3
 *    MaxLength - 50
 * @property options */
export interface SignUpEmailPasswordRequest {
  email: string;
  password: string;
  options?: SignUpOptions;
}

/**
 *
 * @property allowedRoles
 * @property defaultRole
 *    Example - user
 * @property displayName
 *    Example - John Smith
 *    Pattern - ^[\p{L}\p{N}\p{S} ,.'-]+$
 *    MaxLength - 32
 * @property locale A two-characters locale
 *    Example - en
 *    MinLength - 2
 *    MaxLength - 2
 * @property metadata
 * @property redirectTo
 *    Example - https://my-app.com/catch-redirection
 *    Format - uri*/
export interface SignUpEmailPasswordRequestOptions {
  allowedRoles?: string[];
  defaultRole?: string;
  displayName?: string;
  locale?: string;
  metadata?: Record<string, any>;
  redirectTo?: string;
}

/**
 *
 * @property allowedRoles
 * @property defaultRole
 *    Example - user
 * @property displayName
 *    Example - John Smith
 *    Pattern - ^[\p{L}\p{N}\p{S} ,.'-]+$
 *    MaxLength - 32
 * @property locale A two-characters locale
 *    Example - en
 *    MinLength - 2
 *    MaxLength - 2
 * @property metadata
 * @property redirectTo
 *    Example - https://my-app.com/catch-redirection
 *    Format - uri*/
export interface SignUpOptions {
  allowedRoles?: string[];
  defaultRole?: string;
  displayName?: string;
  locale?: string;
  metadata?: Record<string, any>;
  redirectTo?: string;
}

/**
 *
 * @property email A valid email
 *    Example - john.smith@nhost.io
 *    Format - email*/
export interface SignInWebauthnRequest {
  email?: string;
}

/**
 *
 * @property email A valid email
 *    Example - john.smith@nhost.io
 *    Format - email
 * @property options */
export interface SignUpWebauthnRequest {
  email: string;
  options?: SignUpOptions;
}

/**
 *
 * @property allowedRoles
 * @property defaultRole
 *    Example - user
 * @property displayName
 *    Example - John Smith
 *    Pattern - ^[\p{L}\p{N}\p{S} ,.'-]+$
 *    MaxLength - 32
 * @property locale A two-characters locale
 *    Example - en
 *    MinLength - 2
 *    MaxLength - 2
 * @property metadata
 * @property redirectTo
 *    Example - https://my-app.com/catch-redirection
 *    Format - uri*/
export interface SignUpWebauthnRequestOptions {
  allowedRoles?: string[];
  defaultRole?: string;
  displayName?: string;
  locale?: string;
  metadata?: Record<string, any>;
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
 * @property email A valid email. Deprecated, no longer used
 *    Example - john.smith@nhost.io
 *    Format - email
 * @property credential */
export interface SignInWebauthnVerifyRequest {
  email?: string;
  credential: Record<string, any>;
}

/**
 *
 * @property credential
 * @property options */
export interface SignUpWebauthnVerifyRequest {
  credential?: Record<string, any>;
  options?: SignUpWebauthnVerifyRequestOptions;
}

/**
 *
 * @property nickname */
export interface SignUpWebauthnVerifyRequestOptionsAllOf1 {
  nickname?: string;
}

export type SignUpWebauthnVerifyRequestOptions = SignUpOptions &
  SignUpWebauthnVerifyRequestOptionsAllOf1 & {};

/**
 *
 * @property provider
 * @property idToken Apple ID token
 * @property nonce Nonce used during sign in process
 * @property options */
export interface SignInIdTokenRequest {
  provider: string;
  idToken: string;
  nonce?: string;
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
 * @property allowedRoles
 * @property defaultRole
 *    Example - user
 * @property displayName
 *    Example - John Smith
 *    Pattern - ^[\p{L}\p{N}\p{S} ,.'-]+$
 *    MaxLength - 32
 * @property locale A two-characters locale
 *    Example - en
 *    MinLength - 2
 *    MaxLength - 2
 * @property metadata
 * @property redirectTo
 *    Example - https://my-app.com/catch-redirection
 *    Format - uri*/
export interface SignInIdTokenRequestOptions {
  allowedRoles?: string[];
  defaultRole?: string;
  displayName?: string;
  locale?: string;
  metadata?: Record<string, any>;
  redirectTo?: string;
}

/**
 *
 * @property ticket Ticket
 *    Pattern - ^mfaTotp:.*$
 * @property otp One time password*/
export interface SignInMfaTotpRequest {
  ticket: string;
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
 * @property provider
 * @property idToken Apple ID token
 * @property nonce Nonce used during sign in process*/
export interface LinkIdTokenRequest {
  provider: string;
  idToken: string;
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
 * @property code Verification code from the authenticator app when activating MFA
 *    Example - 123456
 * @property activeMfaType Type of MFA to activate. Use empty string to disable MFA.
 *    Example - totp*/
export interface UserMfaRequest {
  code: string;
  activeMfaType?: string;
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
 * @property imageUrl URL to QR code image for scanning with an authenticator app
 *    Example - data:image/png;base64,iVBORw0KGg...
 * @property totpSecret TOTP secret key for manual setup with an authenticator app
 *    Example - ABCDEFGHIJK23456*/
export interface TotpGenerateResponse {
  imageUrl: string;
  totpSecret: string;
}

/**
 *
 * @property version The version of the authentication service
 *    Example - 1.2.3*/
export interface GetVersion200 {
  version: string;
}

export interface VerifyTicketParams {
  ticket: string;
  type?: string;
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
   * Health check (HEAD)
   *
   * Verify if the authentication service is operational using HEAD method
   */
  const healthCheckHead = async (
    options?: RequestInit,
  ): Promise<FetchResponse<void>> => {
    const res = await fetch(baseURL + `/healthz`, {
      ...options,
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
   * Health check (GET)
   *
   * Verify if the authentication service is operational using GET method
   */
  const healthCheckGet = async (
    options?: RequestInit,
  ): Promise<FetchResponse<OKResponse>> => {
    const res = await fetch(baseURL + `/healthz`, {
      ...options,
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
   * Get service version
   *
   * Retrieve version information about the authentication service
   */
  const getVersion = async (
    options?: RequestInit,
  ): Promise<FetchResponse<GetVersion200>> => {
    const res = await fetch(baseURL + `/version`, {
      ...options,
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
    refreshTokenRequest: RefreshTokenRequest,

    options?: RequestInit,
  ): Promise<FetchResponse<Session>> => {
    const res = await fetch(baseURL + `/token`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...options?.headers },
      body: JSON.stringify(refreshTokenRequest),
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
    signOutRequest: SignOutSchema,

    options?: RequestInit,
  ): Promise<FetchResponse<OKResponse>> => {
    const res = await fetch(baseURL + `/signout`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...options?.headers },
      body: JSON.stringify(signOutRequest),
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
    signInEmailPasswordRequest: SignInEmailPasswordRequest,

    options?: RequestInit,
  ): Promise<FetchResponse<SignInEmailPasswordResponse>> => {
    const res = await fetch(baseURL + `/signin/email-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...options?.headers },
      body: JSON.stringify(signInEmailPasswordRequest),
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
    signInVerifyMfaTotpRequest: SignInMfaTotpRequest,

    options?: RequestInit,
  ): Promise<FetchResponse<SessionPayload>> => {
    const res = await fetch(baseURL + `/signin/mfa/totp`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...options?.headers },
      body: JSON.stringify(signInVerifyMfaTotpRequest),
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
    signInPasswordlessEmailRequest: SignInPasswordlessEmailRequest,

    options?: RequestInit,
  ): Promise<FetchResponse<OKResponse>> => {
    const res = await fetch(baseURL + `/signin/passwordless/email`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...options?.headers },
      body: JSON.stringify(signInPasswordlessEmailRequest),
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
    signUpEmailPasswordRequest: SignUpEmailPasswordRequest,

    options?: RequestInit,
  ): Promise<FetchResponse<SessionPayload>> => {
    const res = await fetch(baseURL + `/signup/email-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...options?.headers },
      body: JSON.stringify(signUpEmailPasswordRequest),
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
    changeUserMfaVerifyRequest: UserMfaRequest,

    options?: RequestInit,
  ): Promise<FetchResponse<OKResponse>> => {
    const res = await fetch(baseURL + `/user/mfa`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...options?.headers },
      body: JSON.stringify(changeUserMfaVerifyRequest),
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
    const res = await fetch(baseURL + `/mfa/totp/generate`, {
      ...options,
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
    const res = await fetch(baseURL + `/.well-known/jwks.json`, {
      ...options,
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
    createPATRequest: CreatePATRequest,

    options?: RequestInit,
  ): Promise<FetchResponse<CreatePATResponse>> => {
    const res = await fetch(baseURL + `/pat`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...options?.headers },
      body: JSON.stringify(createPATRequest),
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
    signInAnonymousRequest?: SignInAnonymousRequest,

    options?: RequestInit,
  ): Promise<FetchResponse<SessionPayload>> => {
    const res = await fetch(baseURL + `/signin/anonymous`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...options?.headers },
      body: JSON.stringify(signInAnonymousRequest),
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
    signInOTPEmailRequest: SignInOTPEmailRequest,

    options?: RequestInit,
  ): Promise<FetchResponse<OKResponse>> => {
    const res = await fetch(baseURL + `/signin/otp/email`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...options?.headers },
      body: JSON.stringify(signInOTPEmailRequest),
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
    verifySignInOTPEmailRequest: SignInOTPEmailVerifyRequest,

    options?: RequestInit,
  ): Promise<FetchResponse<SignInOTPEmailVerifyResponse>> => {
    const res = await fetch(baseURL + `/signin/otp/email/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...options?.headers },
      body: JSON.stringify(verifySignInOTPEmailRequest),
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
    signInPATRequest: SignInPATRequest,

    options?: RequestInit,
  ): Promise<FetchResponse<SessionPayload>> => {
    const res = await fetch(baseURL + `/signin/pat`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...options?.headers },
      body: JSON.stringify(signInPATRequest),
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
    signInIdTokenRequest: SignInIdTokenRequest,

    options?: RequestInit,
  ): Promise<FetchResponse<SessionPayload>> => {
    const res = await fetch(baseURL + `/signin/idtoken`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...options?.headers },
      body: JSON.stringify(signInIdTokenRequest),
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
    linkIdTokenRequest: LinkIdTokenRequest,

    options?: RequestInit,
  ): Promise<FetchResponse<OKResponse>> => {
    const res = await fetch(baseURL + `/link/idtoken`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...options?.headers },
      body: JSON.stringify(linkIdTokenRequest),
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
    deanonymizeUserRequest: UserDeanonymizeRequest,

    options?: RequestInit,
  ): Promise<FetchResponse<OKResponse>> => {
    const res = await fetch(baseURL + `/user/deanonymize`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...options?.headers },
      body: JSON.stringify(deanonymizeUserRequest),
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
    changeUserEmailRequest: UserEmailChangeRequest,

    options?: RequestInit,
  ): Promise<FetchResponse<OKResponse>> => {
    const res = await fetch(baseURL + `/user/email/change`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...options?.headers },
      body: JSON.stringify(changeUserEmailRequest),
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
    sendVerificationEmailRequest: UserEmailSendVerificationEmailRequest,

    options?: RequestInit,
  ): Promise<FetchResponse<OKResponse>> => {
    const res = await fetch(baseURL + `/user/email/send-verification-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...options?.headers },
      body: JSON.stringify(sendVerificationEmailRequest),
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
    changeUserPasswordRequest: UserPasswordRequest,

    options?: RequestInit,
  ): Promise<FetchResponse<OKResponse>> => {
    const res = await fetch(baseURL + `/user/password`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...options?.headers },
      body: JSON.stringify(changeUserPasswordRequest),
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
    sendPasswordResetEmailRequest: UserPasswordResetRequest,

    options?: RequestInit,
  ): Promise<FetchResponse<OKResponse>> => {
    const res = await fetch(baseURL + `/user/password/reset`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...options?.headers },
      body: JSON.stringify(sendPasswordResetEmailRequest),
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
    verifyTicket,
    signInProvider,
    baseURL,
    pushChainFunction,
  };
};
