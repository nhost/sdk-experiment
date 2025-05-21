/**
 * @fileoverview Enhanced fetch implementation with middleware support.
 *
 * This module provides a middleware pattern for the Fetch API, allowing
 * chain functions to be applied to requests and responses, such as
 * authentication token refreshing, error handling, and request/response transformation.
 */

export {
  type FetchFunction,
  type ChainFunction,
  type FetchResponse,
  FetchError,
  createEnhancedFetch,
} from "./fetch";

export {
  type SessionRefreshOptions,
  createSessionRefreshMiddleware,
} from "./middlewareRefreshSession";
export { createAttachAccessTokenMiddleware } from "./middlewareAttachToken";
export { createSessionResponseMiddleware } from "./middlewareResponseSession";
