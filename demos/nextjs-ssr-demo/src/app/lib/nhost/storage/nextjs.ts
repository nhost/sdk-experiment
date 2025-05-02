import { type StorageInterface } from 'nhost-js';
import { type NextRequest, NextResponse } from 'next/server';


/**
 * Server-side cookie storage for Nhost client in Next.js middleware
 */
export class ServerMiddlewareCookieStorage implements StorageInterface {
    private req: NextRequest | null = null;
    private res: NextResponse | null = null;

    /**
     * Set the request and response objects for the middleware context
     */
    setContext(req: NextRequest, res: NextResponse) {
      this.req = req;
      this.res = res;
    }

    /**
     * Get an item from the cookie storage
     */
    getItem(key: string): string | null {
      if (!this.req) {
        throw new Error('ServerCookieStorage is not initialized with middleware context');
      }

      return this.req.cookies.get(key)?.value || null;
    }

    /**
     * Set an item in cookie storage
     */
    setItem(key: string, value: string): void {
      if (!this.res) {
        throw new Error('ServerCookieStorage is not initialized with middleware context');
      }

      this.res.cookies.set(key, value, {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production'
      });
    }

    /**
     * Remove an item from cookie storage
     */
    removeItem(key: string): void {
      if (!this.res) {
        throw new Error('ServerCookieStorage is not initialized with middleware context');
      }

      this.res.cookies.delete(key);
    }
  }

  /**
   * Create a storage instance for the Nhost client to use in middleware
   */
  export function createServerMiddlewareCookieStorage(req: NextRequest, res: NextResponse): ServerMiddlewareCookieStorage {
    const storage = new ServerMiddlewareCookieStorage();
    storage.setContext(req, res);
    return storage;
  }
