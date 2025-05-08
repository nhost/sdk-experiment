import { createClient } from "../index";

// Configure axios for testing

describe("Nhost - Sign Up with Email and Password and upload file", () => {
  const nhost = createClient({
    subdomain: "local",
    region: "local",
  });

  it.only("should sign up a user with email and password and upload file", async () => {
    // magic
    const resp = await nhost.auth.signUpEmailPassword({
      email: `test-${Date.now()}@example.com`,
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

    if (!resp.data.session) {
        throw new Error("Session is null");
    }
    nhost.sessionStorage.set(resp.data.session);


    const uuid = crypto.randomUUID();
    const fileUploadResponse = await nhost.storage.uploadFiles({
      "bucket-id": "default",
      "metadata[]": [
        {
          id: uuid,
          name: "test",
          metadata: { key: "value" },
        },
      ],
      "file[]": [
        new Blob([new Uint8Array(1024)], { type: "application/octet-stream" }),
      ],
    });

    expect(fileUploadResponse.data.processedFiles).toBeDefined();
    expect(fileUploadResponse.data.processedFiles?.[0]?.bucketId).toBe(
      "default",
    );
    expect(
      fileUploadResponse.data.processedFiles?.[0]?.createdAt,
    ).toBeDefined();
    expect(fileUploadResponse.data.processedFiles?.[0]?.etag).toBeDefined();
    expect(fileUploadResponse.data.processedFiles?.[0]?.id).toBe(uuid);
    expect(fileUploadResponse.data.processedFiles?.[0]?.isUploaded).toBe(true);
    expect(fileUploadResponse.data.processedFiles?.[0]?.metadata).toEqual({
      key: "value",
    });
    expect(fileUploadResponse.data.processedFiles?.[0]?.mimeType).toBe(
      "application/octet-stream",
    );
    expect(fileUploadResponse.data.processedFiles?.[0]?.name).toBe("test");
    expect(fileUploadResponse.data.processedFiles?.[0]?.size).toBe(1024);
    expect(
      fileUploadResponse.data.processedFiles?.[0]?.updatedAt,
    ).toBeDefined();
    expect(
      fileUploadResponse.data.processedFiles?.[0]?.uploadedByUserId,
    ).toBeDefined();

    const session = nhost.getUserSession();
    expect(session).toBeDefined();
    expect(session?.user?.id).toBeDefined();
    expect(session?.user?.email).toBeDefined();
    expect(session?.user?.displayName).toBeDefined();
    expect(session?.user?.avatarUrl).toBeDefined();
    expect(session?.user?.defaultRole).toBeDefined();
    expect(session?.user?.roles).toBeDefined();

    const files = await nhost.graphql.query({
      query: `
          query GetFiles {
            files {
              id
              name
              size
              mimeType
              bucketId
              uploadedByUserId
            }
          }
        `,
    });
    expect(files.data.data.files[0].id).toBe(uuid);
    expect(files.data.data.files[0].name).toBe("test");
    expect(files.data.data.files[0].size).toBe(1024);
    expect(files.data.data.files[0].mimeType).toBe("application/octet-stream");
    expect(files.data.data.files[0].bucketId).toBe("default");
    expect(files.data.data.files[0].uploadedByUserId).toBeDefined();
  });
});
