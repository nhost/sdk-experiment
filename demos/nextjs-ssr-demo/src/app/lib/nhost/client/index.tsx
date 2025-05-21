"use client";

import { createClient } from "@nhost/nhost-js";
import { CookieStorage } from "@nhost/nhost-js/session";

/**
 * Creates an Nhost client for use in client components.
 *
 * We rely on the vanilla createClient method from the Nhost JS SDK and the provided
 * CookieStorage class to handle session persistence. We need to use the CookieStorage
 * to ensure the session is available in both server and client components.
 */
export function createNhostClient() {
  return createClient({
    region: process.env["NHOST_REGION"] || "local",
    subdomain: process.env["NHOST_SUBDOMAIN"] || "local",
    storage: new CookieStorage(), // use CookieStorage for client components
  });
}
