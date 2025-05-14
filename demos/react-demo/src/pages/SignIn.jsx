import { useState } from "react";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import TabForm from "../components/TabForm";
import MagicLinkForm from "../components/MagicLinkForm";
import { useAuth } from "../lib/auth/AuthProvider";
import { nhost } from "../lib/nhost/client";

export default function SignIn() {
  const { signIn, isAuthenticated } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(searchParams.get("error") || null);

  const magicLinkSent = searchParams.get("magic") === "success";

  // If already authenticated, redirect to profile
  // Don't redirect immediately if this is part of an auth flow (coming from verification)
  const isVerifying = searchParams.has("fromVerify");

  if (isAuthenticated && !isVerifying && !isLoading) {
    setTimeout(() => {
      navigate("/profile");
    }, 0);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await nhost.auth.signInEmailPassword({
        email,
        password,
      });

      // Check if MFA is required
      if (response.body?.mfa) {
        // Redirect to MFA verification page with the ticket
        navigate(`/signin/mfa?ticket=${response.body.mfa.ticket}`);
        return;
      }

      // Check for errors in the response
      if (response.error) {
        setError(response.error.message || "Failed to sign in");
        return;
      }

      // If we have a session, sign in was successful
      if (response.body?.session) {
        navigate("/profile");
      } else {
        setError("Failed to sign in");
      }
    } catch (err) {
      setError(err.message || "An error occurred");
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

                {error && <div className="alert alert-error">{error}</div>}

                <button
                  type="submit"
                  className="btn btn-primary w-full"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing In..." : "Sign In"}
                </button>
              </form>
            }
            magicTabContent={
              <div>
                <MagicLinkForm buttonLabel="Sign in with Magic Link" />
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
