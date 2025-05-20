import type {
  CreatePATRequest,
  CreatePATResponse,
  GetVersion200,
  JWKSet,
  LinkIdTokenRequest,
  OKResponse,
  RefreshTokenRequest,
  Session,
  SessionPayload,
  SignInEmailPasswordRequest,
  SignInEmailPasswordResponse,
  SignInIdTokenRequest,
  SignInMfaTotpRequest,
  SignInOTPEmailRequest,
  SignInOTPEmailVerifyRequest,
  SignInOTPEmailVerifyResponse,
  SignInPATRequest,
  SignInPasswordlessEmailRequest,
  SignOutSchema,
  SignUpEmailPasswordRequest,
  SignInAnonymousRequest,
  SignInProviderParams,
  TotpGenerateResponse,
  UserDeanonymizeRequest,
  UserEmailChangeRequest,
  UserEmailSendVerificationEmailRequest,
  UserMfaRequest,
  UserPasswordResetRequest,
  UserPasswordRequest,
  VerifyTicketParams,
} from "./client";

import type { ChainFunction, FetchResponse } from "../fetch";

/**
 * Authentication client interface providing methods for user sign-in, sign-up, and session management
 */
export interface Client {
  /**
   * Base URL for the authentication service
   */
  baseURL: string;

  /**
   * Add a middleware function to the request chain
   * @param chainFunction - Middleware function to add
   */
  pushChainFunction: (chainFunction: ChainFunction) => void;

  /**
   * Verify if the authentication service is operational using HEAD method
   * @summary Health check (HEAD)
   */
  healthCheckHead: (options?: RequestInit) => Promise<FetchResponse<void>>;

  /**
   * Verify if the authentication service is operational using GET method
   * @summary Health check (GET)
   */
  healthCheckGet: (options?: RequestInit) => Promise<FetchResponse<OKResponse>>;

  /**
   * Retrieve version information about the authentication service
   * @summary Get service version
   */
  getVersion: (options?: RequestInit) => Promise<FetchResponse<GetVersion200>>;

  /**
   * Generate a new JWT access token using a valid refresh token
   * @summary Refresh access token
   */
  refreshToken: (
    refreshTokenRequest: RefreshTokenRequest,
    options?: RequestInit,
  ) => Promise<FetchResponse<Session>>;

  /**
   * Sign out the current user
   * @summary Sign out
   */
  signOut: (
    signOutSchema: SignOutSchema,
    options?: RequestInit,
  ) => Promise<FetchResponse<OKResponse>>;

  /**
   * Authenticate a user with their email and password
   * @summary Sign in with email and password
   */
  signInEmailPassword: (
    signInEmailPasswordRequest: SignInEmailPasswordRequest,
    options?: RequestInit,
  ) => Promise<FetchResponse<SignInEmailPasswordResponse>>;

  /**
   * Complete the multi-factor authentication by verifying a Time-based One-Time Password (TOTP)
   * @summary Verify TOTP for MFA
   */
  signInVerifyMfaTotp: (
    signInMfaTotpRequest: SignInMfaTotpRequest,
    options?: RequestInit,
  ) => Promise<FetchResponse<SessionPayload>>;

  /**
   * Initiate passwordless authentication by sending a magic link to the user's email
   * @summary Sign in with magic link email
   */
  signInPasswordlessEmail: (
    signInPasswordlessEmailRequest: SignInPasswordlessEmailRequest,
    options?: RequestInit,
  ) => Promise<FetchResponse<OKResponse>>;

  /**
   * Register a new user account with email and password
   * @summary Sign up with email and password
   */
  signUpEmailPassword: (
    signUpEmailPasswordRequest: SignUpEmailPasswordRequest,
    options?: RequestInit,
  ) => Promise<FetchResponse<SessionPayload>>;

  /**
   * Activate or deactivate multi-factor authentication for the authenticated user
   * @summary Manage multi-factor authentication
   */
  changeUserMfaVerify: (
    userMfaRequest: UserMfaRequest,
    options?: RequestInit,
  ) => Promise<FetchResponse<OKResponse>>;

  /**
   * Generate a Time-based One-Time Password (TOTP) secret for setting up multi-factor authentication
   * @summary Generate TOTP secret
   */
  changeUserMfa: (
    options?: RequestInit,
  ) => Promise<FetchResponse<TotpGenerateResponse>>;

  /**
   * Get public keys for JWT verification in JWK Set format
   * @summary Get JWKs
   */
  getJWKs: (options?: RequestInit) => Promise<FetchResponse<JWKSet>>;

  /**
   * Create a Personal Access Token (PAT)
   * @summary Create PAT
   */
  createPAT: (
    createPATRequest: CreatePATRequest,
    options?: RequestInit,
  ) => Promise<FetchResponse<CreatePATResponse>>;

  /**
   * Sign in anonymously
   * @summary Anonymous sign-in
   */
  signInAnonymous: (
    signinAnonymousRequest?: SignInAnonymousRequest,
    options?: RequestInit,
  ) => Promise<FetchResponse<SessionPayload>>;

  /**
   * Sign in with a one time password sent to user's email
   * @summary OTP email sign-in
   */
  signInOTPEmail: (
    signInOTPEmailRequest: SignInOTPEmailRequest,
    options?: RequestInit,
  ) => Promise<FetchResponse<OKResponse>>;

  /**
   * Verify OTP and return a session if validation is successful
   * @summary Verify OTP email
   */
  verifySignInOTPEmail: (
    signInOTPEmailVerifyRequest: SignInOTPEmailVerifyRequest,
    options?: RequestInit,
  ) => Promise<FetchResponse<SignInOTPEmailVerifyResponse>>;

  /**
   * Sign in with Personal Access Token (PAT)
   * @summary PAT sign-in
   */
  signInPAT: (
    signInPATRequest: SignInPATRequest,
    options?: RequestInit,
  ) => Promise<FetchResponse<SessionPayload>>;

  /**
   * Sign in with an id token
   * @summary Id token sign-in
   */
  signInIdToken: (
    signInIdTokenRequest: SignInIdTokenRequest,
    options?: RequestInit,
  ) => Promise<FetchResponse<SessionPayload>>;

  /**
   * Link a user account with the provider's account using an id token
   * @summary Link account with id token
   */
  linkIdToken: (
    linkIdTokenRequest: LinkIdTokenRequest,
    options?: RequestInit,
  ) => Promise<FetchResponse<OKResponse>>;

  /**
   * Deanonymize an anonymous user by adding missing email or email+password
   * @summary Deanonymize user
   */
  deanonymizeUser: (
    userDeanonymizeRequest: UserDeanonymizeRequest,
    options?: RequestInit,
  ) => Promise<FetchResponse<OKResponse>>;

  /**
   * Change user email
   * @summary Update email
   */
  changeUserEmail: (
    userEmailChangeRequest: UserEmailChangeRequest,
    options?: RequestInit,
  ) => Promise<FetchResponse<OKResponse>>;

  /**
   * Send verification email
   * @summary Send verification email
   */
  sendVerificationEmail: (
    userEmailSendVerificationEmailRequest: UserEmailSendVerificationEmailRequest,
    options?: RequestInit,
  ) => Promise<FetchResponse<OKResponse>>;

  /**
   * Change user password
   * @summary Update password
   */
  changeUserPassword: (
    userPasswordRequest: UserPasswordRequest,
    options?: RequestInit,
  ) => Promise<FetchResponse<OKResponse>>;

  /**
   * Request a password reset
   * @summary Send password reset email
   */
  sendPasswordResetEmail: (
    userPasswordResetRequest: UserPasswordResetRequest,
    options?: RequestInit,
  ) => Promise<FetchResponse<OKResponse>>;

  /**
   * Verify tickets created by email verification, magic link, or password reset
   * @summary Verify ticket
   */
  verifyTicket: (
    params: VerifyTicketParams,
    options?: RequestInit,
  ) => Promise<FetchResponse<void>>;

  /**
   * @summary Sign in with an oauth2 provider
   */
  signInProvider: (
    provider:
      | "apple"
      | "github"
      | "google"
      | "linkedin"
      | "discord"
      | "spotify",
    params?: SignInProviderParams,
    options?: RequestInit,
  ) => Promise<FetchResponse<unknown>>;

  getSignInProviderUrl: (
    provider:
      | "apple"
      | "github"
      | "google"
      | "linkedin"
      | "discord"
      | "spotify",
    params?: SignInProviderParams,
  ) => string;
}
