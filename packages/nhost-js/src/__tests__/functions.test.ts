import {
  createAPIClient as createAuthClient,
  type SessionPayload,
} from "../auth";
import { MemoryStorage } from "../sessionStorage";
import { createSessionRefreshMiddleware } from "../middlewareRefreshSession";
import { createAttachAccessTokenMiddleware } from "../middlewareAttachToken";
import {
  createAPIClient as createFunctionClient,
  type FetchResponse,
} from "../functions";

describe("Test Storage API", () => {
  const nhostAuth = createAuthClient("https://local.auth.local.nhost.run/v1");

  const storage = new MemoryStorage();

  const nhostFunctions = createFunctionClient(
    "https://local.functions.local.nhost.run/v1",
    [
      createSessionRefreshMiddleware(nhostAuth, storage),
      createAttachAccessTokenMiddleware(storage),
    ],
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

    const body = response.body as SessionPayload;
    if (!body.session) {
      throw new Error("Session is undefined");
    }

    storage.set(body.session);
  });

  it("text/plain (default) returns string", async () => {
    const resp = await nhostFunctions.fetch("/echo", {
      method: "POST",
      body: JSON.stringify({
        message: "Hello, world!",
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    expect(resp.status).toBe(200);
    expect(resp!.headers.get("content-type")).toBe("text/plain");
    expect(resp!.headers.get("content-encoding")).toBe("gzip");
    expect(resp!.body).toMatch(
      /"method":POST\n.*"headers":{"host":"local.functions.local.nhost.run","user-agent":"node","content-length":".*","accept":"\*\/\*","accept-encoding":"br, gzip, deflate","accept-language":"\*","authorization":"Bearer .*","content-type":"application\/json","sec-fetch-mode":"cors","x-forwarded-for":".*","x-forwarded-host":"local.functions.local.nhost.run","x-forwarded-port":"443","x-forwarded-proto":"https","x-forwarded-server":".*","x-real-ip":".*","x-replaced-path":"\/v1\/echo"}\n.*"body":{"message":"Hello, world!"}/,
    );
  });

  it("text/plain (specified) returns string", async () => {
    const resp = await nhostFunctions.fetch("/echo", {
      method: "POST",
      body: JSON.stringify({
        message: "Hello, world!",
      }),
      headers: {
        Accept: "text/plain",
        "Content-Type": "application/json",
      },
    });

    expect(resp.status).toBe(200);
    expect(resp!.headers.get("content-type")).toBe("text/plain");
    expect(resp!.headers.get("content-encoding")).toBe("gzip");
    expect(resp!.body).toMatch(
      /"method":POST\n.*"headers":{"host":"local.functions.local.nhost.run","user-agent":"node","content-length":".*","accept":"text\/plain","accept-encoding":"br, gzip, deflate","accept-language":"\*","authorization":"Bearer .*","content-type":"application\/json","sec-fetch-mode":"cors","x-forwarded-for":".*","x-forwarded-host":"local.functions.local.nhost.run","x-forwarded-port":"443","x-forwarded-proto":"https","x-forwarded-server":".*","x-real-ip":".*","x-replaced-path":"\/v1\/echo"}\n.*"body":{"message":"Hello, world!"}/,
    );
  });

  it("application/json returns object", async () => {
    const resp = await nhostFunctions.fetch("/echo", {
      method: "POST",
      body: JSON.stringify({
        message: "Hello, world!",
      }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    expect(resp.status).toBe(200);
    expect(resp!.headers.get("content-type")).toBe("application/json");
    expect(resp!.headers.get("content-encoding")).toBe("gzip");
    expect(resp!.body.method).toBe("POST");
    expect(resp!.body.body).toEqual({
      message: "Hello, world!",
    });
    expect(resp!.body.headers.accept).toBe("application/json");
    expect(resp!.body.headers["authorization"]).toBeDefined();
    expect(resp!.body.headers["accept-encoding"]).toBe("br, gzip, deflate");
    expect(resp!.body.headers["accept-language"]).toBe("*");
    expect(resp!.body.headers["content-length"]).toBe("27");
    expect(resp!.body.headers["content-type"]).toBe("application/json");
    expect(resp!.body.headers.host).toBe("local.functions.local.nhost.run");
    expect(resp!.body.headers["sec-fetch-mode"]).toBe("cors");
    expect(resp!.body.headers["user-agent"]).toBe("node");
    expect(resp!.body.headers["x-forwarded-host"]).toBe(
      "local.functions.local.nhost.run",
    );
    expect(resp!.body.headers["x-forwarded-port"]).toBe("443");
    expect(resp!.body.headers["x-forwarded-proto"]).toBe("https");
    expect(resp!.body.headers["x-replaced-path"]).toBe("/v1/echo");
  });

  it("application/octet-stream returns blob", async () => {
    const resp = await nhostFunctions.fetch("/echo", {
      method: "POST",
      headers: {
        Accept: "application/octet-stream",
      },
    });

    expect(resp.status).toBe(200);
    expect(resp!.headers.get("content-type")).toBe("application/octet-stream");
    expect(resp!.headers.get("content-length")).toBe("29");
    expect(resp!.headers.get("content-encoding")).toBe("gzip");
    const body = resp.body as Blob;
    expect(await body.text()).toBe("beep-boop");
  });

  it("error handling", async () => {
    try {
      await nhostFunctions.fetch("/crash", {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
      });
      expect(true).toBe(false);
    } catch (err) {
      const resp = err as FetchResponse<any>;
      expect(resp.status).toBe(500);
      expect(resp.headers.get("content-type")).toBe("text/html; charset=utf-8");
      expect(resp.headers.get("content-length")).toBe("1056");
      expect(resp.body).toBeDefined();
    }
  });
});
