"use client";

import { createNhostClient } from "../lib/nhost/client";

interface Props {
  initialIsAuthenticated: boolean;
  initialAccessToken?: string;
}

export default function PublicSSRClientInfo({
  initialIsAuthenticated,
  initialAccessToken,
}: Props) {
  const nhost = createNhostClient();
  // FIXME: use hooks, bc throws error
  //  ⨯ ReferenceError: document is not defined
  //     at CookieStorage.get (../../packages/nhost-js/src/sessionStorage.ts:152:20)
  //     at NhostClient.getUserSession (../../packages/nhost-js/src/index.ts:233:31)
  //     at PublicSSRClientInfo (src/app/public-ssr/PublicSSRClientInfo.tsx:15:24)
  //   150 |    */
  //   151 |   get(): Session | null {
  // > 152 |     const cookies = document.cookie.split(";");
  //       |                    ^
  //   153 |     for (const cookie of cookies) {
  //   154 |       const [name, value] = cookie.trim().split("=");
  //   155 |       if (name === this.cookieName) { {
  const session = nhost.getUserSession();

  const { accessToken } = session || {};

  return (
    <div className="glass-card p-6">
      <h2 className="text-xl font-semibold mb-2">
        Client-Side Hook Info (on Public SSR Page)
      </h2>
      <div className="profile-item">
        <strong>User Authenticated (from client hook):</strong>
        <span className="ml-2">{session ? "Yes" : "No"}</span>
      </div>
      <div className="profile-item mt-2">
        <strong>Access Token (from client hook):</strong>
        <pre
          className="mt-1 p-2 bg-gray-800 rounded text-xs break-all"
          style={{ fontFamily: "var(--font-geist-mono)" }}
        >
          {accessToken || "Not available or not authenticated"}
        </pre>
      </div>
      <p className="text-xs mt-2 text-gray-400">
        (Server initially reported authenticated:{" "}
        {initialIsAuthenticated ? "Yes" : "No"}, and token:{" "}
        {initialAccessToken ? "Exists" : "Absent"})
      </p>
    </div>
  );
}
