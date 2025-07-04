/**
 * This is the main module to interact with Nhost's Functions service.
 * Typically you would use this module via the main [Nhost client](main#createclient)
 * but you can also use it directly if you have a specific use case.
 *
 * ## Error handling
 *
 * The SDK will throw errors in most operations if the request return a status >=400 or
 * if the request fails entirely (i.e., due to network errors). A continuation you can see
 * how you can handle errors thrown by the SDK when the status is >=400.
 *
 * {@includeCode ./__tests__/docstrings.test.ts#errorHandling}
 *
 * @module functions
 * @packageDocumentation
 */

export * from "./client";
