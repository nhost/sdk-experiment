import { describe, it, expect } from "@jest/globals";
import {
  createAPIClient,
  type SignUpEmailPasswordRequest,
  type FetchResponse,
  type ErrorResponse,
  SessionPayload,
} from "../auth/client";

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

    if (response.status !== 200) {
      throw new Error("Failed to sign up");
    }

    const payload = response.body as SessionPayload;

    // Verify structure of response
    expect(payload.session).toBeDefined();
    expect(payload.session?.accessToken).toBeDefined();
    expect(payload.session?.refreshToken).toBeDefined();
    expect(payload.session?.user).toBeDefined();
  });

  it("should sign in a user with email and password", async () => {
    // Make an actual API call
    const response = await nhostAuth.signInEmailPassword({
      email: uniqueEmail,
      password,
    });

    if (response.status !== 200) {
      throw new Error("Failed to sign up");
    }

    const payload = response.body as SessionPayload;

    // Verify structure of response
    expect(payload.session).toBeDefined();
    expect(payload.session?.accessToken).toBeDefined();
    expect(payload.session?.refreshToken).toBeDefined();
    expect(payload.session?.user).toBeDefined();
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
      const err = error as FetchResponse<ErrorResponse>;
      expect(err.status).toBe(401);
      expect(err.body).toStrictEqual({
        error: "invalid-email-password",
        message: "Incorrect email or password",
        status: 401,
      });
    }
  });
});
