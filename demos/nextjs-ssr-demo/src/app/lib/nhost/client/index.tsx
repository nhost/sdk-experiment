"use client";

import { createClient } from "nhost-js";
import { CookieStorage } from "nhost-js/auth";

export function createClientNhostClient() {
  return createClient({
    region: process.env["NHOST_REGION"] || "local",
    subdomain: process.env["NHOST_SUBDOMAIN"] || "local",
    storage: new CookieStorage(),
  });
}
