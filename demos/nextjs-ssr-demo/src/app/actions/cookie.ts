'use server'

import { cookies } from 'next/headers'

/**
 * Server action to retrieve a cookie value
 */
export async function getCookie(name: string) {
  const cookieStore = await cookies()
  const cookie = cookieStore.get(name)
  return cookie
}

/**
 * Server action to check if a cookie exists
 */
export async function hasCookie(name: string) {
  const cookieStore = await cookies()
  return cookieStore.has(name)
}

/**
 * Server action to set a cookie
 * Only usable from server actions or route handlers
 */
export async function setCookie(name: string, value: string, options?: {
  expires?: Date;
  maxAge?: number;
  domain?: string;
  path?: string;
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
}) {
  const cookieStore = await cookies()
  cookieStore.set(name, value, options)
}

/**
 * Server action to delete a cookie
 * Only usable from server actions or route handlers
 */
export async function deleteCookie(name: string) {
  const cookieStore = await cookies()
  cookieStore.delete(name)
} 