import { createApiClient as createAuthClient } from '../auth/auth';
import { createApiClient as createStorageClient } from '../storage/storage';
import { createTokenRefreshInterceptor } from '../auth/token-interceptor';

// Configure axios for testing

describe('Nhost - Sign Up with Email and Password and upload file', () => {
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

    // Check if we have a valid session
    if (!response.data.session) {
      throw new Error('Failed to sign up: No session returned');
    }

    // Create token refresh interceptor with the session from the signup response
    const tokenRefreshInterceptor = createTokenRefreshInterceptor(
      nhostAuth,
      response.data.session,
    );

    // Apply the interceptor to the storage client
    tokenRefreshInterceptor(nhostStorage.axios);

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
    })

    // test the object is like {
    // +   "processedFiles": Array [
    // +     Object {
    // +       "bucketId": "default",
    // +       "createdAt": "2025-04-30T07:22:31.793621+00:00",
    // +       "etag": "\"0f343b0931126a20f133d67c2b018a3b\"",
    // +       "id": "b7cbc4e2-ecf1-465a-83a6-615df794c83c",
    // +       "isUploaded": true,
    // +       "metadata": Object {
    // +         "key": "value",
    // +       },
    // +       "mimeType": "application/octet-stream",
    // +       "name": "test",
    // +       "size": 1024,
    // +       "updatedAt": "2025-04-30T07:22:31.800545+00:00",
    // +       "uploadedByUserId": "",
    // +     },
    // +   ],
    // + }
    expect(fileUploadResponse.data.processedFiles).toBeDefined();
    expect(fileUploadResponse.data.processedFiles?.[0]?.bucketId).toBe('default');
    expect(fileUploadResponse.data.processedFiles?.[0]?.createdAt).toBeDefined();
    expect(fileUploadResponse.data.processedFiles?.[0]?.etag).toBeDefined();
    expect(fileUploadResponse.data.processedFiles?.[0]?.id).toBe(uuid);
    expect(fileUploadResponse.data.processedFiles?.[0]?.isUploaded).toBe(true);
    expect(fileUploadResponse.data.processedFiles?.[0]?.metadata).toEqual({"key": "value"});
    expect(fileUploadResponse.data.processedFiles?.[0]?.mimeType).toBe('application/octet-stream');
    expect(fileUploadResponse.data.processedFiles?.[0]?.name).toBe('test');
    expect(fileUploadResponse.data.processedFiles?.[0]?.size).toBe(1024);
    expect(fileUploadResponse.data.processedFiles?.[0]?.updatedAt).toBeDefined();
    expect(fileUploadResponse.data.processedFiles?.[0]?.uploadedByUserId).toBeDefined();
  });
});
