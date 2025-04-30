# Nhost SDK React Demo

This demo app demonstrates how to use the Nhost SDK with React for authentication and user management.

## Features

- User registration with email/password and display name
- Sign in with email/password
- Protected profile page that shows user session details
- Automatic redirection based on authentication state

## Requirements

- Node.js 18+
- pnpm

## Setup

1. Make sure you have pnpm installed:
   ```
   npm install -g pnpm
   ```

2. Install dependencies from the root of the repo:
   ```
   pnpm install
   ```

3. Build the SDK:
   ```
   pnpm build
   ```

4. Start the demo app:
   ```
   cd demos/react-demo
   pnpm dev
   ```

5. Start a local Nhost instance:
   ```
   nhost up
   ```

## Usage

1. The app will be available at http://localhost:5173
2. Create an account by filling out the sign-up form
3. Sign in with your credentials
4. View your profile information at /profile

## Notes

This demo uses the local Nhost instance configured with:
- region: 'local'
- subdomain: 'local'

If you want to connect to a different Nhost instance, modify the NhostContext.tsx file with your own region and subdomain.
