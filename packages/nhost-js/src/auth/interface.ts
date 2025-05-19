import type {
  CreatePATRequest,
  CreatePATResponse,
  ErrorResponse,
  FetchResponse,
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
  SigninAnonymousRequest,
  TotpGenerateResponse,
  UserDeanonymizeRequest,
  UserEmailChangeRequest,
  UserEmailSendVerificationEmailRequest,
  UserMfaRequest,
  UserPasswordResetRequest,
  UserPasswordRequest,
  VerifyTicketParams,
} from "./client";

import type { ChainFunction } from "../fetch";

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
  healthCheckHead: (
    options?: RequestInit,
  ) => Promise<FetchResponse<void, unknown>>;

  /**
   * Verify if the authentication service is operational using GET method
   * @summary Health check (GET)
   */
  healthCheckGet: (
    options?: RequestInit,
  ) => Promise<FetchResponse<OKResponse, unknown>>;

  /**
   * Retrieve version information about the authentication service
   * @summary Get service version
   */
  getVersion: (
    options?: RequestInit,
  ) => Promise<FetchResponse<GetVersion200, unknown>>;

  /**
   * Generate a new JWT access token using a valid refresh token. The refresh token used will be revoked and a new one will be issued.
   * @summary Refresh access token
   */
  refreshToken: (
    refreshTokenRequest: RefreshTokenRequest,
    options?: RequestInit,
  ) => Promise<FetchResponse<Session, ErrorResponse>>;

  /**
   * @summary Sign out
   */
  signOut: (
    signOutSchema: SignOutSchema,
    options?: RequestInit,
  ) => Promise<FetchResponse<OKResponse, ErrorResponse>>;

  /**
   * Authenticate a user with their email and password. Returns a session object or MFA challenge if two-factor authentication is enabled.
   * @summary Sign in with email and password
   */
  signInEmailPassword: (
    signInEmailPasswordRequest: SignInEmailPasswordRequest,
    options?: RequestInit,
  ) => Promise<FetchResponse<SignInEmailPasswordResponse, ErrorResponse>>;

  /**
   * Complete the multi-factor authentication by verifying a Time-based One-Time Password (TOTP). Returns a session if validation is successful.
   * @summary Verify TOTP for MFA
   */
  signInVerifyMfaTotp: (
    signInMfaTotpRequest: SignInMfaTotpRequest,
    options?: RequestInit,
  ) => Promise<FetchResponse<SessionPayload, ErrorResponse>>;

  /**
   * Initiate passwordless authentication by sending a magic link to the user's email. If the user doesn't exist, a new account will be created with the provided options.
   * @summary Sign in with magic link email
   */
  signInPasswordlessEmail: (
    signInPasswordlessEmailRequest: SignInPasswordlessEmailRequest,
    options?: RequestInit,
  ) => Promise<FetchResponse<OKResponse, ErrorResponse>>;

  /**
   * Register a new user account with email and password. Returns a session if email verification is not required, otherwise returns null session.
   * @summary Sign up with email and password
   */
  signUpEmailPassword: (
    signUpEmailPasswordRequest: SignUpEmailPasswordRequest,
    options?: RequestInit,
  ) => Promise<FetchResponse<SessionPayload, ErrorResponse>>;

  /**
   * Activate or deactivate multi-factor authentication for the authenticated user
   * @summary Manage multi-factor authentication
   */
  changeUserMfaVerify: (
    userMfaRequest: UserMfaRequest,
    options?: RequestInit,
  ) => Promise<FetchResponse<OKResponse, ErrorResponse>>;

  /**
   * Generate a Time-based One-Time Password (TOTP) secret for setting up multi-factor authentication
   * @summary Generate TOTP secret
   */
  changeUserMfa: (
    options?: RequestInit,
  ) => Promise<FetchResponse<TotpGenerateResponse, ErrorResponse>>;

  /**
   * @summary Get public keys for JWT verification in JWK Set format
   */
  getJWKs: (options?: RequestInit) => Promise<FetchResponse<JWKSet, unknown>>;

  /**
   * @summary Create a Personal Access Token (PAT)
   */
  createPAT: (
    createPATRequest: CreatePATRequest,
    options?: RequestInit,
  ) => Promise<FetchResponse<CreatePATResponse, ErrorResponse>>;

  /**
   * @summary Sign in anonymously
   */
  signInAnonymous: (
    signinAnonymousRequest?: SigninAnonymousRequest,
    options?: RequestInit,
  ) => Promise<FetchResponse<SessionPayload, ErrorResponse>>;

  /**
   * @summary Sign in with a one time password sent to user's email. If the user doesn't exist, it will be created. The options object is optional and can be used to configure the user's when signing up a new user. It is ignored if the user already exists.
   */
  signInOTPEmail: (
    signInOTPEmailRequest: SignInOTPEmailRequest,
    options?: RequestInit,
  ) => Promise<FetchResponse<OKResponse, ErrorResponse>>;

  /**
   * @summary Verify OTP and return a session if validation is successful
   */
  verifySignInOTPEmail: (
    signInOTPEmailVerifyRequest: SignInOTPEmailVerifyRequest,
    options?: RequestInit,
  ) => Promise<FetchResponse<SignInOTPEmailVerifyResponse, ErrorResponse>>;

  /**
   * @summary Sign in with Personal Access Token (PAT)
   */
  signInPAT: (
    signInPATRequest: SignInPATRequest,
    options?: RequestInit,
  ) => Promise<FetchResponse<SessionPayload, ErrorResponse>>;

  /**
   * @summary Sign in with an id token
   */
  signInIdToken: (
    signInIdTokenRequest: SignInIdTokenRequest,
    options?: RequestInit,
  ) => Promise<FetchResponse<SessionPayload, ErrorResponse>>;

  /**
   * @summary Link a user account with the provider's account using an id token
   */
  linkIdToken: (
    linkIdTokenRequest: LinkIdTokenRequest,
    options?: RequestInit,
  ) => Promise<FetchResponse<OKResponse, ErrorResponse>>;

  /**
   * @summary Deanonymize an anonymous user by adding missing email or email+password, depending on the chosen authentication method. Will send a confirmation email if the server is configured to do so
   */
  deanonymizeUser: (
    userDeanonymizeRequest: UserDeanonymizeRequest,
    options?: RequestInit,
  ) => Promise<FetchResponse<OKResponse, ErrorResponse>>;

  /**
   * @summary Change user email
   */
  changeUserEmail: (
    userEmailChangeRequest: UserEmailChangeRequest,
    options?: RequestInit,
  ) => Promise<FetchResponse<OKResponse, ErrorResponse>>;

  /**
   * @summary Send verification email
   */
  sendVerificationEmail: (
    userEmailSendVerificationEmailRequest: UserEmailSendVerificationEmailRequest,
    options?: RequestInit,
  ) => Promise<FetchResponse<OKResponse, ErrorResponse>>;

  /**
   * @summary Change user password. The user must be authenticated or provide a ticket
   */
  changeUserPassword: (
    userPasswordRequest: UserPasswordRequest,
    options?: RequestInit,
  ) => Promise<FetchResponse<OKResponse, ErrorResponse>>;

  /**
   * @summary Request a password reset. An email with a verification link will be sent to the user's address
   */
  sendPasswordResetEmail: (
    userPasswordResetRequest: UserPasswordResetRequest,
    options?: RequestInit,
  ) => Promise<FetchResponse<OKResponse, ErrorResponse>>;

  /**
   * @summary Verify tickets created by email verification, email passwordless authentication (magic link), or password reset
   */
  verifyTicket: (
    params: VerifyTicketParams,
    options?: RequestInit,
  ) => Promise<FetchResponse<void, unknown>>;
}
