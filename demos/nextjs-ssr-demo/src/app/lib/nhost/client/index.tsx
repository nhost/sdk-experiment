'use client';

import { createClient, CookieStorage } from 'nhost-js';

export function createClientNhostClient() {
  return createClient({
    region: 'local',
    subdomain: 'local',
    storage: new CookieStorage(),
  });
}
