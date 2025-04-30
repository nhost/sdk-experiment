import { createApiClient, SignUpEmailPasswordRequest } from '../auth';

// Configure axios for testing

describe('Nhost Auth - Sign Up with Email and Password', () => {
  const nhostAuth = createApiClient({baseURL: "https://local.auth.nhost.run/v1"});

  // Create a unique email for each test run to avoid conflicts
  const uniqueEmail = `test-${Date.now()}@example.com`;
  const password = 'password123';


  it('should sign up a user with email and password (real API)', async () => {
    // Create request payload with unique email
    const signUpRequest: SignUpEmailPasswordRequest = {
      email: uniqueEmail,
      password: password,
      options: {
        displayName: 'Test User',
        locale: 'en',
        defaultRole: 'user',
        allowedRoles: ['user'],
        metadata: {
          source: 'test'
        }
      }
    };

    // Make an actual API call
    const response = await nhostAuth.signupEmailPassword(signUpRequest);


    // Verify structure of response
    expect(response.data.session).toBeDefined();
    expect(response.data.session?.accessToken).toBeDefined();
    expect(response.data.session?.refreshToken).toBeDefined();
    expect(response.data.session?.user).toBeDefined();
  });

  it('should sign in a user with email and password (real API)', async () => {
    // Make an actual API call
    const response = await nhostAuth.signinEmailPassword({
        email: uniqueEmail,
        password: password
    });


    // Verify structure of response
    expect(response.data.session).toBeDefined();
    expect(response.data.session?.accessToken).toBeDefined();
    expect(response.data.session?.refreshToken).toBeDefined();
    expect(response.data.session?.user).toBeDefined();
  });

  it('should fail sign in a user with email and password (real API)', async () => {
    // Make an actual API call with incorrect password
    try {
      await nhostAuth.signinEmailPassword({
        email: uniqueEmail,
        password: "wrongpassword"
      });

      // If we reach here, the test should fail
      fail('Expected sign in to fail with incorrect password');
    } catch (error: any) {
      // Verify error structure
      expect(error.response.status).toBe(401);
      expect(error.response.data).toStrictEqual({
        "error": "invalid-email-password",
        "message": "Incorrect email or password",
        "status": 401,
      });
    }
  });
});
