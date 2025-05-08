import {
  createAPIClient as createAuthClient,
  type SessionPayload,
  MemoryStorage,
  createTokenRefreshChain,
} from "../auth";
import {
  createAPIClient as createStorageClient,
  type UploadFiles201,
  type FetchResponse,
  type Error,
} from "../storage";

// Configure axios for testing

describe("Test Storage API", () => {
  const nhostAuth = createAuthClient("https://local.auth.local.nhost.run/v1");

  const storage = new MemoryStorage();

  const nhostStorage = createStorageClient(
    "https://local.storage.local.nhost.run/v1",
    [createTokenRefreshChain(nhostAuth, { storage })],
  );

  it("should sign up a user with email and password", async () => {
    const response = await nhostAuth.signUpEmailPassword({
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
    expect(response.status).toBe(200);

    const data = response.data as SessionPayload;
    if (!data.session) {
      throw new Error("Session is undefined");
    }

    storage.set(data.session);
  });

  const uuid1 = crypto.randomUUID();
  const uuid2 = crypto.randomUUID();

  it("should upload a file", async () => {
    const resp = await nhostStorage.uploadFiles({
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

    const data = resp.data as UploadFiles201;
    expect(data.processedFiles).toBeDefined();
    expect(data.processedFiles?.[0]?.bucketId).toBe("default");
    expect(data.processedFiles?.[0]?.createdAt).toBeDefined();
    expect(data.processedFiles?.[0]?.etag).toBeDefined();
    expect(data.processedFiles?.[0]?.id).toBe(uuid1);
    expect(data.processedFiles?.[0]?.isUploaded).toBe(true);
    expect(data.processedFiles?.[0]?.metadata).toEqual({
      key1: "value1",
    });
    expect(data.processedFiles?.[0]?.mimeType).toBe("text/plain");
    expect(data.processedFiles?.[0]?.name).toBe("test1");
    expect(data.processedFiles?.[0]?.size).toBe(5);
    expect(data.processedFiles?.[0]?.updatedAt).toBeDefined();
    expect(data.processedFiles?.[0]?.uploadedByUserId).toBeDefined();
    expect(data.processedFiles?.[1]?.bucketId).toBe("default");
    expect(data.processedFiles?.[1]?.createdAt).toBeDefined();
    expect(data.processedFiles?.[1]?.etag).toBeDefined();
    expect(data.processedFiles?.[1]?.id).toBe(uuid2);
    expect(data.processedFiles?.[1]?.isUploaded).toBe(true);
    expect(data.processedFiles?.[1]?.metadata).toEqual({
      key2: "value2",
    });
    expect(data.processedFiles?.[1]?.mimeType).toBe("text/plain");
    expect(data.processedFiles?.[1]?.name).toBe("test2");
    expect(data.processedFiles?.[1]?.size).toBe(15);
    expect(data.processedFiles?.[1]?.updatedAt).toBeDefined();
    expect(data.processedFiles?.[1]?.uploadedByUserId).toBeDefined();
  });

  it("upload fails", async () => {
    try {
      await nhostStorage.uploadFiles({
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
      });
    } catch (error) {
      const err = error as FetchResponse<Error>;

      expect(err).toBeDefined();
      expect(err.status).toBe(400);
      expect(err.data).toBeDefined();
      expect(err.data.error?.message).toBe(
        "file[] not found in Multipart form",
      );
      expect(err.headers["content-length"]).toBe("58");
      expect(err.headers["content-type"]).toBe(
        "application/json; charset=utf-8",
      );
      expect(err.headers["date"]).toBeDefined();
    }
  });

  it("upload fails", async () => {
    try {
      const resp = await nhostStorage.uploadFiles({
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
      });
      if (resp.status !== 200) {
        // handle error
      }
    } catch (error) {
      const err = error as FetchResponse<Error>;

      expect(err).toBeDefined();
      expect(err.status).toBe(400);
      expect(err.data).toBeDefined();
      expect(err.data.error?.message).toBe(
        "file[] not found in Multipart form",
      );
      expect(err.headers["content-length"]).toBe("58");
      expect(err.headers["content-type"]).toBe(
        "application/json; charset=utf-8",
      );
      expect(err.headers["date"]).toBeDefined();
    }
  });

  let etag: string;

  it("should get file metadata headers", async () => {
    const resp = await nhostStorage.getFileMetadataHeaders(uuid1);

    expect(resp.status).toBe(200);
    expect(resp.headers["content-type"]).toBe("text/plain");
    expect(resp.headers["etag"]).toBeDefined();
    expect(resp.headers["last-modified"]).toBeDefined();
    expect(resp.headers["surrogate-key"]).toBeDefined();
    expect(resp.headers["cache-control"]).toBe("max-age=3600");
    expect(resp.headers["surrogate-control"]).toBe("max-age=604800");
    expect(resp.headers["content-length"]).toBe("5");
    expect(resp.headers["date"]).toBeDefined();

    etag = resp.headers["etag"];
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
      const err = error as FetchResponse<Error>;
      expect(err).toBeDefined();
      expect(err.status).toBe(304);
      expect(err.headers).toBeDefined();
      expect(err.headers["etag"]).toBe(etag);
      expect(err.headers["cache-control"]).toBe("max-age=3600");
      expect(err.headers["surrogate-control"]).toBe("max-age=604800");
      expect(err.headers["date"]).toBeDefined();
    }
  });

  it("should get file metadata headers with If-None-Match does not match", async () => {
    const resp = await nhostStorage.getFileMetadataHeaders(
      uuid1,
      {},
      {
        headers: {
          "If-None-Match": "wrong-etag",
        },
      },
    );
    expect(resp.status).toBe(200);
    expect(resp.headers).toBeDefined();
    expect(resp.headers["content-type"]).toBe("text/plain");
    expect(resp.headers["etag"]).toBeDefined();
    expect(resp.headers["last-modified"]).toBeDefined();
    expect(resp.headers["surrogate-key"]).toBeDefined();
    expect(resp.headers["cache-control"]).toBe("max-age=3600");
    expect(resp.headers["surrogate-control"]).toBe(
      "max-age=604800",
    );
    expect(resp.headers["content-length"]).toBe("5");
    expect(resp.headers["date"]).toBeDefined();
  });

  it("should get file", async () => {
    const resp = await nhostStorage.getFile(
      uuid1,
      {},
    );
    expect(resp.status).toBe(200);
    expect(resp.data).toBeDefined();
    expect(resp.headers).toBeDefined();
    expect(resp.headers["content-type"]).toBe("text/plain");
    expect(resp.headers["etag"]).toBeDefined();
    expect(resp.headers["last-modified"]).toBeDefined();
    expect(resp.headers["surrogate-key"]).toBeDefined();
    expect(resp.headers["cache-control"]).toBe("max-age=3600");
    expect(resp.headers["surrogate-control"]).toBe("max-age=604800");
    expect(resp.headers["content-length"]).toBe("5");
    expect(resp.headers["date"]).toBeDefined();
    expect(resp.data).toBe("test1");
  });

  // it("should not get file If-None-Match matches", async () => {
  //   try {
  //     await nhostStorage.getFile(
  //       uuid1,
  //       {},
  //       {
  //         responseType: "text",
  //         headers: {
  //           "If-None-Match": etag,
  //         },
  //       },
  //     );
  //     expect(true).toBe(false); // should not reach here
  //   } catch (error) {
  //     const axiosError = error as AxiosError;
  //     expect(axiosError.response?.status).toBe(304);
  //     expect(axiosError.response?.data).toBeDefined();
  //     expect(axiosError.response?.headers).toBeDefined();
  //     expect(axiosError.response?.headers["etag"]).toBe(etag);
  //     expect(axiosError.response?.headers["cache-control"]).toBe(
  //       "max-age=3600",
  //     );
  //     expect(axiosError.response?.headers["surrogate-control"]).toBe(
  //       "max-age=604800",
  //     );
  //     expect(axiosError.response?.headers["date"]).toBeDefined();
  //   }
  // });

  // it("should replace file", async () => {
  //   const fileResponse = await nhostStorage.replaceFile(uuid1, {
  //     file: new Blob(["test1 new"], { type: "text/plain" }),
  //     metadata: {
  //       name: "test1 new",
  //       metadata: {
  //         key1: "value1 new",
  //       },
  //     },
  //   });
  //   expect(fileResponse.status).toBe(200);
  //   expect(fileResponse.data.bucketId).toBe("default");
  //   expect(fileResponse.data.createdAt).toBeDefined();
  //   expect(fileResponse.data.etag).toBeDefined();
  //   expect(fileResponse.data.id).toBe(uuid1);
  //   expect(fileResponse.data.isUploaded).toBe(true);
  //   expect(fileResponse.data.metadata).toEqual({ key1: "value1 new" });
  //   expect(fileResponse.data.mimeType).toBe("text/plain");
  //   expect(fileResponse.data.name).toBe("test1 new");
  //   expect(fileResponse.data.size).toBe(9);
  //   expect(fileResponse.data.updatedAt).toBeDefined();
  //   expect(fileResponse.data.uploadedByUserId).toBeDefined();
  // });

  // it("should delete file", async () => {
  //   const fileResponse = await nhostStorage.deleteFile(uuid1);
  //   expect(fileResponse.status).toBe(204);
  // });
});
