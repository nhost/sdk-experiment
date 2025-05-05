import Link from 'next/link';
import TabForm from '../components/TabForm';
import SignInForm from './SignInForm';
import MagicLinkForm from '../components/MagicLinkForm';
import { sendMagicLink } from './actions';

// Define interface for search params
interface SearchParams {
  error?: string;
  magic?: string;
}

export default async function SignIn({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  // Extract error and magic link status from URL - ensure searchParams is awaited
  const params = await Promise.resolve(searchParams);
  const error = params.error;
  const magicLinkSent = params.magic === 'success';
  
  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-3xl mb-6 gradient-text">Nhost SDK Demo</h1>

      <div className="glass-card w-full p-8 mb-6">
        <h2 className="text-2xl mb-6">Sign In</h2>
        
        {magicLinkSent ? (
          <div className="text-center">
            <p className="mb-4">Magic link sent! Check your email to sign in.</p>
            <Link href="/signin" className="btn btn-secondary">
              Back to sign in
            </Link>
          </div>
        ) : (
          <TabForm 
            passwordTabContent={<SignInForm initialError={error} />}
            magicTabContent={
              <div>
                <MagicLinkForm 
                  sendMagicLinkAction={sendMagicLink}
                  buttonLabel="Sign in with Magic Link" 
                />
              </div>
            }
          />
        )}
      </div>

      <div className="mt-4">
        <p>
          Don&apos;t have an account?{' '}
          <Link href="/signup">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
