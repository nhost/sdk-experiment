import { createNhostClient } from "../lib/nhost/server"; // Adjust path if needed
import Link from "next/link";
import GuardedSSRClientInfo from "./GuardedSSRClientInfo"; // We'll create this

export default async function GuardedSSRPage() {
  const nhost = await createNhostClient();
  const session = nhost.getUserSession();

  // Middleware should have already redirected if no session,
  // but good practice to check if data is used.
  // For this page, we primarily demonstrate SSR access to the token.

  return (
    <div className="flex flex-col">
      <h1 className="text-3xl mb-6 gradient-text">Guarded Server-side Page</h1>
      <p className="mb-4">
        This page is primarily rendered server-side and is protected by
        middleware. You should only see this if you are authenticated.
      </p>

      <div className="glass-card p-6 mb-6">
        <h2 className="text-xl font-semibold mb-2">Server-Side Session Info</h2>
        <div className="profile-item">
          <strong>Access Token (from server):</strong>
          <pre
            className="mt-1 p-2 bg-gray-800 rounded text-xs break-all"
            style={{ fontFamily: "var(--font-geist-mono)" }}
          >
            {session?.accessToken ||
              "Not available (should not happen on guarded route)"}
          </pre>
        </div>
        <div className="profile-item mt-2">
          <strong>User ID (from server):</strong>
          <span
            className="ml-2"
            style={{ fontFamily: "var(--font-geist-mono)" }}
          >
            {session?.user?.id || "Not available"}
          </span>
        </div>
      </div>

      {/* Optional: Demonstrate client-side hooks */}
      <GuardedSSRClientInfo initialAccessToken={session?.accessToken} />

      <Link href="/" className="mt-6 text-blue-500 hover:underline">
        ← Back to Home
      </Link>
    </div>
  );
}
