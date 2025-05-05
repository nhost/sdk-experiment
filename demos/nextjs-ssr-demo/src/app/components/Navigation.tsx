import { createServerNhostClient } from '../lib/nhost/ssr';
import SignOutButton from './SignOutButton';
import ActiveLink from './ActiveLink';

export default async function Navigation() {
  const nhost = await createServerNhostClient();
  const session = nhost.getUserSession();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="flex items-center">
          <span className="navbar-brand">Nhost Demo</span>
          <div className="navbar-links">
            {session ? (
              <>
                <ActiveLink 
                  href="/profile" 
                  className="nav-link"
                >
                  Profile
                </ActiveLink>
                <ActiveLink 
                  href="/upload" 
                  className="nav-link"
                >
                  Upload
                </ActiveLink>
              </>
            ) : (
              <>
                <ActiveLink 
                  href="/" 
                  className="nav-link"
                >
                  Sign Up
                </ActiveLink>
                <ActiveLink 
                  href="/signin" 
                  className="nav-link"
                >
                  Sign In
                </ActiveLink>
              </>
            )}
          </div>
        </div>

        {session && (
          <SignOutButton />
        )}
      </div>
    </nav>
  );
} 