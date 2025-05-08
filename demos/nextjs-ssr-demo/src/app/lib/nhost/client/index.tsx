"use client";

import { createClient, CookieStorage } from "nhost-js";

export function createClientNhostClient() {
  return createClient({
    region: process.env["NHOST_REGION"] || "local",
    subdomain: process.env["NHOST_SUBDOMAIN"] || "local",
    storage: new CookieStorage(),
  });
}
