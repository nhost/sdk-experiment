import { createClient } from "@nhost/nhost-js";

/**
 * This imports the SDK from the local workspace in packages/nhost-js
 * as specified in package.json: "@nhost/nhost-js": "workspace:*"
 */

// Create and export a single instance of the Nhost client that can be reused across the app
export const nhost = createClient({
  region: import.meta.env.VITE_NHOST_REGION || "local",
  subdomain: import.meta.env.VITE_NHOST_SUBDOMAIN || "local",
});