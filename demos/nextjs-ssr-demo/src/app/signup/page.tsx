import Link from 'next/link';
import { createServerNhostClient } from '../lib/nhost/ssr';
import { redirect } from 'next/navigation';
import TabForm from '../components/TabForm';
import SignUpForm from './SignUpForm';
import MagicLinkForm from '../components/MagicLinkForm';
import { sendMagicLink } from './actions';

// Define interface for search params
interface SearchParams {
  error?: string;
  magic?: string;
}

export default async function SignUp({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  // Extract error and magic link status from URL - ensure searchParams is awaited
  const params = await Promise.resolve(searchParams);
  const error = params.error;
  const magicLinkSent = params.magic === 'success';
  
  // Check if user is already authenticated
  const nhost = await createServerNhostClient();
  const session = nhost.getUserSession();
  
  // If user is already authenticated, redirect to profile
  if (session) {
    redirect('/profile');
  }
  
  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-3xl mb-6 gradient-text">Nhost SDK Demo</h1>

      <div className="glass-card w-full p-8 mb-6">
        <h2 className="text-2xl mb-6">Sign Up</h2>
        
        {magicLinkSent ? (
          <div className="text-center">
            <p className="mb-4">Magic link sent! Check your email to sign in.</p>
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
                  showDisplayName={true}
                  buttonLabel="Sign up with Magic Link" 
                />
              </div>
            }
          />
        )}
      </div>

      <div className="mt-4">
        <p>
          Already have an account?{' '}
          <Link href="/signin">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
} 