import { createServerNhostClient } from "./lib/nhost/ssr";
import { redirect } from "next/navigation";

export default async function Home() {
  // Check if user is already authenticated
  const nhost = await createServerNhostClient();
  const session = nhost.getUserSession();

  // Redirect based on authentication status
  if (session) {
    redirect("/profile");
  }

  redirect("/signin");
}
