/**
 * @fileoverview GraphQL client for the Nhost JavaScript SDK.
 *
 * This module provides functionality for executing GraphQL operations against
 * a Hasura GraphQL API, with automatic authentication token handling.
 */

import { createEnhancedFetch } from "../fetch";
import type { ChainFunction } from "../fetch";

/**
 * Variables object for GraphQL operations.
 * Key-value pairs of variable names and their values.
 */
export interface GraphQLVariables {
  [key: string]: any;
}

/**
 * GraphQL request object used for queries and mutations.
 */
export interface GraphQLRequest {
  /** The GraphQL query or mutation string */
  query: string;
  /** Optional variables for parameterized queries */
  variables?: GraphQLVariables;
  /** Optional name of the operation to execute */
  operationName?: string;
}

/**
 * Represents a GraphQL error returned from the server.
 */
export interface GraphQLError {
  /** Error message */
  message: string;
  /** Source locations in the GraphQL document where the error occurred */
  locations?: { line: number; column: number }[];
  /** Path in the query where the error occurred */
  path?: string[];
  /** Additional error information specific to the GraphQL implementation */
  extensions?: any;
}

/**
 * Standard GraphQL response format as defined by the GraphQL specification.
 */
export interface GraphQLResponse<T = any> {
  /** The data returned from successful execution */
  data?: T;
  /** Array of errors if execution was unsuccessful or partially successful */
  errors?: GraphQLError[];
}

/**
 * Response wrapper for GraphQL operations with additional metadata.
 */
export interface FetchResponse<T = any> {
  /** The parsed response body */
  data: T;
  /** HTTP status code of the response */
  status: number;
  /** HTTP headers from the response */
  headers: Headers;
}

/**
 * GraphQL client interface providing methods for executing queries and mutations
 */
export interface GraphQLClient {
  /**
   * Execute a GraphQL query operation
   *
   * Queries are used to fetch data and should not modify any data on the server.
   *
   * @param request - GraphQL request object containing query and optional variables
   * @param options - Additional fetch options to apply to the request
   * @returns Promise with the GraphQL response and metadata
   */
  query: (
    request: GraphQLRequest,
    options?: RequestInit,
  ) => Promise<FetchResponse<GraphQLResponse>>;

  /**
   * Execute a GraphQL mutation operation
   *
   * Mutations are used to modify data on the server.
   *
   * @param request - GraphQL request object containing mutation and optional variables
   * @param options - Additional fetch options to apply to the request
   * @returns Promise with the GraphQL response and metadata
   */
  mutation: (
    request: GraphQLRequest,
    options?: RequestInit,
  ) => Promise<FetchResponse<GraphQLResponse>>;
}

/**
 * Creates a GraphQL API client for interacting with a GraphQL endpoint.
 *
 * This client provides methods for executing queries and mutations against
 * a GraphQL API, with support for middleware functions to handle authentication,
 * error handling, and other cross-cutting concerns.
 *
 * @example
 * ```typescript
 * import { createClient } from 'nhost-js';
 *
 * const nhost = createClient({
 *   subdomain: 'your-project',
 *   region: 'eu-central-1'
 * });
 *
 * // Execute a GraphQL query
 * const response = await nhost.graphql.query({
 *   query: `
 *     query GetUsers {
 *       users {
 *         id
 *         displayName
 *         email
 *       }
 *     }
 *   `
 * });
 *
 * // Access the data
 * const users = response.data.data.users;
 * ```
 *
 * @param baseURL - Base URL for the GraphQL endpoint
 * @param chainFunctions - Array of middleware functions for the fetch chain
 * @returns GraphQL client with query and mutation methods
 */
export const createAPIClient = (
  baseURL: string,
  chainFunctions: ChainFunction[] = [],
) => {
  const enhancedFetch = createEnhancedFetch(chainFunctions);


  const executeOperation = async (
    request: GraphQLRequest,
    options?: RequestInit,
  ): Promise<FetchResponse<GraphQLResponse>> => {
    const response = await enhancedFetch(`${baseURL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
      ...options,
    });

    const body = await response.text();
    const data: GraphQLResponse = body ? JSON.parse(body) : {};

    return {
      data,
      status: response.status,
      headers: response.headers,
    };
  };


  const query = (
    request: GraphQLRequest,
    options?: RequestInit,
  ): Promise<FetchResponse<GraphQLResponse>> => {
    return executeOperation(request, options);
  };


  const mutation = (
    request: GraphQLRequest,
    options?: RequestInit,
  ): Promise<FetchResponse<GraphQLResponse>> => {
    return executeOperation(request, options);
  };

  return {
    query,
    mutation,
  } as GraphQLClient;
};
