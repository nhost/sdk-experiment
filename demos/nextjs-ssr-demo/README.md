## nextjs-ssr-demo

This project is a demonstration of how to integrate Nhost with Next.js, showcasing server-side rendering (SSR) capabilities and authentication flows. It includes features like file uploads, session management, middleware for route protection, and client-side interactions for interactive components.

## Getting Started

To run the demo locally you need to clone this repo and then run the following commands:

```bash
cd backend
nhost up
cd ../demos/nextjs-ssr-demo
pnpm install
pnpm dev
```

## Nhost Integration

This project demonstrates how to use Nhost with Next.js in a server-side rendering (SSR) setup.

### Server and Client Components

Most of the application is built using server components, which allows for better performance and SEO. Most of the code is just either generic Next.js code or vanilla Nhost code, the only "special code" needed to handle the server + client components and the Next.js middleware can be found under:

- `src/app/lib/nhost/client/index.tsx` - This file exports:
  - `createNhostClient` initializes an Nhost client using CookieStorage to be used in client components.
- `src/app/lib/nhost/server/index.tsx` - This file exports:
  - `createNhostClient` initializes an Nhost client using CookieStorage to be used in server components.
  - `handleNhostMiddleware` handles the initialization of an Nhost client that can be used in Next.js middleware and refreshes the session if needed.

### Middleware

We use a middleware to protect routes and handle refreshing the tokens:

- `src/middleware.ts`

### Authentication

All authentication steps are performed server side and rely on the vanilla nhost-js SDK. No special code or considerations are needed for this. Currently the following mechanisms for authentication are supported:

- Email and Password with optional MFA
- Magic Link

You can find all the relevant code in the folders:
- `src/app/signin/` - Sign in methods
- `src/app/signup/` - Sign up methods
- `src/app/verify/` -  Route to verify the magic link. We use a route because server components are not allowed to write cookies. Alternatively this could be done on a client component as those are allowed to write cookies but we wanted to keep the sign in flow as server components for demonstration purposes.

### Profile

The profile page is a server component that fetches the session data from the persisted session cookie. In addition, the profile page allows users to configure their MFA.

There are two peculiarities with the profile page:

1. The session is read on the server from the cookie so the profile can be rendered server-side.
2. The MFA configuration is done using a client component to provide interactivity.

You can find all the relevant code in the folders:

- `src/app/profile/`

### File Storage

The application demonstrates how to use Nhost's file storage capabilities. While the `/upload` page is fully pre-rendered server-side, all interactions in this page are handled by client components. This allows the user to upload/download files directly to the storage service.

Some details about the page:

1. The page is fully rendered server-side, including the list of files, which are retrieved using GraphQL.
2. All the storage interactions (uploading, downloading, deleting) are handled by client components.
3. The download is done by using authenticated requests. This requires a bit of post-processing as we need to fetch the file with the SDK and then create a blob URL to download the file but it is much more efficient than presigned URLs as we can leverage the CDN for caching.
4. To avoid re-fetching the list of files on every interaction, we push/remove the file to/from the list of files in the client component. This is done using a custom hook that uses the `useState` and `useEffect` hooks to manage the state of the files.

You can find the code for the `/upload` page in the following folder:

- `src/app/upload`

### Layout and Navigation

The layout is a server component that will render different content depending on the authentication state of the user:

- If the user is authenticated, the layout will render the navigation bar with the profile and upload links.
- If the user is not authenticated, the layout will render the sign in and sign up links.

To make sure the navigation is always up to date, every server component that changes the authentication state will call `revalidateAfterAuthChange` to revalidate the layout. This is done using the `revalidatePath` function from Next.js.
