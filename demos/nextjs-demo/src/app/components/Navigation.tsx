'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useNhost } from '../lib/nhost-provider';
import { useState } from 'react';

export default function Navigation() {
  const { session, signout } = useNhost();
  const pathname = usePathname();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const isActive = (path: string) => {
    return pathname === path;
  };

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      signout();
      router.push('/signin');
    } catch (err) {
      console.error('Error signing out:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="flex items-center">
          <span className="navbar-brand">Nhost Demo</span>
          <div className="navbar-links">
            {session ? (
              <>
                <Link 
                  href="/profile" 
                  className={`nav-link ${isActive('/profile') ? 'active' : ''}`}
                >
                  Profile
                </Link>
                <Link 
                  href="/upload" 
                  className={`nav-link ${isActive('/upload') ? 'active' : ''}`}
                >
                  Upload
                </Link>
              </>
            ) : (
              <>
                <Link 
                  href="/" 
                  className={`nav-link ${isActive('/') ? 'active' : ''}`}
                >
                  Sign Up
                </Link>
                <Link 
                  href="/signin" 
                  className={`nav-link ${isActive('/signin') ? 'active' : ''}`}
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>

        {session && (
          <div>
            <button
              onClick={handleSignOut}
              disabled={isLoading}
              className="icon-button"
              title="Sign Out"
            >
              {isLoading ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M12 6v6"></path>
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
              )}
            </button>
          </div>
        )}
      </div>
    </nav>
  );
} 