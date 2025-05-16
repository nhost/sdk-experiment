import Link from "next/link";
import TabForm from "../components/TabForm";
import SignUpForm from "./SignUpForm";
import MagicLinkForm from "../components/MagicLinkForm";
import { sendMagicLink } from "./actions";

export default async function SignUp({ searchParams }: any) {
  // Extract error and magic link status from URL
  const params = await searchParams;
  const error = params?.error as string | undefined;
  const magicLinkSent = params?.magic === "success";

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-3xl mb-6 gradient-text">Nhost SDK Demo</h1>

      <div className="glass-card w-full p-8 mb-6">
        <h2 className="text-2xl mb-6">Sign Up</h2>

        {magicLinkSent ? (
          <div className="text-center">
            <p className="mb-4">
              Magic link sent! Check your email to sign in.
            </p>
            <Link href="/signup" className="btn btn-secondary">
              Back to sign up
            </Link>
          </div>
        ) : (
          <TabForm
            passwordTabContent={<SignUpForm initialError={error} />}
            magicTabContent={
              <div>
                <MagicLinkForm
                  sendMagicLinkAction={sendMagicLink}
                  showDisplayName
                  buttonLabel="Sign up with Magic Link"
                />
              </div>
            }
          />
        )}
      </div>

      <div className="mt-4">
        <p>
          Already have an account? <Link href="/signin">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
