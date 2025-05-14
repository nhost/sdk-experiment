import { useState } from 'react';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import TabForm from '../components/TabForm';
import MagicLinkForm from '../components/MagicLinkForm';
import { useAuth } from '../lib/auth/AuthProvider';

export default function SignIn() {
  const { signIn, isAuthenticated } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(searchParams.get('error') || null);
  
  const magicLinkSent = searchParams.get('magic') === 'success';

  // If already authenticated, redirect to profile
  if (isAuthenticated) {
    return <Navigate to="/profile" />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await signIn(email, password);
      
      if (response.error) {
        setError(response.error.message || 'Failed to sign in');
      } else if (response.body?.mfa) {
        // Handle MFA if implemented
        navigate(`/signin/mfa?ticket=${response.body.mfa.ticket}`);
      } else {
        // Successfully signed in
        navigate('/profile');
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-3xl mb-6 gradient-text">Nhost SDK Demo</h1>

      <div className="glass-card w-full p-8 mb-6">
        <h2 className="text-2xl mb-6">Sign In</h2>

        {magicLinkSent ? (
          <div className="text-center">
            <p className="mb-4">
              Magic link sent! Check your email to sign in.
            </p>
            <Link to="/signin" className="btn btn-secondary">
              Back to sign in
            </Link>
          </div>
        ) : (
          <TabForm
            passwordTabContent={
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="email">Email</label>
                  <input 
                    id="email" 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                  />
                </div>

                <div>
                  <label htmlFor="password">Password</label>
                  <input 
                    id="password" 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                  />
                </div>

                {error && (
                  <div className="alert alert-error">
                    {error}
                  </div>
                )}

                <button 
                  type="submit" 
                  className="btn btn-primary w-full"
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </button>
              </form>
            }
            magicTabContent={
              <div>
                <MagicLinkForm
                  buttonLabel="Sign in with Magic Link"
                />
              </div>
            }
          />
        )}
      </div>

      <div className="mt-4">
        <p>
          Don&apos;t have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}