import { createClient } from "../";
import { type FetchResponse, type Error } from "../storage";

test("error handling for storage", async () => {
  const subdomain = "local";
  const region = "local";

  //#region errorHandling
  // Needs the following imports:
  //
  // import {
  //   type FetchResponse,
  //   type Error,
  // } from "@nhost/nhost-js/storage";
  //
  const nhost = createClient({
    subdomain: subdomain,
    region: region,
  });
  try {
    await nhost.storage.uploadFiles({
      "file[]": [new File(["test1"], "file-1", { type: "text/plain" })],
    });

    expect(true).toBe(false); // This should not be reached
  } catch (error) {
    const err = error as FetchResponse<Error>;
    console.log("Error:", err);
    // Error: {
    //   body: { error: { message: 'you are not authorized' } },
    //   status: 403,
    //   headers: {
    //     'content-length': '46',
    //     'content-type': 'application/json; charset=utf-8',
    //     date: 'Mon, 12 May 2025 08:18:52 GMT'
    //   }
    // }

    // error handling...

    //#endregion errorHandling
    expect(err.status).toBe(403);
    expect(err.body).toStrictEqual({
      error: {
        message: "you are not authorized",
      },
    });
  }
});
