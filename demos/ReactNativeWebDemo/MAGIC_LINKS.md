# Magic Links in the Nhost React Native Demo

This document explains how magic links are implemented in the React Native demo app and how to test them.

## How Magic Links Work

Magic links allow users to sign in without a password by sending a link to their email. When clicked, this link contains a token that authenticates the user automatically.

In a React Native app, this requires:
1. Sending an email with a link that opens your app
2. Configuring deep linking to handle the incoming URL
3. Processing the token from the URL to authenticate the user

## Implementation Details

### 1. Components
- **MagicLinkForm**: Collects the user's email and sends the magic link
- **Verify**: Handles the verification flow when a magic link is clicked

### 2. Deep Linking
The app supports two types of deep linking:
- For standalone apps: The URL scheme `reactnativewebdemo://`
- For Expo Go: The URL format `exp://<host>:<port>/--/verify`

### 3. Authentication Flow
1. User enters email address and requests a magic link
2. Nhost sends an email with a link appropriate for your environment
3. When clicked, the app opens at the verify screen
4. The verify screen extracts the refresh token and authenticates the user
5. Upon successful verification, the user is redirected to their profile

## Testing Magic Links with Expo Go

### Setting Up Expo Go

1. **Install the Expo Go app** on your device from the App Store or Google Play Store
2. **Launch your development server** with `npx expo start`
3. **Open the app** on your device by scanning the QR code

### Testing Magic Links in Expo Go

1. **Get Your Development URL**:
   - Note the URL shown in your terminal when you start the app (e.g., `exp://192.168.1.103:19000`)
   
2. **Generate the Correct Magic Link Format**:
   - Our app automatically creates the right URL format for Expo Go
   - The redirect URL will look like: `exp://192.168.1.103:19000/--/verify`
   
3. **Send the Magic Link**:
   - Use the Magic Link tab in the Sign In screen
   - Enter your email and submit the form
   - The correct URL format will be sent to your email
   
4. **Test the Link**:
   - Open the email on the same device where Expo Go is installed
   - Tap the magic link - it should open Expo Go automatically
   - If it doesn't, ensure the URL starts with `exp://` and has your correct local IP and port

### Debugging Expo Go Magic Links

If the magic link doesn't work:

1. **Check the Console Output**:
   - The app logs the redirect URL when sending a magic link
   - Check this URL matches what you receive in your email
   
2. **Manually Test the Link**:
   - If clicking the link doesn't work, copy it and:
     - iOS: Use Safari to open the URL
     - Android: Use the "Open with..." option and select Expo Go
   
3. **Inspect URL Parameters**:
   - The verify screen shows all URL parameters it receives
   - This helps diagnose if the token is being passed correctly

4. **Network Issues**:
   - Ensure your device and development machine are on the same network
   - Some corporate or public networks may block the necessary connections

### Common Issues with Expo Go

1. **Wrong Development URL**:
   - If your IP address changes, you need to update the magic link URLs
   - Always use the URL displayed when you start the Expo development server
   
2. **Link Format Issues**:
   - Expo Go links must use the format: `exp://<host>:<port>/--/<route>`
   - The `--` part is essential for routing in Expo Go
   
3. **Authentication Token Not Received**:
   - Check if the refreshToken parameter is included in the URL
   - The verification screen will show what parameters were received

## Production Considerations

For production apps:

1. Register your app's universal links (iOS) and app links (Android) for a more seamless experience
2. Configure a custom domain for your magic links rather than using the app scheme
3. Handle edge cases like expired tokens, already authenticated users, etc.
4. Add analytics to track conversion rates on magic link usage

## References

- [Expo Linking Documentation](https://docs.expo.dev/guides/linking/)
- [Expo Go URL Format](https://docs.expo.dev/guides/linking/#linking-to-your-app)
- [Nhost Authentication Documentation](https://docs.nhost.io/authentication)
- [React Navigation Deep Linking Guide](https://reactnavigation.org/docs/deep-linking/)