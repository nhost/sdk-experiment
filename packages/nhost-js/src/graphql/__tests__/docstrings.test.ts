import { test, expect } from "@jest/globals";
import { createClient } from "../../";
import type { GraphQLResponse } from "../../graphql/client";
import type { FetchError } from "../../fetch";

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
