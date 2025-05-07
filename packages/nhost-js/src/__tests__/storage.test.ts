import { createApiClient as createAuthClient } from "../auth/client";
import { createApiClient as createStorageClient } from "../storage/client";
import { createTokenRefreshInterceptor } from "../auth/token-interceptor";
import { createSessionResponseInterceptor } from "../auth/response-interceptor";
import { MemoryStorage } from "../auth/storage";
import { AxiosError } from "axios";

// Configure axios for testing

describe("Test Storage API", () => {
  const nhostAuth = createAuthClient({
    baseURL: "https://local.auth.local.nhost.run/v1",
  });
  const nhostStorage = createStorageClient({
    baseURL: "https://local.storage.local.nhost.run/v1",
  });

  const memoryStorage = new MemoryStorage();
  const tokenRefreshInterceptor = createTokenRefreshInterceptor(nhostAuth, {
    storage: memoryStorage,
    storageKey: "test-session-key",
  });
  tokenRefreshInterceptor(nhostStorage.axios);

  const responseInterceptor = createSessionResponseInterceptor({
    storage: memoryStorage,
    storageKey: "test-session-key",
  });
  responseInterceptor(nhostAuth.axios);

  it("should sign up a user with email and password", async () => {
    // magic
    await nhostAuth.signUpEmailPassword({
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
  });

  const uuid1 = crypto.randomUUID();
  const uuid2 = crypto.randomUUID();

  it("should upload a file", async () => {
    const fileUploadResponse = await nhostStorage.uploadFiles({
      "bucket-id": "default",
      "metadata[]": [
        {
          id: uuid1,
          name: "test1",
          metadata: { key1: "value1" },
        },
        {
          id: uuid2,
          name: "test2",
          metadata: { key2: "value2" },
        },
      ],
      "file[]": [
        new Blob(["test1"], { type: "text/plain" }),
        new Blob(["test2 is larger"], { type: "text/plain" }),
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
    expect(fileUploadResponse.data.processedFiles?.[0]?.id).toBe(uuid1);
    expect(fileUploadResponse.data.processedFiles?.[0]?.isUploaded).toBe(true);
    expect(fileUploadResponse.data.processedFiles?.[0]?.metadata).toEqual({
      key1: "value1",
    });
    expect(fileUploadResponse.data.processedFiles?.[0]?.mimeType).toBe(
      "text/plain",
    );
    expect(fileUploadResponse.data.processedFiles?.[0]?.name).toBe("test1");
    expect(fileUploadResponse.data.processedFiles?.[0]?.size).toBe(5);
    expect(
      fileUploadResponse.data.processedFiles?.[0]?.updatedAt,
    ).toBeDefined();
    expect(
      fileUploadResponse.data.processedFiles?.[0]?.uploadedByUserId,
    ).toBeDefined();
    expect(fileUploadResponse.data.processedFiles?.[1]?.bucketId).toBe(
      "default",
    );
    expect(
      fileUploadResponse.data.processedFiles?.[1]?.createdAt,
    ).toBeDefined();
    expect(fileUploadResponse.data.processedFiles?.[1]?.etag).toBeDefined();
    expect(fileUploadResponse.data.processedFiles?.[1]?.id).toBe(uuid2);
    expect(fileUploadResponse.data.processedFiles?.[1]?.isUploaded).toBe(true);
    expect(fileUploadResponse.data.processedFiles?.[1]?.metadata).toEqual({
      key2: "value2",
    });
    expect(fileUploadResponse.data.processedFiles?.[1]?.mimeType).toBe(
      "text/plain",
    );
    expect(fileUploadResponse.data.processedFiles?.[1]?.name).toBe("test2");
    expect(fileUploadResponse.data.processedFiles?.[1]?.size).toBe(15);
    expect(
      fileUploadResponse.data.processedFiles?.[1]?.updatedAt,
    ).toBeDefined();
    expect(
      fileUploadResponse.data.processedFiles?.[1]?.uploadedByUserId,
    ).toBeDefined();
  });

  let etag: string;

  it("should get file metadata headers", async () => {
    const fileMetadataHeadersResponse =
      await nhostStorage.getFileMetadataHeaders(uuid1);
    expect(fileMetadataHeadersResponse.headers).toBeDefined();
    expect(fileMetadataHeadersResponse.status).toBe(200);
    expect(fileMetadataHeadersResponse.headers["content-type"]).toBe(
      "text/plain",
    );
    expect(fileMetadataHeadersResponse.headers["etag"]).toBeDefined();
    expect(fileMetadataHeadersResponse.headers["last-modified"]).toBeDefined();
    expect(fileMetadataHeadersResponse.headers["surrogate-key"]).toBeDefined();
    expect(fileMetadataHeadersResponse.headers["cache-control"]).toBe(
      "max-age=3600",
    );
    expect(fileMetadataHeadersResponse.headers["surrogate-control"]).toBe(
      "max-age=604800",
    );
    expect(fileMetadataHeadersResponse.headers["content-length"]).toBe("5");
    expect(fileMetadataHeadersResponse.headers["date"]).toBeDefined();

    etag = fileMetadataHeadersResponse.headers["etag"];
  });

  it("should get file metadata headers with If-None-Match matches", async () => {
    try {
      await nhostStorage.getFileMetadataHeaders(
        uuid1,
        {},
        {
          headers: {
            "If-None-Match": etag,
          },
        },
      );
      expect(true).toBe(false); // should not reach here
    } catch (error) {
      const axiosError = error as AxiosError;
      // axios error
      expect(axiosError).toBeDefined();
      expect(axiosError.response?.status).toBe(304);
      expect(axiosError.response?.headers).toBeDefined();
      expect(axiosError.response?.headers["etag"]).toBe(etag);
      expect(axiosError.response?.headers["cache-control"]).toBe(
        "max-age=3600",
      );
      expect(axiosError.response?.headers["surrogate-control"]).toBe(
        "max-age=604800",
      );
      expect(axiosError.response?.headers["date"]).toBeDefined();
    }
  });

  it("should get file metadata headers with If-None-Match does not match", async () => {
    const fileMetadataResponse = await nhostStorage.getFileMetadataHeaders(
      uuid1,
      {},
      {
        headers: {
          "If-None-Match": "wrong-etag",
        },
      },
    );
    expect(fileMetadataResponse.status).toBe(200);
    expect(fileMetadataResponse.headers).toBeDefined();
    expect(fileMetadataResponse.headers["content-type"]).toBe("text/plain");
    expect(fileMetadataResponse.headers["etag"]).toBeDefined();
    expect(fileMetadataResponse.headers["last-modified"]).toBeDefined();
    expect(fileMetadataResponse.headers["surrogate-key"]).toBeDefined();
    expect(fileMetadataResponse.headers["cache-control"]).toBe("max-age=3600");
    expect(fileMetadataResponse.headers["surrogate-control"]).toBe(
      "max-age=604800",
    );
    expect(fileMetadataResponse.headers["content-length"]).toBe("5");
    expect(fileMetadataResponse.headers["date"]).toBeDefined();
  });

  it("should get file", async () => {
    const fileResponse = await nhostStorage.getFile(
      uuid1,
      {},
      {
        responseType: "text",
      },
    );
    expect(fileResponse.status).toBe(200);
    expect(fileResponse.data).toBeDefined();
    expect(fileResponse.headers).toBeDefined();
    expect(fileResponse.headers["content-type"]).toBe("text/plain");
    expect(fileResponse.headers["etag"]).toBeDefined();
    expect(fileResponse.headers["last-modified"]).toBeDefined();
    expect(fileResponse.headers["surrogate-key"]).toBeDefined();
    expect(fileResponse.headers["cache-control"]).toBe("max-age=3600");
    expect(fileResponse.headers["surrogate-control"]).toBe("max-age=604800");
    expect(fileResponse.headers["content-length"]).toBe("5");
    expect(fileResponse.headers["date"]).toBeDefined();
    expect(fileResponse.data).toBe("test1");
  });

  it("should not get file If-None-Match matches", async () => {
    try {
      await nhostStorage.getFile(
        uuid1,
        {},
        {
          responseType: "text",
          headers: {
            "If-None-Match": etag,
          },
        },
      );
      expect(true).toBe(false); // should not reach here
    } catch (error) {
      const axiosError = error as AxiosError;
      expect(axiosError.response?.status).toBe(304);
      expect(axiosError.response?.data).toBeDefined();
      expect(axiosError.response?.headers).toBeDefined();
      expect(axiosError.response?.headers["etag"]).toBe(etag);
      expect(axiosError.response?.headers["cache-control"]).toBe(
        "max-age=3600",
      );
      expect(axiosError.response?.headers["surrogate-control"]).toBe(
        "max-age=604800",
      );
      expect(axiosError.response?.headers["date"]).toBeDefined();
    }
  });

  it("should replace file", async () => {
    const fileResponse = await nhostStorage.replaceFile(uuid1, {
      file: new Blob(["test1 new"], { type: "text/plain" }),
      metadata: {
        name: "test1 new",
        metadata: {
          key1: "value1 new",
        },
      },
    });
    expect(fileResponse.status).toBe(200);
    expect(fileResponse.data.bucketId).toBe("default");
    expect(fileResponse.data.createdAt).toBeDefined();
    expect(fileResponse.data.etag).toBeDefined();
    expect(fileResponse.data.id).toBe(uuid1);
    expect(fileResponse.data.isUploaded).toBe(true);
    expect(fileResponse.data.metadata).toEqual({ key1: "value1 new" });
    expect(fileResponse.data.mimeType).toBe("text/plain");
    expect(fileResponse.data.name).toBe("test1 new");
    expect(fileResponse.data.size).toBe(9);
    expect(fileResponse.data.updatedAt).toBeDefined();
    expect(fileResponse.data.uploadedByUserId).toBeDefined();
  });

  it("should delete file", async () => {
    const fileResponse = await nhostStorage.deleteFile(uuid1);
    expect(fileResponse.status).toBe(204);
  });
});
