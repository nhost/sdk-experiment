This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

## Nhost Integration

This project demonstrates how to use Nhost with Next.js in a server-side rendering (SSR) setup:

### Session Management

- **Profile Page**: The profile page (`src/app/profile/page.tsx`) retrieves the user session on the server using `createServerNhostClient()`, which extracts session data from cookies and initializes an authenticated Nhost client.

### File Storage

- **Server-Side Usage**: The upload page (`src/app/upload/page.tsx`) fetches files on the server using the Nhost GraphQL API, demonstrating how to make authenticated GraphQL queries from server components.

- **Client-Side Usage**: The client component (`src/app/upload/client.tsx`) handles file uploads, viewing, and deletion using the Nhost Storage API through the `useNhost` hook.

### Authentication Flow

- The `NhostProvider` component manages authentication state, session syncing across tabs, and provides sign-out functionality.
- Cookie-based storage ensures a seamless authentication experience with server-side support.

### Middleware

- The application uses Next.js middleware (`src/middleware.ts`) to protect routes and handle authentication.
- The middleware:
  - Creates an Nhost client with a specialized middleware cookie storage
  - Checks if the current route requires authentication
  - Redirects unauthenticated users to the sign-in page
  - Refreshes tokens automatically when they're about to expire

### Server-Side Rendered Navigation

The application demonstrates how to implement server-side rendered navigation that updates correctly with authentication state changes:

- **Server Component**: The main `Navigation` component (`src/app/components/Navigation.tsx`) is a server component that retrieves the authentication state using `createServerNhostClient()`. This allows it to render different navigation options based on authentication status directly from the server.

- **Client Components**: Interactive elements like the sign-out button are implemented as client components (`NavigationClient.tsx`).

- **Server Actions**: The application uses server actions (`src/app/lib/actions.ts`) to bridge client and server states. When authentication state changes (sign in, sign up, or sign out), the `revalidateAfterAuthChange` server action is called to refresh server components.

- **Authentication State Synchronization**: This architecture ensures that:
  - Navigation renders initially on the server for better performance and SEO
  - Authentication state changes are synchronized using the `revalidatePath` function
  - The navigation UI updates immediately after sign in/out actions

This pattern demonstrates an efficient hybrid approach that leverages:

1. Server components for data fetching and initial rendering
2. Client components for interactivity
3. Server actions for managing server-side state updates

### Layout and Navigation

- **Root Layout**: The app uses a root layout (`src/app/layout.tsx`) that wraps all pages with the `NhostProvider`, making authentication state available throughout the application.
- **Composable Navigation**: The architecture splits navigation into server and client components, maintaining a clean separation of concerns while preserving server-side rendering benefits.

This architecture demonstrates an effective hybrid approach, with initial data loading on the server and subsequent user interactions handled on the client.
