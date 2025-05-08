"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServerNhostClient } from "../../lib/nhost/ssr";

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

      // Redirect to profile page
      redirect("/profile");
    }

    // If we got here, something went wrong
    redirect(`/signin/mfa?ticket=${ticket}&error=Failed+to+verify+MFA+code`);
  } catch (error: any) {
    console.error("MFA verification error:", error);
    redirect(
      `/signin/mfa?ticket=${ticket}&error=${encodeURIComponent(error.message || "Failed to verify code")}`,
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
    const nhost = await createServerNhostClient();

    // Send magic link
    const response = await nhost.auth.signInPasswordlessEmail({
      email,
      options: {
        displayName,
        redirectTo: origin,
      },
    });

    if (response.data) {
      redirect("/signin?magic=success");
    }

    // If we got here, something went wrong
    redirect("/signin?error=Failed+to+send+magic+link");
  } catch (error: any) {
    console.error("Magic link error:", error);
    redirect(
      `/signin?error=${encodeURIComponent(error.message || "Failed to send magic link")}`,
    );
  }
}
