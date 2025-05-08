"use server";

import { revalidatePath } from "next/cache";
import { createServerNhostClient } from "../lib/nhost/ssr";

/**
 * Signs in a user with email and password
 */
export async function signIn(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // Validate inputs
  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  try {
    // Get the server Nhost client
    const nhost = await createServerNhostClient();

    // Sign in with email and password
    const response = await nhost.auth.signInEmailPassword({
      email,
      password,
    });

    // Check if MFA is required
    if (response.data.mfa) {
      // Return redirect URL for MFA
      return { redirect: `/signin/mfa?ticket=${response.data.mfa.ticket}` };
    }

    // If we have a session, sign in was successful
    if (response.data.session) {
      // Revalidate all paths to ensure server components re-render
      revalidatePath("/");

      // Return redirect to profile page
      return { redirect: "/profile" };
    }

    // If we got here, something went wrong
    return { error: "Failed to sign in" };
  } catch (error: any) {
    console.error("Sign in error:", error);
    return { error: error.message || "Failed to sign in" };
  }
}

/**
 * Verifies MFA code for sign in
 */
export async function verifyMfa(formData: FormData) {
  const otp = formData.get("otp") as string;
  const ticket = formData.get("ticket") as string;

  // Validate inputs
  if (!otp || !ticket) {
    return { error: "Verification code and ticket are required" };
  }

  try {
    // Get the server Nhost client
    const nhost = await createServerNhostClient();

    // Verify MFA code
    const response = await nhost.auth.signInVerifyMfaTotp({
      ticket,
      otp,
    });

    // If we have a session, verification was successful
    if (response.data.session) {
      // Revalidate all paths to ensure server components re-render
      revalidatePath("/");

      // Return redirect to profile page
      return { redirect: "/profile" };
    }

    // If we got here, something went wrong
    return { error: "Failed to verify MFA code", ticket };
  } catch (error: any) {
    console.error("MFA verification error:", error);
    return { error: error.message || "Failed to verify code", ticket };
  }
}

/**
 * Sends a magic link to the provided email
 */
export async function sendMagicLink(formData: FormData) {
  const email = formData.get("email") as string;
  const displayName = (formData.get("displayName") as string) || undefined;

  // Validate inputs
  if (!email) {
    return { error: "Email is required" };
  }

  try {
    // Get origin for redirect URL
    const origin =
      process.env["NEXT_PUBLIC_APP_URL"] || "http://localhost:3000";

    // Get the server Nhost client
    const nhost = await createServerNhostClient();

    // Send magic link
    const response = await nhost.auth.signInPasswordlessEmail({
      email,
      options: {
        displayName,
        redirectTo: origin + "/verify",
      },
    });

    if (response.data) {
      return { redirect: "/signin?magic=success" };
    }

    // If we got here, something went wrong
    return { error: "Failed to send magic link" };
  } catch (error: any) {
    console.error("Magic link error:", error);
    return { error: error.message || "Failed to send magic link" };
  }
}
