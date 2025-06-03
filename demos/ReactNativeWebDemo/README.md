# Nhost SDK Demo - React Native

This is a React Native demo showcasing the Nhost SDK with authentication features. It demonstrates how to implement email sign-up/sign-in functionality and user profile management in a React Native app using Expo.

## Features

- Email/Password Authentication
- Magic Link Authentication
- Social Authentication (GitHub)
- Native Authentication (Apple on iOS)
- User Registration
- User Profile Management
- Protected Routes
- Reliable Session Persistence (even with Expo Go)

## Get started

1. Install dependencies

   ```bash
   npm install
   # AsyncStorage is already included in the dependencies
   ```

2. Configure Nhost and OAuth Providers

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
     "NHOST_REGION": "192-168-1-103", # Replace with your local IP address
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
│   ├── ProtectedScreen.tsx  # Auth protection component
│   ├── MagicLinkForm.tsx    # Magic link authentication
│   ├── SocialLoginForm.tsx  # GitHub authentication
│   ├── NativeLoginForm.tsx  # Native authentication container
│   ├── AppleSignIn.tsx      # Apple Sign-In for iOS
└── lib/
    └── nhost/
        ├── AuthProvider.tsx # Nhost auth context
        ├── AsyncStorage.tsx # Custom storage implementation for session persistence with in-memory cache
        └── SessionPersistence.tsx # Utilities for reliable session persistence with Expo Go
```

## Key Implementations

1. **Authentication Context**

   - Uses `@nhost/nhost-js` to manage auth state
   - Provides user session information throughout the app
   - Implements reliable persistent session storage using AsyncStorage with special handling for Expo Go
   - Handles app state changes to ensure session persistence between app opens/closes

2. **Protected Routes**

   - `ProtectedScreen` component restricts access to authenticated users
   - Redirects to login when not authenticated

3. Authentication Methods
   - Email/password sign-in
   - Magic links for passwordless authentication
   - GitHub social authentication
   - Native authentication:
     - Apple Sign-In (iOS only)
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
- [AsyncStorage Documentation](https://react-native-async-storage.github.io/async-storage/)
- [React Native App State](https://reactnative.dev/docs/appstate)
- [Expo Apple Authentication](https://docs.expo.dev/versions/latest/sdk/apple-authentication/)

## Session Persistence Details

This demo implements a robust session persistence strategy that works reliably even with Expo Go:

1. **AsyncStorage Implementation**: Custom storage adapter that works with Nhost's synchronous interface while using AsyncStorage in the background

2. **App State Handling**: Uses AppState to detect when the app goes to background/foreground to ensure sessions are properly persisted

3. **Initialization Timing**: Adds small delay during initialization to ensure AsyncStorage has time to load the session

4. **Error Handling**: Comprehensive error handling to gracefully handle storage failures
