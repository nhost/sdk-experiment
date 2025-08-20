import { createNhostClient } from "../lib/nhost/server";
import Link from "next/link";
import PublicSSRClientInfo from "./PublicSSRClientInfo"; // We'll create this

export default async function PublicSSRPage() {
  const nhost = await createNhostClient();
  const session = nhost.getUserSession();
  const isAuthenticatedOnServer = !!session;

  return (
    <div className="flex flex-col">
      <h1 className="text-3xl mb-6 gradient-text">Public Server-side Page</h1>
      <p className="mb-4">
        This page is primarily rendered server-side and is public. It shows auth
        state if available.
      </p>

      <div className="glass-card p-6 mb-6">
        <h2 className="text-xl font-semibold mb-2">Server-Side Session Info</h2>
        <div className="profile-item">
          <strong>User Authenticated (on server):</strong>
          <span className="ml-2">{isAuthenticatedOnServer ? "Yes" : "No"}</span>
        </div>
        <div className="profile-item mt-2">
          <strong>Access Token (from server):</strong>
          <pre
            className="mt-1 p-2 bg-gray-800 rounded text-xs break-all"
            style={{ fontFamily: "var(--font-geist-mono)" }}
          >
            {session?.accessToken || "Not available or not authenticated"}
          </pre>
        </div>
      </div>

      {/* Optional: Demonstrate client-side hooks */}
      <PublicSSRClientInfo
        initialIsAuthenticated={isAuthenticatedOnServer}
        initialAccessToken={session?.accessToken}
      />

      <Link href="/" className="mt-6 text-blue-500 hover:underline">
        ← Back to Home
      </Link>
    </div>
  );
}
