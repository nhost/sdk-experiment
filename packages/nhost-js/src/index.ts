/**
 * Main entry point for the Nhost JavaScript SDK.
 *
 * This package provides a unified client for interacting with Nhost services:
 * - Authentication
 * - Storage
 * - GraphQL
 * - Functions
 *
 * @example
 * You can import and use this package with:
 *
 * ```ts
 * import { createClient } from "@nhost/nhost-js";
 * ```
 *
 * and use it like:
 *
 * {@includeCode ./__tests__/docstrings.test.ts#mainExample}
 *
 * ## Error handling
 *
 * The SDK will throw errors on most operations if the request returns a non-2xx status code or
 * if the request fails entirely (i.e., due to network errors). A continuation you can see
 * how you can handle errors thrown by the SDK.
 *
 * ### Auth
 *
 * {@includeCode ./__tests__/docstrings-auth.test.ts#errorHandling}
 *
 * ### Storage
 *
 * {@includeCode ./__tests__/docstrings-storage.test.ts#errorHandling}
 *
 * ### GraphQL
 *
 * {@includeCode ./__tests__/docstrings-graphql.test.ts#errorHandling}
 *
 * ### Functions
 *
 * {@includeCode ./__tests__/docstrings-functions.test.ts#errorHandling}
 *
 * @packageDocumentation
 */

export { SessionStorage } from "./sessionStorage";
export {
  type SessionStorageBackend,
  DEFAULT_SESSION_KEY,
  LocalStorage,
  MemoryStorage,
  CookieStorage,
} from "./sessionStorageBackend";

export {
  type NhostClient,
  type NhostClientOptions,
  createClient,
  type NhostServerClientOptions,
  createServerClient,
} from "./nhost";

/**
 * Generates a base URL for a Nhost service based on configuration
 *
 * @param serviceType - Type of service (auth, storage, graphql, functions)
 * @param subdomain - Nhost project subdomain
 * @param region - Nhost region
 * @param customUrl - Custom URL override if provided
 * @returns The base URL for the service
 *
 * @internal
 */
export const generateServiceUrl = (
  serviceType: "auth" | "storage" | "graphql" | "functions",
  subdomain?: string,
  region?: string,
  customUrl?: string,
): string => {
  if (customUrl) {
    return customUrl;
  } else if (subdomain && region) {
    return `https://${subdomain}.${serviceType}.${region}.nhost.run/v1`;
  } else if (subdomain) {
    return `https://${subdomain}.${serviceType}.nhost.run/v1`;
  } else {
    return `https://local.${serviceType}.local.nhost.run/v1`;
  }
};
