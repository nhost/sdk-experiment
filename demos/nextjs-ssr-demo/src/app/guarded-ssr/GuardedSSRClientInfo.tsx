"use client";

import { createNhostClient } from "../lib/nhost/client";

export default function GuardedSSRClientInfo({
  initialAccessToken,
}: {
  initialAccessToken?: string;
}) {
  const nhost = createNhostClient();
  const session = nhost.getUserSession();

  const { accessToken } = session || {};

  return (
    <div className="glass-card p-6">
      <h2 className="text-xl font-semibold mb-2">
        Client-Side Hook Info (on SSR Page)
      </h2>
      <div className="profile-item">
        <strong>Access Token (from client hook):</strong>
        <pre
          className="mt-1 p-2 bg-gray-800 rounded text-xs break-all"
          style={{ fontFamily: "var(--font-geist-mono)" }}
        >
          {accessToken || "Loading or not available..."}
        </pre>
      </div>
      <p className="text-xs mt-2 text-gray-400">
        (Server initially provided an access token:{" "}
        {initialAccessToken ? "Yes" : "No"})
      </p>
    </div>
  );
}
