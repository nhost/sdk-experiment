/**
 * This is the main module to interact with Nhost's GraphQL service.
 * Typically you would use this modula via the main [Nhost client](main#createclient)
 * but you can also use it directly if you have a specific use case.
 *
 * ## Error handling
 *
 * The SDK will throw errors in gaphql operations that respond with the errors attribute
 * with length > 0.
 *
 * {@includeCode ./__tests__/docstrings.test.ts#errorHandling}
 *
 * @module graphql
 * @packageDocumentation
 */

export * from "./client";
