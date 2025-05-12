/**
 * @fileoverview Enhanced fetch implementation with middleware support.
 *
 * This module provides a middleware pattern for the Fetch API, allowing
 * chain functions to be applied to requests and responses, such as
 * authentication token refreshing, error handling, and request/response transformation.
 */

/**
 * Type definition for a fetch-like function.
 * Takes the same parameters as fetch and returns the same type.
 * This allows middleware to intercept and modify requests and responses.
 */
export type FetchFunction = (
  url: string,
  options?: RequestInit,
) => Promise<Response>;

/**
 * Type definition for a chain function (middleware).
 * Takes a fetch-like function and returns another fetch-like function.
 *
 * Chain functions can be used to implement:
 * - Authentication token handling
 * - Error handling and retry logic
 * - Request and response transformations
 * - Logging and metrics
 */
export type ChainFunction = (next: FetchFunction) => FetchFunction;

/**
 * Creates an enhanced fetch function using a chain of middleware functions.
 *
 * The fetch chain executes in the order of the array, with each middleware
 * wrapping the next one in the chain. This allows each middleware to
 * intercept both the request (before calling next) and the response
 * (after calling next).
 *
 * @example
 * ```typescript
 * // Simple logging middleware
 * const loggingMiddleware: ChainFunction = (next) => {
 *   return async (url, options) => {
 *     console.log(`Request to ${url}`);
 *     const response = await next(url, options);
 *     console.log(`Response from ${url}: ${response.status}`);
 *     return response;
 *   };
 * };
 *
 * const enhancedFetch = createEnhancedFetch([loggingMiddleware]);
 * const response = await enhancedFetch('https://api.example.com/data');
 * ```
 *
 * @param chainFunctions - Array of chain functions to apply in order
 * @returns Enhanced fetch function with all middleware applied
 */
export function createEnhancedFetch(
  chainFunctions: ChainFunction[] = [],
): FetchFunction {
  // Build the chain starting with vanilla fetch, but apply functions in reverse
  // to achieve the desired execution order
  return chainFunctions.reduceRight(
    (nextInChain, chainFunction) => chainFunction(nextInChain),
    fetch as FetchFunction,
  );
}
