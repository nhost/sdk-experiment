"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createNhostClient } from "../../lib/nhost/server";
import type { FetchResponse, ErrorResponse } from "@nhost/nhost-js/auth";

/**
 * Verifies MFA code for sign in
 */
export async function verifyMfa(formData: FormData): Promise<void> {
  const otp = formData.get("otp") as string;
  const ticket = formData.get("ticket") as string;

  // Validate inputs
  if (!otp || !ticket) {
    redirect("/signin/mfa?error=Verification+code+and+ticket+are+required");
  }

  try {
    // Get the server Nhost client
    const nhost = await createNhostClient();

    // Verify MFA code
    const response = await nhost.auth.signInVerifyMfaTotp({
      ticket,
      otp,
    });

    // If we have a session, verification was successful
    if (response.body.session) {
      // Revalidate all paths to ensure server components re-render
      revalidatePath("/");

      // Redirect to profile page
      redirect("/profile");
    }

    // If we got here, something went wrong
    redirect(`/signin/mfa?ticket=${ticket}&error=Failed+to+verify+MFA+code`);
  } catch (err) {
    const error = err as FetchResponse<ErrorResponse>;
    const errorMessage = `Failed to verify MFA code: ${error.body.message || "unexpected error"}`;
    redirect(
      `/signin/mfa?ticket=${ticket}&error=${encodeURIComponent(errorMessage)}`,
    );
  }
}

/**
 * Sends a magic link to the provided email
 */
export async function sendMagicLink(formData: FormData): Promise<void> {
  const email = formData.get("email") as string;
  const displayName = (formData.get("displayName") as string) || undefined;

  // Validate inputs
  if (!email) {
    redirect("/signin?error=Email+is+required");
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
        redirectTo: origin,
      },
    });

    if (response.body) {
      redirect("/signin?magic=success");
    }

    // If we got here, something went wrong
    redirect("/signin?error=Failed+to+send+magic+link");
  } catch (err) {
    const error = err as FetchResponse<ErrorResponse>;
    const errorMessage = `Failed to send magic link: ${error.body.message || "unexpected error"}`;
    redirect(`/signin?error=${encodeURIComponent(errorMessage)}`);
  }
}
