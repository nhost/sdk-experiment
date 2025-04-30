import { exit } from 'process';
import { createApiClient as createAuthClient } from '../auth/auth';
import { createApiClient as createStorageClient } from '../storage/storage';

// Configure axios for testing

describe('Nhost Auth - Sign Up with Email and Password', () => {
  const nhostAuth = createAuthClient({baseURL: "https://local.auth.local.nhost.run/v1"});
  const nhostStorage = createStorageClient({baseURL: "https://local.storage.local.nhost.run/v1"});

  // Create a unique email for each test run to avoid conflicts
  const uniqueEmail = `test-${Date.now()}@example.com`;
  const password = 'password123';


  it('should sign up a user with email and password and upload file', async () => {
    const response = await nhostAuth.signupEmailPassword({
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
    });

    // create a blob with random data
    const blob = new Blob([new Uint8Array(1024)], { type: 'application/octet-stream' });

    // generate random uuid
    const uuid = crypto.randomUUID();


    const fileUploadResponse = await nhostStorage.postFiles({
        "bucket-id": "default",
        "metadata[]": [
            {
                id: uuid,
                name: 'test',
                metadata: {"key": "value"},
            },
        ],
        "file[]": [
            blob,
        ]
    }, {
        headers: {
            "Authorization": `Bearer ${response.data.session?.accessToken}`,
        }
    })

    expect(fileUploadResponse.data).toStrictEqual({});
  });
});
