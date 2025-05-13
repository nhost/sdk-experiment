import { createClient } from "../";
import { FetchResponse, createAPIClient } from "../functions";

test("error handling for graphql", async () => {
  const subdomain = "local";
  const region = "local";

  //#region errorHandling
  // Needs the following imports:
  //
  // import {
  //   type FetchResponse,
  //   type GraphQLResponse,
  // } from "@nhost/nhost-js/graphql";
  //
  // const nhost = createClient({
  //   subdomain: subdomain,
  //   region: region,
  // });

  const nhostFunctions = createAPIClient(
    "https://local.functions.local.nhost.run/v1",
  );

  try {
    await nhostFunctions.fetch("/crash", {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    });
  } catch (error) {
    const resp = error as FetchResponse<any>;
    console.log(1, error);
    console.log(2, resp);

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
    expect(errors[0]?.extensions.path).toBe("$.selectionSet.restrictedObject");
    expect(errors[0]?.extensions.code).toBe("validation-failed");
  }
});
