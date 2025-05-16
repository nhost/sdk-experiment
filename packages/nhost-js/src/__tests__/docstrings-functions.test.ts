import { createClient } from "../";
import { FetchResponse } from "../functions";

test("error handling for graphql", async () => {
  const subdomain = "local";
  const region = "local";

  //#region errorHandling
  // Needs the following imports:
  //
  // import { FetchResponse } from "../functions";
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
    const resp = error as FetchResponse<any>;
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
    //     'content-length': '1056',
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
    expect(resp.headers.get("content-length")).toBe("1056");
    expect(resp.body).toBeDefined();
  }
});
