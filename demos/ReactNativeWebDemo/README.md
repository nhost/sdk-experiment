# Nhost SDK Demo - React Native

This is a React Native demo showcasing the Nhost SDK with authentication features. It demonstrates how to implement email sign-up/sign-in functionality and user profile management in a React Native app using Expo.

## Features

- Email/Password Authentication
- User Registration
- User Profile Management
- Protected Routes

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Configure Nhost

   Update `app.json` with your Nhost configuration:

   ```json
   "extra": {
     "NHOST_REGION": "your-region",
     "NHOST_SUBDOMAIN": "your-subdomain"
   }
   ```

   For local development, keep the defaults:

   ```json
   "extra": {
     "NHOST_REGION": "local",
     "NHOST_SUBDOMAIN": "local"
   }
   ```

3. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a:

- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go) on your physical device
- Web browser (by pressing 'w')

## Project Structure

This project uses [Expo Router](https://docs.expo.dev/router/introduction/) for file-based routing:

```
app/
├── _layout.tsx          # Root layout with AuthProvider
├── index.tsx            # Home screen
├── signin.tsx           # Sign in screen
├── signup.tsx           # Sign up screen
├── profile.tsx          # User profile (protected)
├── components/
│   └── ProtectedScreen.tsx  # Auth protection component
└── lib/
    └── nhost/
        └── AuthProvider.tsx # Nhost auth context
```

## Key Implementations

1. **Authentication Context**

   - Uses `@nhost/nhost-js` to manage auth state
   - Provides user session information throughout the app

2. **Protected Routes**

   - `ProtectedScreen` component restricts access to authenticated users
   - Redirects to login when not authenticated

3. **Form Handling**
   - Email/password sign-in
   - User registration with display name

## Running with Local Nhost Backend

If you have the Nhost CLI installed and want to run against a local backend:

1. Start your Nhost local backend:

   ```bash
   nhost dev
   ```

2. Make sure `app.json` has local configuration:
   ```json
   "extra": {
     "NHOST_REGION": "local",
     "NHOST_SUBDOMAIN": "local"
   }
   ```

## Learn More

- [Nhost Documentation](https://docs.nhost.io/)
- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/docs/getting-started)
