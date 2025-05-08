/**
 * Type definition for a fetch-like function
 * Takes the same parameters as fetch and returns the same type
 */
export type FetchFunction = (
  url: string,
  options?: RequestInit,
) => Promise<Response>;

/**
 * Type definition for a chain function
 * Takes a fetch-like function and returns another fetch-like function
 */
export type ChainFunction = (next: FetchFunction) => FetchFunction;

/**
 * Creates an enhanced fetch function using a chain of functions
 * @param chainFunctions - Array of chain functions to apply in order
 * @returns Enhanced fetch function
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
