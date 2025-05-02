import { createServerNhostClient } from '../lib/nhost/ssr';

export default async function Profile() {
  // Create the client with async cookie access
  const nhost = await createServerNhostClient();
  const session = nhost.getUserSession();

  return (
    <div className="flex flex-col">
      <h1 className="text-3xl mb-6 gradient-text">Your Profile</h1>

      <div className="glass-card p-8 mb-6">
        <div className="space-y-5">
          <div className="profile-item">
            <strong>Display Name:</strong>
            <span className="ml-2">{session?.user?.displayName || 'Not set'}</span>
          </div>

          <div className="profile-item">
            <strong>Email:</strong>
            <span className="ml-2">{session?.user?.email || 'Not available'}</span>
          </div>

          <div className="profile-item">
            <strong>User ID:</strong>
            <span className="ml-2" style={{ fontFamily: 'var(--font-geist-mono)', fontSize: '0.875rem' }}>
              {session?.user?.id || 'Not available'}
            </span>
          </div>

          <div className="profile-item">
            <strong>Roles:</strong>
            <span className="ml-2">{session?.user?.roles?.join(', ') || 'None'}</span>
          </div>

          <div className="profile-item">
            <strong>Email Verified:</strong>
            <span className="ml-2">{session?.user?.emailVerified ? 'Yes' : 'No'}</span>
          </div>
        </div>
      </div>

      <div className="glass-card p-8">
        <h3 className="text-xl mb-4">Session Information</h3>
        <pre>
          {JSON.stringify(
            {
              refreshTokenId: session?.refreshTokenId,
              accessTokenExpiresIn: session?.accessTokenExpiresIn
            },
            null,
            2
          )}
        </pre>
      </div>
    </div>
  );
}
