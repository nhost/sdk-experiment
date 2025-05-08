import { createEnhancedFetch } from "../fetch";
import type { ChainFunction } from "../fetch";

export interface GraphQLVariables {
  [key: string]: any;
}

export interface GraphQLRequest {
  query: string;
  variables?: GraphQLVariables;
  operationName?: string;
}

export interface GraphQLError {
  message: string;
  locations?: { line: number; column: number }[];
  path?: string[];
  extensions?: any;
}

export interface GraphQLResponse<T = any> {
  data?: T;
  errors?: GraphQLError[];
}

export interface FetchResponse<T = any> {
  data: T;
  status: number;
  headers: Headers;
}

/**
 * Creates a GraphQL API client for interacting with GraphQL API using fetch
 * @param baseURL - Base URL for the GraphQL endpoint
 * @param requestInterceptors - Array of request interceptors
 * @returns GraphQL client with fetch instance and query methods
 */
export const createAPIClient = (
  baseURL: string,
  chainFunctions: ChainFunction[] = [],
) => {
  const enhancedFetch = createEnhancedFetch(chainFunctions);

  /**
   * Execute a GraphQL operation (query or mutation)
   * @param request - GraphQL request object containing query and optional variables
   * @param options - Fetch request configuration
   * @returns Promise with the GraphQL response
   */
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

  /**
   * Execute a GraphQL query
   * @param request - GraphQL request object containing query and optional variables
   * @param options - Fetch request configuration
   * @returns Promise with the GraphQL response
   */
  const query = (
    request: GraphQLRequest,
    options?: RequestInit,
  ): Promise<FetchResponse<GraphQLResponse>> => {
    return executeOperation(request, options);
  };

  /**
   * Execute a GraphQL mutation
   * @param request - GraphQL request object containing mutation and optional variables
   * @param options - Fetch request configuration
   * @returns Promise with the GraphQL response
   */
  const mutation = (
    request: GraphQLRequest,
    options?: RequestInit,
  ): Promise<FetchResponse<GraphQLResponse>> => {
    return executeOperation(request, options);
  };

  return {
    query,
    mutation,
  };
};
