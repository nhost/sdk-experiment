import { describe, beforeAll, it, expect } from "@jest/globals";
import { createAPIClient as createAuthClient, SessionPayload } from "../auth";
import { MemoryStorage } from "../sessionStorage";
import { createSessionRefreshMiddleware } from "../middlewareRefreshSession";
import { createAttachAccessTokenMiddleware } from "../middlewareAttachToken";
import {
  createAPIClient as createStorageClient,
  type FetchResponse,
  type ErrorResponse,
  UploadFiles201,
  FileMetadata,
} from "../storage";

describe("Test Storage API", () => {
  const nhostAuth = createAuthClient("https://local.auth.local.nhost.run/v1");

  const storage = new MemoryStorage();

  const nhostStorage = createStorageClient(
    "https://local.storage.local.nhost.run/v1",
    [
      createSessionRefreshMiddleware(nhostAuth, storage),
      createAttachAccessTokenMiddleware(storage),
    ],
  );

  beforeAll(async () => {
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

    if (response.status !== 200) {
      throw new Error("Failed to sign up");
    }

    const payload = response.body as SessionPayload;
    if (!payload.session) {
      throw new Error("Session not found in response");
    }

    storage.set(payload.session);
  });

  const uuid1 = crypto.randomUUID();
  const uuid2 = crypto.randomUUID();

  it("should get version", async () => {
    const resp = await nhostStorage.getVersion();

    expect(resp.status).toBe(200);
    expect(resp.body).toBeDefined();
    expect(resp.body.buildVersion).toBe("0.7.1");
  });

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

    if (resp.status !== 200) {
      throw new Error("Failed to upload files");
    }

    const payload = resp.body as UploadFiles201;

    expect(payload.processedFiles).toBeDefined();
    expect(payload.processedFiles?.[0]?.bucketId).toBe("default");
    expect(payload.processedFiles?.[0]?.createdAt).toBeDefined();
    expect(payload.processedFiles?.[0]?.etag).toBeDefined();
    expect(payload.processedFiles?.[0]?.id).toBe(uuid1);
    expect(payload.processedFiles?.[0]?.isUploaded).toBe(true);
    expect(payload.processedFiles?.[0]?.metadata).toEqual({
      key1: "value1",
    });
    expect(payload.processedFiles?.[0]?.mimeType).toBe("text/plain");
    expect(payload.processedFiles?.[0]?.name).toBe("test1");
    expect(payload.processedFiles?.[0]?.size).toBe(5);
    expect(payload.processedFiles?.[0]?.updatedAt).toBeDefined();
    expect(payload.processedFiles?.[0]?.uploadedByUserId).toBeDefined();
    expect(payload.processedFiles?.[1]?.bucketId).toBe("default");
    expect(payload.processedFiles?.[1]?.createdAt).toBeDefined();
    expect(payload.processedFiles?.[1]?.etag).toBeDefined();
    expect(payload.processedFiles?.[1]?.id).toBe(uuid2);
    expect(payload.processedFiles?.[1]?.isUploaded).toBe(true);
    expect(payload.processedFiles?.[1]?.metadata).toEqual({
      key2: "value2",
    });
    expect(payload.processedFiles?.[1]?.mimeType).toBe("text/plain");
    expect(payload.processedFiles?.[1]?.name).toBe("test2");
    expect(payload.processedFiles?.[1]?.size).toBe(15);
    expect(payload.processedFiles?.[1]?.updatedAt).toBeDefined();
    expect(payload.processedFiles?.[1]?.uploadedByUserId).toBeDefined();
  });

  it("upload fails", async () => {
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

    expect(resp.status).toBe(400);
    expect(resp.headers.get("content-length")).toBe("58");
    expect(resp.headers.get("content-type")).toBe(
      "application/json; charset=utf-8",
    );
    expect(resp.headers.get("date")).toBeDefined();

    const err = resp.body as ErrorResponse;
    expect(err.error?.message).toBe("file[] not found in Multipart form");
  });

  let etag: string;

  it("should get file metadata headers", async () => {
    const resp = await nhostStorage.getFileMetadataHeaders(uuid1);

    expect(resp.status).toBe(200);
    expect(resp.headers.get("content-type")).toBe("text/plain");
    expect(resp.headers.get("etag")).toBeDefined();
    expect(resp.headers.get("last-modified")).toBeDefined();
    expect(resp.headers.get("surrogate-key")).toBeDefined();
    expect(resp.headers.get("cache-control")).toBe("max-age=3600");
    expect(resp.headers.get("surrogate-control")).toBe("max-age=604800");
    expect(resp.headers.get("content-length")).toBe("5");
    expect(resp.headers.get("date")).toBeDefined();

    etag = resp.headers.get("etag") || "";
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
      expect(err.headers.get("etag")).toBe(etag);
      expect(err.headers.get("cache-control")).toBe("max-age=3600");
      expect(err.headers.get("surrogate-control")).toBe("max-age=604800");
      expect(err.headers.get("date")).toBeDefined();
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
    expect(resp.headers.get("content-type")).toBe("text/plain");
    expect(resp.headers.get("etag")).toBeDefined();
    expect(resp.headers.get("last-modified")).toBeDefined();
    expect(resp.headers.get("surrogate-key")).toBeDefined();
    expect(resp.headers.get("cache-control")).toBe("max-age=3600");
    expect(resp.headers.get("surrogate-control")).toBe("max-age=604800");
    expect(resp.headers.get("content-length")).toBe("5");
    expect(resp.headers.get("date")).toBeDefined();
  });

  it("should get file", async () => {
    const resp = await nhostStorage.getFile(uuid1, {});
    expect(resp.status).toBe(200);
    expect(resp.body).toBeDefined();
    expect(resp.headers).toBeDefined();
    expect(resp.headers.get("content-type")).toBe("text/plain");
    expect(resp.headers.get("etag")).toBeDefined();
    expect(resp.headers.get("last-modified")).toBeDefined();
    expect(resp.headers.get("surrogate-key")).toBeDefined();
    expect(resp.headers.get("cache-control")).toBe("max-age=3600");
    expect(resp.headers.get("surrogate-control")).toBe("max-age=604800");
    expect(resp.headers.get("content-length")).toBe("5");
    expect(resp.headers.get("date")).toBeDefined();

    if (resp.status !== 200) {
      throw new Error("Failed to get file");
    }
    const payload = resp.body as Blob;

    expect(await payload.text()).toBe("test1");
  });

  it("should not get file If-None-Match matches", async () => {
    try {
      await nhostStorage.getFile(
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
      expect(err.status).toBe(304);
      expect(err.body).toBeDefined();
      expect(err.headers).toBeDefined();
      expect(err.headers.get("etag")).toBe(etag);
      expect(err.headers.get("cache-control")).toBe("max-age=3600");
      expect(err.headers.get("surrogate-control")).toBe("max-age=604800");
      expect(err.headers.get("date")).toBeDefined();
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

    if (fileResponse.status !== 200) {
      throw new Error("Failed to replace file");
    }

    const payload = fileResponse.body as FileMetadata;

    expect(fileResponse.status).toBe(200);
    expect(payload.bucketId).toBe("default");
    expect(payload.createdAt).toBeDefined();
    expect(payload.etag).toBeDefined();
    expect(payload.id).toBe(uuid1);
    expect(payload.isUploaded).toBe(true);
    expect(payload.metadata).toEqual({ key1: "value1 new" });
    expect(payload.mimeType).toBe("text/plain");
    expect(payload.name).toBe("test1 new");
    expect(payload.size).toBe(9);
    expect(payload.updatedAt).toBeDefined();
    expect(payload.uploadedByUserId).toBeDefined();
  });

  it("should delete file", async () => {
    const fileResponse = await nhostStorage.deleteFile(uuid1);
    expect(fileResponse.status).toBe(204);
  });
});
