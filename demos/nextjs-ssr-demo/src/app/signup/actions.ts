"use server";

import { revalidatePath } from "next/cache";
import { createNhostClient } from "../lib/nhost/server";

/**
 * Signs up a user with email and password
 */
export async function signUp(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const displayName = formData.get("displayName") as string;

  // Validate inputs
  if (!email || !password || !displayName) {
    return { error: "All fields are required" };
  }

  try {
    // Get the server Nhost client
    const nhost = await createNhostClient();

    // Sign up with email and password
    const response = await nhost.auth.signUpEmailPassword({
      email,
      password,
      options: {
        displayName,
      },
    });

    // If we have a session, sign up was successful
    if (response.body.session) {
      // Revalidate all paths to ensure server components re-render
      revalidatePath("/");

      // Return redirect to profile page
      return { redirect: "/profile" };
    }

    // If we got here, something went wrong
    return { error: "Failed to sign up" };
  } catch (error: any) {
    console.error("Sign up error:", error);
    return { error: error.message || "Failed to sign up" };
  }
}

/**
 * Sends a magic link to the provided email for signup
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
    const nhost = await createNhostClient();

    // Send magic link
    const response = await nhost.auth.signInPasswordlessEmail({
      email,
      options: {
        displayName,
        redirectTo: origin + "/verify",
      },
    });

    if (response.body) {
      return { redirect: "/signup?magic=success" };
    }

    // If we got here, something went wrong
    return { error: "Failed to send magic link" };
  } catch (error: any) {
    console.error("Magic link error:", error);
    return { error: error.message || "Failed to send magic link" };
  }
}
