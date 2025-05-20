import { test, expect } from "@jest/globals";
import { createClient } from "../";
import { type ErrorResponse } from "../auth";
import { type FetchError } from "../fetch";

test("error handling for auth", async () => {
  const subdomain = "local";
  const region = "local";

  const email = `test-${Date.now()}@example.com`;
  const password = "password123";

  //#region errorHandling
  // Needs the following imports:
  //
  // import {
  //   type ErrorResponse,
  // } from "@nhost/nhost-js/auth";
  // import {
  //   type FetchError,
  // } from "@nhost/nhost-js/fetch";
  //
  const nhost = createClient({
    subdomain,
    region,
  });
  try {
    await nhost.auth.signInEmailPassword({
      email,
      password,
    });

    expect(true).toBe(false); // This should not be reached
  } catch (error) {
    const err = error as FetchError<ErrorResponse>;
    console.log("Error:", err);
    // Error: {
    //   body: {
    //     error: 'invalid-email-password',
    //     message: 'Incorrect email or password',
    //     status: 401
    //   },
    //   status: 401,
    //   headers: {
    //     'content-length': '88',
    //     'content-type': 'application/json',
    //     date: 'Mon, 12 May 2025 08:08:28 GMT'
    //   }
    // }

    // error handling...

    //#endregion errorHandling
    expect(err.status).toBe(401);
    expect(err.body).toStrictEqual({
      error: "invalid-email-password",
      message: "Incorrect email or password",
      status: 401,
    });
  }
});
