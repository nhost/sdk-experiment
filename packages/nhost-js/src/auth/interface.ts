import type {
    FetchResponse,
    OKResponse,
    GetVersion200,
    SignInEmailPasswordRequest,
    SignInEmailPasswordResponse,
    SignInMfaTotpRequest,
    SignInPasswordlessEmailRequest,
    RefreshTokenRequest,
    Session,
    SessionPayload,
    SignOutSchema,
    SignUpEmailPasswordRequest,
    TotpGenerateResponse,
    UserMfaRequest,
} from "./client";

import type { ChainFunction } from "../fetch";

/**
 * Authentication client interface providing methods for user sign-in, sign-up, and session management
 */
export interface AuthClient {
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
    options?: RequestInit
  ) => Promise<FetchResponse<Session>>;

  /**
   * Sign out the current user
   * @summary Sign out
   */
  signOut: (
    signOutSchema: SignOutSchema,
    options?: RequestInit
  ) => Promise<FetchResponse<OKResponse>>;

  /**
   * Authenticate a user with their email and password
   * @summary Sign in with email and password
   */
  signInEmailPassword: (
    signInEmailPasswordRequest: SignInEmailPasswordRequest,
    options?: RequestInit
  ) => Promise<FetchResponse<SignInEmailPasswordResponse>>;

  /**
   * Complete the multi-factor authentication by verifying a Time-based One-Time Password (TOTP)
   * @summary Verify TOTP for MFA
   */
  signInVerifyMfaTotp: (
    signInMfaTotpRequest: SignInMfaTotpRequest,
    options?: RequestInit
  ) => Promise<FetchResponse<SessionPayload>>;

  /**
   * Initiate passwordless authentication by sending a magic link to the user's email
   * @summary Sign in with magic link email
   */
  signInPasswordlessEmail: (
    signInPasswordlessEmailRequest: SignInPasswordlessEmailRequest,
    options?: RequestInit
  ) => Promise<FetchResponse<OKResponse>>;

  /**
   * Register a new user account with email and password
   * @summary Sign up with email and password
   */
  signUpEmailPassword: (
    signUpEmailPasswordRequest: SignUpEmailPasswordRequest,
    options?: RequestInit
  ) => Promise<FetchResponse<SessionPayload>>;

  /**
   * Activate or deactivate multi-factor authentication for the authenticated user
   * @summary Manage multi-factor authentication
   */
  changeUserMfaVerify: (
    userMfaRequest: UserMfaRequest,
    options?: RequestInit
  ) => Promise<FetchResponse<OKResponse>>;

  /**
   * Generate a Time-based One-Time Password (TOTP) secret for setting up multi-factor authentication
   * @summary Generate TOTP secret
   */
  changeUserMfa: (options?: RequestInit) => Promise<FetchResponse<TotpGenerateResponse>>;
}
