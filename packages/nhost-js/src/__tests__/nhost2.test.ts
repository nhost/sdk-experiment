import { createAPIClient } from "../auth/client";
// import { type SessionPayload } from "../auth/client";

// Configure axios for testing

describe("Nhost - Sign Up with Email and Password and upload file", () => {
  const nhost = createAPIClient("https://local.auth.local.nhost.run/v1");

  it("should sign up a user with email and password", async () => {
    const response = await nhost.signUpEmailPassword({
      email: `test-${Date.now()}example.com`,
      // email: `test-1@example.com`,
      password: "password123",
      options: {
        displayName: "Test User",
        locale: "en",
        defaultRole: "user",
        allowedRoles: ["user"],
        metadata: {
          source: "test",
        },
      },
    });

    console.log("response", response);

    // expect(response).toBeDefined();
    // expect(response.status).toBe(200);
    // const session = response.data as Session;
    // expect(session.accessToken).toBeDefined();
    // expect(session.refreshToken).toBeDefined();
    // expect(session.user).toBeDefined();
    // expect(session.user?.id).toBeDefined();
    // expect(session.user?.email).toBeDefined();
    // expect(session.user?.displayName).toBeDefined();
    // expect(session.user?.avatarUrl).toBeDefined();
    // expect(session.user?.defaultRole).toBeDefined();
    // expect(session.user?.roles).toBeDefined();
    // expect(session.user?.metadata).toBeDefined();
  });

  it("head", async () => {
    const response = await nhost.healthCheckHead();

    console.log("response", response);

    // expect(response).toBeDefined();
    // expect(response.status).toBe(200);
    // const session = response.data as Session;
    // expect(session.accessToken).toBeDefined();
    // expect(session.refreshToken).toBeDefined();
    // expect(session.user).toBeDefined();
    // expect(session.user?.id).toBeDefined();
    // expect(session.user?.email).toBeDefined();
    // expect(session.user?.displayName).toBeDefined();
    // expect(session.user?.avatarUrl).toBeDefined();
    // expect(session.user?.defaultRole).toBeDefined();
    // expect(session.user?.roles).toBeDefined();
    // expect(session.user?.metadata).toBeDefined();
  });

  // it.only('should sign up a user with email and password and upload file', async () => {
  //   // magic
  //   await nhost.auth.signUpEmailPassword({
  //       email: `test-${Date.now()}@example.com`,
  //       password: "password123",
  //       options: {
  //           displayName: 'Test User',
  //           locale: 'en',
  //           defaultRole: 'user',
  //           allowedRoles: ['user'],
  //           metadata: {
  //             source: 'test'
  //           }
  //       }
  //   });

  //   const uuid = crypto.randomUUID();
  //   const fileUploadResponse = await nhost.storage.uploadFiles({
  //       "bucket-id": "default",
  //       "metadata[]": [
  //           {
  //               id: uuid,
  //               name: 'test',
  //               metadata: {"key": "value"},
  //           },
  //       ],
  //       "file[]": [
  //           new Blob([new Uint8Array(1024)], { type: 'application/octet-stream' }),
  //       ]
  //   })

  //   // test the object is like {
  //   // +   "processedFiles": Array [
  //   // +     Object {
  //   // +       "bucketId": "default",
  //   // +       "createdAt": "2025-04-30T07:22:31.793621+00:00",
  //   // +       "etag": "\"0f343b0931126a20f133d67c2b018a3b\"",
  //   // +       "id": "b7cbc4e2-ecf1-465a-83a6-615df794c83c",
  //   // +       "isUploaded": true,
  //   // +       "metadata": Object {
  //   // +         "key": "value",
  //   // +       },
  //   // +       "mimeType": "application/octet-stream",
  //   // +       "name": "test",
  //   // +       "size": 1024,
  //   // +       "updatedAt": "2025-04-30T07:22:31.800545+00:00",
  //   // +       "uploadedByUserId": "",
  //   // +     },
  //   // +   ],
  //   // + }
  //   expect(fileUploadResponse.data.processedFiles).toBeDefined();
  //   expect(fileUploadResponse.data.processedFiles?.[0]?.bucketId).toBe('default');
  //   expect(fileUploadResponse.data.processedFiles?.[0]?.createdAt).toBeDefined();
  //   expect(fileUploadResponse.data.processedFiles?.[0]?.etag).toBeDefined();
  //   expect(fileUploadResponse.data.processedFiles?.[0]?.id).toBe(uuid);
  //   expect(fileUploadResponse.data.processedFiles?.[0]?.isUploaded).toBe(true);
  //   expect(fileUploadResponse.data.processedFiles?.[0]?.metadata).toEqual({"key": "value"});
  //   expect(fileUploadResponse.data.processedFiles?.[0]?.mimeType).toBe('application/octet-stream');
  //   expect(fileUploadResponse.data.processedFiles?.[0]?.name).toBe('test');
  //   expect(fileUploadResponse.data.processedFiles?.[0]?.size).toBe(1024);
  //   expect(fileUploadResponse.data.processedFiles?.[0]?.updatedAt).toBeDefined();
  //   expect(fileUploadResponse.data.processedFiles?.[0]?.uploadedByUserId).toBeDefined();

  //   const session = nhost.getUserSession()
  //   expect(session).toBeDefined();
  //   expect(session?.user?.id).toBeDefined();
  //   expect(session?.user?.email).toBeDefined();
  //   expect(session?.user?.displayName).toBeDefined();
  //   expect(session?.user?.avatarUrl).toBeDefined();
  //   expect(session?.user?.defaultRole).toBeDefined();
  //   expect(session?.user?.roles).toBeDefined();

  //   const files = await nhost.graphql.query(
  //     {
  //       query: `
  //         query GetFiles {
  //           files {
  //             id
  //             name
  //             size
  //             mimeType
  //             bucketId
  //             uploadedByUserId
  //           }
  //         }
  //       `
  //     }
  //   );
  //   expect(files.data.data.files[0].id).toBe(uuid);
  //   expect(files.data.data.files[0].name).toBe('test');
  //   expect(files.data.data.files[0].size).toBe(1024);
  //   expect(files.data.data.files[0].mimeType).toBe('application/octet-stream');
  //   expect(files.data.data.files[0].bucketId).toBe('default');
  //   expect(files.data.data.files[0].uploadedByUserId).toBeDefined();
  // });
});
