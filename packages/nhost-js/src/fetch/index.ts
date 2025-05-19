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

export interface FetchResponse<T> {
  body: T;
  status: number;
  headers: Headers;
}

function extractMessage(body: unknown): string {
  if (body && typeof body === "string") {
    return body;
  }

  if (body && typeof body === "object") {
    const typedBody = body as Record<string, unknown>;

    if ("message" in typedBody && typeof typedBody["message"] === "string") {
      return typedBody["message"];
    }

    if ("error" in typedBody && typeof typedBody["error"] === "string") {
      return typedBody["error"];
    }

    if (
      "error" in typedBody &&
      typedBody["error"] &&
      typeof typedBody["error"] === "object"
    ) {
      const error = typedBody["error"] as Record<string, unknown>;
      if ("message" in error && typeof error["message"] === "string") {
        return error["message"];
      }
    }

    if ("errors" in typedBody && Array.isArray(typedBody["errors"])) {
      const messages = (typedBody["errors"] as unknown[])
        .filter(
          (error): error is { message: string } =>
            typeof error === "object" &&
            error !== null &&
            "message" in error &&
            typeof (error as { message: unknown })["message"] === "string",
        )
        .map((error) => error["message"]);

      if (messages.length > 0) {
        return messages.join(", ");
      }
    }
  }

  return "An unexpected error occurred";
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class FetchError<T = any> extends Error {
  body: T;
  status: number;
  headers: Headers;

  constructor(body: T, status: number, headers: Headers) {
    super(extractMessage(body));
    this.body = body;
    this.status = status;
    this.headers = headers;

    // Maintain proper stack trace (V8 only)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, FetchError);
    }

    this.name = "FetchError";
  }
}
