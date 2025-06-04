# React Native Web Demo with Nhost SDK

## Quick Fix Instructions

Before running the app, please install the required AsyncStorage dependency:

```bash
npm install @react-native-async-storage/async-storage
```

## About this Demo

This demo showcases the Nhost SDK integration with a React Native Expo application. It demonstrates authentication flow including:

- Sign up with email/password
- Sign in with email/password
- Protected profile screen
- User session management

## Project Structure

The app uses Expo Router for navigation with the following structure:

- `app/_layout.tsx`: Main entry point with the AuthProvider
- `app/index.tsx`: Home screen
- `app/signin.tsx`: Sign in screen
- `app/signup.tsx`: Sign up screen
- `app/profile.tsx`: Protected profile screen
- `app/lib/nhost/AuthProvider.tsx`: Authentication context
- `app/components/ProtectedScreen.tsx`: Route protection component

## Configuration

The app is configured to connect to a local Nhost backend by default. You can change this in `app.json`:

```json
"extra": {
  "NHOST_REGION": "your-region",
  "NHOST_SUBDOMAIN": "your-subdomain"
}
```

## Running the App

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the app:

   ```bash
   npx expo start
   ```

3. Use Expo Go on your device or launch in a simulator/emulator

## Known Issues

- Make sure AsyncStorage is installed before running
- If you get auth errors, verify your Nhost backend is running correctly
- For web support, additional configuration may be needed
