# Nhost React Demo

This is a client-side React implementation of the Nhost SDK demo, built with Vite and React. It demonstrates how to use the Nhost SDK for authentication, file storage, and GraphQL in a client-side application.

## Features

- User authentication (sign up, sign in, sign out)
- Email verification
- Magic link authentication
- Multi-factor authentication status display
- File upload and management
- Profile information display
- Session management

## Prerequisites

- Node.js (v18 or higher)
- pnpm
- A running Nhost backend (local or hosted)

## Getting Started

1. First, make sure you have the Nhost backend running. If you're using a local backend, you can start it by following the instructions in the `/backend` directory.

2. Create a `.env.local` file in the root of this project with the following variables:

```
VITE_NHOST_REGION=your-region
VITE_NHOST_SUBDOMAIN=your-subdomain
```

Replace `your-region` and `your-subdomain` with your Nhost project's region and subdomain. If you're running locally, use `local` for both values.

3. Install dependencies:

```bash
pnpm install
```

4. Start the development server:

```bash
pnpm dev
```

5. Open [http://localhost:5173](http://localhost:5173) in your browser to see the application.

## Project Structure

- `/src/components`: Reusable React components
- `/src/pages`: Page components corresponding to routes
- `/src/lib/auth`: Authentication-related utilities
- `/src/lib/nhost`: Nhost client configuration
- `/src/assets`: Static assets

## Key Implementation Details

- The application uses React Router v6 for routing
- Authentication state is managed through the `AuthProvider` context
- The Nhost SDK is initialized once in `src/lib/nhost/client.js`
- File uploads use Nhost's Storage API
- User profile data is fetched via GraphQL

## Comparison with SSR Demo

This demo is a client-side implementation of the functionality provided by the SSR (Server-Side Rendering) demo in `nextjs-ssr-demo`. The key differences are:

1. All data fetching and authentication happens in the browser
2. No server-side rendering or middleware
3. Uses React Router instead of Next.js App Router
4. Session state is managed entirely client-side

## Customizing

You can modify the theme by editing the CSS variables in `src/index.css`. The UI uses a simple CSS approach without any UI framework dependencies.

## License

This project is part of the Nhost SDK examples and is subject to the license terms in the root directory.