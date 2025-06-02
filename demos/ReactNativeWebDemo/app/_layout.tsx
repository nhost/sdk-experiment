import { Stack } from "expo-router";
import { AuthProvider } from "./lib/nhost/AuthProvider";
import { Text, View } from "react-native";
import * as Linking from 'expo-linking';
import { useEffect } from "react";
import { router } from "expo-router";

// Configure linking - detects exp:// links automatically for Expo Go
const linking = {
  prefixes: [
    // For standalone app
    Linking.createURL('/'),
    // For Expo Go
    'exp://',
    'exp://localhost:19000',
    'exp://192.168.1.103:19000'
  ],
  config: {
    screens: {
      verify: 'verify',
      signin: 'signin',
      signup: 'signup',
      profile: 'profile',
      index: '',
    },
  },
};

// Handle deep links that Expo Router might not catch
function HandleDeepLinks() {
  useEffect(() => {
    // Listen for incoming links while the app is open
    const subscription = Linking.addEventListener('url', ({ url }) => {
      console.log('Deep link received:', url);
      
      // Parse the URL to extract path and params
      try {
        const parsedUrl = new URL(url);
        const path = parsedUrl.pathname.split('/').pop() || '';
        
        // If this is a verification link with a refresh token
        if (path === 'verify' && parsedUrl.searchParams.has('refreshToken')) {
          const refreshToken = parsedUrl.searchParams.get('refreshToken');
          router.navigate({
            pathname: '/verify',
            params: { refreshToken }
          });
        }
      } catch (e) {
        console.error('Failed to parse deep link URL:', e);
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return null;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      {/* Custom handler for deep links */}
      <HandleDeepLinks />
      
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: "#f5f5f5",
          },
          headerTintColor: "#333",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      >
        <Stack.Screen name="index" options={{ title: "Home" }} />
        <Stack.Screen name="signin" options={{ title: "Sign In" }} />
        <Stack.Screen name="signup" options={{ title: "Sign Up" }} />
        <Stack.Screen name="profile" options={{ title: "Profile" }} />
        <Stack.Screen name="verify" options={{ title: "Verify Email" }} />
      </Stack>
    </AuthProvider>
  );
}

// Error boundary to catch and display errors
export function ErrorBoundary(props: { error: Error }) {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
      }}
    >
      <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
        An error occurred
      </Text>
      <Text style={{ color: "red", marginBottom: 10 }}>
        {props.error.message}
      </Text>
      <Text>{props.error.stack}</Text>
    </View>
  );
}
