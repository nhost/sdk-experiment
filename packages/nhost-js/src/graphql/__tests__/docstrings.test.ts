import { test, expect } from "@jest/globals";
import { createClient } from "../../";
import { GraphQLResponse } from "../../graphql/client";
import { FetchError } from "../../fetch";

test("error handling for graphql", async () => {
  const subdomain = "local";
  const region = "local";

  //#region errorHandling
  // Needs the following imports:
  //
  // import {
  //   type GraphQLResponse,
  // } from "@nhost/nhost-js/graphql";
  // import {
  //   type FetchError,
  // } from "@nhost/fetch";
  //
  const nhost = createClient({
    subdomain,
    region,
  });

  try {
    await nhost.graphql.request({
      query: `
        query GetRestrictedObject {
          restrictedObject {
            restrictedField
          }
        }
      `,
    });
  } catch (error) {
    if (!(error instanceof FetchError)) {
      throw error;
    }

    const resp = error as FetchError<GraphQLResponse>;

    console.log("Error:", JSON.stringify(resp, null, 2));
    // Error: {
    //   "body": {
    //     "errors": [
    //       {
    //         "message": "field 'restrictedObject' not found in type: 'query_root'",
    //         "extensions": {
    //           "path": "$.selectionSet.restrictedObject",
    //           "code": "validation-failed"
    //         }
    //       }
    //     ]
    //   },
    //   "status": 200,
    //   "headers": {}
    // }
    //
    // error handling...
    //#endregion errorHandling

    expect(resp.body.errors).toBeDefined();
    expect(resp.body.errors).toHaveLength(1);
    const errors = resp.body.errors!;
    expect(errors[0]?.message).toBe(
      "field 'restrictedObject' not found in type: 'query_root'",
    );
    expect(error.message).toBe(
      "field 'restrictedObject' not found in type: 'query_root'",
    );
    expect(errors[0].extensions?.path).toBe("$.selectionSet.restrictedObject");
    expect(errors[0].extensions?.code).toBe("validation-failed");
  }
});

test("error handling for graphql as a generic error", async () => {
  const subdomain = "local";
  const region = "local";

  //#region errorHandlingError
  const nhost = createClient({
    subdomain,
    region,
  });

  try {
    await nhost.graphql.post({
      query: `
        query GetRestrictedObject {
          restrictedObject {
            restrictedField
          }
        }
      `,
    });
  } catch (error) {
    if (!(error instanceof Error)) {
      throw error;
    }

    console.log("Error:", error.message);
    // Error: field 'restrictedObject' not found in type: 'query_root'
    //#endregion errorHandlingError

    expect(error.message).toBe(
      "field 'restrictedObject' not found in type: 'query_root'",
    );
  }
});
