'use server';

import { revalidatePath } from 'next/cache';

/**
 * Revalidates the specified path after authentication state changes
 * This ensures that server components re-render with the new auth state
 */
export async function revalidateAfterAuthChange(path: string = '/') {
  // Revalidate the specified path to refresh server components
  revalidatePath(path);
  return { success: true };
}
