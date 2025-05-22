"use client";

import { createNhostClient } from "../lib/nhost/client";
import Link from "next/link";

export default function PublicCSRPage() {
  const nhost = createNhostClient();
  const session = nhost.getUserSession();

  const { accessToken } = session || {};
  const isAuthenticated = !!session;

  return (
    <div className="flex flex-col">
      <h1 className="text-3xl mb-6 gradient-text">Public Client-side Page</h1>
      <p className="mb-4">
        This page is rendered client-side and is public. It shows auth state if
        available.
      </p>

      <div className="glass-card p-6 mb-6">
        <h2 className="text-xl font-semibold mb-2">
          Authentication Status (Client Hooks)
        </h2>
        <div className="profile-item">
          <strong>User Authenticated:</strong>
          <span className="ml-2">{isAuthenticated ? "Yes" : "No"}</span>
        </div>
        <div className="profile-item mt-2">
          <strong>Access Token:</strong>
          <pre
            className="mt-1 p-2 bg-gray-800 rounded text-xs break-all"
            style={{ fontFamily: "var(--font-geist-mono)" }}
          >
            {accessToken || "Not available or not authenticated"}
          </pre>
        </div>
      </div>

      <Link href="/" className="text-blue-500 hover:underline">
        ← Back to Home
      </Link>
    </div>
  );
}
