/**
 * Authentication module for the Nhost JavaScript SDK
 *
 * This module provides comprehensive authentication functionality:
 * - Email/password authentication
 * - Passwordless authentication (email, SMS)
 * - Social login (OAuth providers)
 * - Multi-factor authentication
 * - Session management and persistence
 *
 * @module auth
 * @packageDocumentation
 */

export * from "./client";
export * from "./interface";
export * from "./storage";
export * from "./middlewareRefreshSession";
export * from "./middlewareResponseSession";
