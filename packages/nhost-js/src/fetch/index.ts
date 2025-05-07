/**
 * Interface for request parameters
 */
interface RequestParams {
  url: string;
  options: RequestInit;
}

/**
 * Type definition for interceptor function
 */
type Interceptor = (
  params: RequestParams,
) => Promise<RequestParams | void> | RequestParams | void;

/**
 * Creates an enhanced fetch function with interceptors
 * @param interceptors - Array of request interceptors
 * @returns Enhanced fetch function
 */
function createEnhancedFetch(interceptors: Interceptor[] = []) {
  /**
   * Enhanced fetch function that applies interceptors
   * @param url - The URL to fetch
   * @param options - Fetch options
   * @returns The fetch response
   */
  return async function enhancedFetch(
    url: string,
    options: RequestInit = {},
  ): Promise<Response> {
    let requestParams: RequestParams = { url, options };

    // Apply all interceptors sequentially
    for (const interceptor of interceptors) {
      const result = await interceptor(requestParams);
      requestParams = result || requestParams;
    }

    // Destructure the potentially modified params
    const { url: finalUrl, options: finalOptions } = requestParams;

    // Make the actual fetch call
    return fetch(finalUrl, finalOptions);
  };
}

export { createEnhancedFetch, type RequestParams, type Interceptor };
