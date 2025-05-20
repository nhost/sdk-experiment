import { describe, it, expect } from "@jest/globals";
import {
  createAPIClient,
  type SignUpEmailPasswordRequest,
  type ErrorResponse,
} from "../auth/client";
import { type FetchError } from "../fetch";

describe("Nhost Auth - Sign Up with Email and Password", () => {
  const nhostAuth = createAPIClient("https://local.auth.nhost.run/v1");

  // Create a unique email for each test run to avoid conflicts
  const uniqueEmail = `test-${Date.now()}@example.com`;
  const password = "password123";

  it("should sign up a user with email and password", async () => {
    // Create request payload with unique email
    const signUpRequest: SignUpEmailPasswordRequest = {
      email: uniqueEmail,
      password,
      options: {
        displayName: "Test User",
        locale: "en",
        defaultRole: "user",
        allowedRoles: ["user"],
        metadata: {
          source: "test",
        },
      },
    };

    // Make an actual API call
    const response = await nhostAuth.signUpEmailPassword(signUpRequest);

    // Verify structure of response
    expect(response.body.session).toBeDefined();
    expect(response.body.session?.accessToken).toBeDefined();
    expect(response.body.session?.refreshToken).toBeDefined();
    expect(response.body.session?.user).toBeDefined();
  });

  it("should sign in a user with email and password", async () => {
    // Make an actual API call
    const response = await nhostAuth.signInEmailPassword({
      email: uniqueEmail,
      password,
    });

    // Verify structure of response
    expect(response.body.session).toBeDefined();
    expect(response.body.session?.accessToken).toBeDefined();
    expect(response.body.session?.refreshToken).toBeDefined();
    expect(response.body.session?.user).toBeDefined();
  });

  it("should fail sign in a user with email and password", async () => {
    // Make an actual API call with incorrect password
    try {
      await nhostAuth.signInEmailPassword({
        email: uniqueEmail,
        password: "wrongpassword",
      });

      expect(true).toBe(false); // This should not be reached
    } catch (error) {
      const err = error as FetchError<ErrorResponse>;
      expect(err.status).toBe(401);
      expect(err.body).toStrictEqual({
        error: "invalid-email-password",
        message: "Incorrect email or password",
        status: 401,
      });
    }
  });
});
