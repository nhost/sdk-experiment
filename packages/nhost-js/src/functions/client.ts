/**
 * @fileoverview Functions client for the Nhost JavaScript SDK.
 *
 * This module provides functionality for executing serverless function calls
 * against Nhost serverless functions.
 */

import { createEnhancedFetch } from "../fetch";
import type { ChainFunction } from "../fetch";

/**
 * Response wrapper for function calls with additional metadata.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface FetchResponse<T = any> {
  /** The parsed response body */
  body: T;
  /** HTTP status code of the response */
  status: number;
  /** HTTP headers from the response */
  headers: Headers;
}

/**
 * Functions client interface providing methods for executing serverless function calls
 */
export interface Client {
  /**
   * Execute a request to a serverless function
   * The response body will be automatically parsed based on the content type into the following types:
   *   - Object if the response is application/json
   *   - string text string if the response is text/*
   *   - Blob if the response is any other type
   *
   * @param path - The path to the serverless function
   * @param options - Additional fetch options to apply to the request
   * @returns Promise with the function response and metadata.    */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fetch: (path: string, options?: RequestInit) => Promise<FetchResponse<any>>;
}

/**
 * Creates a Functions API client for interacting with serverless functions.
 *
 * This client provides methods for executing requests against serverless functions,
 * with support for middleware functions to handle authentication, error handling,
 * and other cross-cutting concerns.
 *
 * @param baseURL - Base URL for the functions endpoint
 * @param chainFunctions - Array of middleware functions for the fetch chain
 * @returns Functions client with fetch method
 */
export const createAPIClient = (
  baseURL: string,
  chainFunctions: ChainFunction[] = [],
) => {
  const enhancedFetch = createEnhancedFetch(chainFunctions);

  /**
   * Executes a request to a serverless function and processes the response
   *
   * @param path - The path to the serverless function
   * @param options - Additional fetch options to apply to the request
   * @returns Promise with the function response and metadata. Body will be either
   *   - JSON object if the response is application/json
       - text string if the response is text/*
       - Blob if the response is any other type
   */
  const fetch = async (
    path: string,
    options?: RequestInit,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<FetchResponse<any>> => {
    const resp = await enhancedFetch(`${baseURL}${path}`, options);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let body: any;
    // Process response based on content type
    if (resp.headers.get("content-type")?.includes("application/json")) {
      body = await resp.json();
    } else if (resp.headers.get("content-type")?.startsWith("text/")) {
      body = await resp.text();
    } else {
      body = await resp.blob();
    }

    // Create response payload with status, body and headers
    const payload = {
      status: resp.status,
      body: body,
      headers: resp.headers,
    };

    // Throw error for non-OK responses
    if (!resp.ok) {
      throw payload;
    }

    return payload;
  };

  // Return client object with the fetch method
  return {
    fetch,
  } as Client;
};
