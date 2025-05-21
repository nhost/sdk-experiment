import { test, expect } from "@jest/globals";
import { createClient } from "../../";
import { FetchError } from "../../fetch";

test("error handling for graphql", async () => {
  const subdomain = "local";
  const region = "local";

  //#region errorHandling
  // Needs the following imports:
  //
  // import { FetchError } from "@nhost/nhost-js/fetch";
  //

  const nhost = createClient({
    subdomain,
    region,
  });

  try {
    await nhost.functions.fetch("/crash", {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    });
  } catch (error) {
    const resp = error as FetchError<string>;
    console.log("Error:", resp);
    // Error: {
    //   status: 500,
    //   body: '<!DOCTYPE html>\n' +
    //     '<html lang="en">\n' +
    //     '<head>\n' +
    //     '<meta charset="utf-8">\n' +
    //     '<title>Error</title>\n' +
    //     '</head>\n' +
    //     '<body>\n' +
    //     '<pre>Error: This is an unhandled error<br> &nbsp; &nbsp;at default (/opt/project/functions/crash.ts:4:11)<br> &nbsp; &nbsp;at Layer.handle [as handle_request] (/usr/local/lib/node_modules/express/lib/router/layer.js:95:5)<br> &nbsp; &nbsp;at next (/usr/local/lib/node_modules/express/lib/router/route.js:144:13)<br> &nbsp; &nbsp;at next (/usr/local/lib/node_modules/express/lib/router/route.js:140:7)<br> &nbsp; &nbsp;at next (/usr/local/lib/node_modules/express/lib/router/route.js:140:7)<br> &nbsp; &nbsp;at next (/usr/local/lib/node_modules/express/lib/router/route.js:140:7)<br> &nbsp; &nbsp;at next (/usr/local/lib/node_modules/express/lib/router/route.js:140:7)<br> &nbsp; &nbsp;at next (/usr/local/lib/node_modules/express/lib/router/route.js:140:7)<br> &nbsp; &nbsp;at next (/usr/local/lib/node_modules/express/lib/router/route.js:140:7)<br> &nbsp; &nbsp;at next (/usr/local/lib/node_modules/express/lib/router/route.js:140:7)</pre>\n' +
    //     '</body>\n' +
    //     '</html>\n',
    //   headers: Headers {
    //     'content-length': '1055',
    //     'content-security-policy': "default-src 'none'",
    //     'content-type': 'text/html; charset=utf-8',
    //     date: 'Tue, 13 May 2025 11:20:04 GMT',
    //     'x-content-type-options': 'nosniff'
    //   }
    // }
    //
    // error handling...
    //#endregion errorHandling

    expect(resp.status).toBe(500);
    expect(resp.headers.get("content-type")).toBe("text/html; charset=utf-8");
    expect(resp.headers.get("content-length")).toBe("1055");
    expect(resp.body).toBeDefined();
  }
});
