import { useState, JSX } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import TabForm from "../components/TabForm";
import MagicLinkForm from "../components/MagicLinkForm";
import { useAuth } from "../lib/nhost/AuthProvider";
import { FetchResponse, ErrorResponse } from "@nhost/nhost-js/auth";

export default function SignUp(): JSX.Element {
  const { nhost, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [displayName, setDisplayName] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // If already authenticated, redirect to profile
  if (isAuthenticated) {
    return <Navigate to="/profile" />;
  }

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await nhost.auth.signUpEmailPassword({
        email,
        password,
        options: {
          displayName,
          redirectTo: window.location.origin + "/verify",
        },
      });

      if (response.body) {
        // Successfully signed up and automatically signed in
        navigate("/profile");
      } else {
        // Verification email sent
        navigate("/verify");
      }
    } catch (err) {
      const error = err as FetchResponse<ErrorResponse>;
      setError(error.body.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-3xl mb-6 gradient-text">Nhost SDK Demo</h1>

      <div className="glass-card w-full p-8 mb-6">
        <h2 className="text-2xl mb-6">Sign Up</h2>

        <TabForm
          passwordTabContent={
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="displayName">Display Name</label>
                <input
                  id="displayName"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                />
              </div>

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
                <p className="text-xs mt-1 text-gray-400">
                  Password must be at least 8 characters long
                </p>
              </div>

              {error && <div className="alert alert-error">{error}</div>}

              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={isLoading}
              >
                {isLoading ? "Signing Up..." : "Sign Up"}
              </button>
            </form>
          }
          magicTabContent={
            <div>
              <MagicLinkForm buttonLabel="Sign up with Magic Link" />
            </div>
          }
        />
      </div>

      <div className="mt-4">
        <p>
          Already have an account? <Link to="/signin">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
