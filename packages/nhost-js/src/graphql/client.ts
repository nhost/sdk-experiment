/**
 * @fileoverview GraphQL client for the Nhost JavaScript SDK.
 *
 * This module provides functionality for executing GraphQL operations against
 * a Hasura GraphQL API.
 */

import {
  createEnhancedFetch,
  type ChainFunction,
  type FetchResponse,
  FetchError,
} from "../fetch";

/**
 * Variables object for GraphQL operations.
 * Key-value pairs of variable names and their values.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type GraphQLVariables = Record<string, any>;

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
  extensions?: { path: string; code: string };
}

/**
 * Standard GraphQL response format as defined by the GraphQL specification.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface GraphQLResponse<T = any> {
  /** The data returned from successful execution */
  data?: T;
  /** Array of errors if execution was unsuccessful or partially successful */
  errors?: GraphQLError[];
}

/**
 * GraphQL client interface providing methods for executing queries and mutations
 */
export interface Client {
  /**
   * Execute a GraphQL query operation
   *
   * Queries are used to fetch data and should not modify any data on the server.
   *
   * @param request - GraphQL request object containing query and optional variables
   * @param options - Additional fetch options to apply to the request
   * @returns Promise with the GraphQL response and metadata
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  post<T = any>(
    request: GraphQLRequest,
    options?: RequestInit,
  ): Promise<FetchResponse<GraphQLResponse<T>>>;
}

/**
 * Creates a GraphQL API client for interacting with a GraphQL endpoint.
 *
 * This client provides methods for executing queries and mutations against
 * a GraphQL API, with support for middleware functions to handle authentication,
 * error handling, and other cross-cutting concerns.
 *
 * @param baseURL - Base URL for the GraphQL endpoint
 * @param chainFunctions - Array of middleware functions for the fetch chain
 * @returns GraphQL client with query and mutation methods
 */
export const createAPIClient = (
  baseURL: string,
  chainFunctions: ChainFunction[] = [],
): Client => {
  const enhancedFetch = createEnhancedFetch(chainFunctions);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const executeOperation = async <T = any>(
    request: GraphQLRequest,
    options?: RequestInit,
  ): Promise<FetchResponse<GraphQLResponse<T>>> => {
    const response = await enhancedFetch(`${baseURL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
      ...options,
    });

    const body = await response.text();
    const data: GraphQLResponse<T> = (
      body ? JSON.parse(body) : {}
    ) as GraphQLResponse<T>;

    const resp = {
      body: data,
      status: response.status,
      headers: response.headers,
    };

    if (data.errors) {
      throw new FetchError(data, response.status, response.headers);
    }

    return resp;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const post = <T = any>(
    request: GraphQLRequest,
    options?: RequestInit,
  ): Promise<FetchResponse<GraphQLResponse<T>>> =>
    executeOperation(request, options);

  return {
    post,
  } as Client;
};
