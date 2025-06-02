# Setting Up the React Native Web Demo

## Required Installation

Before running this demo, you need to install an additional dependency for AsyncStorage:

```bash
npm install @react-native-async-storage/async-storage
```

## Configuration

The app is configured to connect to a Nhost backend. You can modify the connection details in `app.json`:

```json
"extra": {
  "NHOST_REGION": "your-region", 
  "NHOST_SUBDOMAIN": "your-subdomain"
}
```

For local development with Nhost CLI, keep the defaults:
```json
"extra": {
  "NHOST_REGION": "local",
  "NHOST_SUBDOMAIN": "local"
}
```

## Running the App

1. First install all dependencies:
   ```bash
   npm install
   ```

2. Start the app:
   ```bash
   npx expo start
   ```

3. Select your preferred platform:
   - Press `a` for Android emulator
   - Press `i` for iOS simulator
   - Press `w` for web browser
   - Scan the QR code with Expo Go on your mobile device

## Troubleshooting

If you encounter any errors:

1. Make sure you've installed AsyncStorage:
   ```bash
   npm install @react-native-async-storage/async-storage
   ```

2. Check that your Nhost backend is running and accessible

3. Clear the React Native cache:
   ```bash
   npx expo start --clear
   ```

4. If you have issues with the Nhost client, try modifying `app/lib/nhost/AuthProvider.tsx` to use memory storage instead of AsyncStorage by setting:
   ```javascript
   clientStorageType: "memory"
   ```

## Features

This demo showcases:
- Email/password authentication
- User registration
- Protected routes
- User profile management

Refer to the README.md for more information about the project structure.