import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useAuth } from "./lib/nhost/AuthProvider";
import { type ErrorResponse } from "@nhost/nhost-js/auth";
import { type FetchError } from "@nhost/nhost-js/fetch";
import * as Linking from "expo-linking";

export default function Verify() {
  const params = useLocalSearchParams<{ refreshToken: string }>();
  const [status, setStatus] = useState<"verifying" | "success" | "error">(
    "verifying",
  );
  const [error, setError] = useState<string>("");
  const [urlParams, setUrlParams] = useState<Record<string, string>>({});
  const [initialUrl, setInitialUrl] = useState<string | null>(null);

  const { nhost, isAuthenticated } = useAuth();

  // First, try to get the initial URL that opened the app (for direct deep links)
  useEffect(() => {
    async function getInitialUrl() {
      const url = await Linking.getInitialURL();
      console.log("Initial URL:", url);
      setInitialUrl(url);
    }

    void getInitialUrl();
  }, []);

  useEffect(() => {
    // First check URL params provided by expo-router
    let refreshToken = params.refreshToken;

    // If no refresh token in params, try to extract it from the initial URL
    // This handles cases where expo-router params might not work properly in Expo Go
    if (!refreshToken && initialUrl) {
      try {
        const url = new URL(initialUrl);
        refreshToken = url.searchParams.get("refreshToken") || "";
        console.log("Extracted refresh token from initial URL:", refreshToken);
      } catch (e) {
        console.log("Error parsing initial URL:", e);
      }
    }

    if (!refreshToken) {
      // Collect all URL parameters to display
      const allParams: Record<string, string> = {};
      Object.entries(params).forEach(([key, value]) => {
        if (typeof value === "string") {
          allParams[key] = value;
        }
      });
      if (initialUrl) {
        allParams["initialUrl"] = initialUrl;
      }
      setUrlParams(allParams);

      setStatus("error");
      setError("No refresh token found in the link");
      return;
    }

    // Flag to handle component unmounting during async operations
    let isMounted = true;

    async function processToken(): Promise<void> {
      try {
        // First display the verifying message for at least a moment
        await new Promise((resolve) => setTimeout(resolve, 500));

        if (!isMounted) return;

        if (!refreshToken) {
          // Collect all URL parameters to display
          const allParams: Record<string, string> = {};
          Object.entries(params).forEach(([key, value]) => {
            if (typeof value === "string") {
              allParams[key] = value;
            }
          });
          setUrlParams(allParams);

          setStatus("error");
          setError("No refresh token found in the link");
          return;
        }

        // Process the token
        await nhost.auth.refreshToken({ refreshToken });

        if (!isMounted) return;

        setStatus("success");

        // Wait to show success message briefly, then redirect
        setTimeout(() => {
          if (isMounted) router.replace("/profile");
        }, 1500);
      } catch (err) {
        const error = err as FetchError<ErrorResponse>;
        if (!isMounted) return;

        setStatus("error");
        setError(`An error occurred during verification: ${error.message}`);
      }
    }

    void processToken();

    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [params, nhost.auth, initialUrl]);

  // If already authenticated and not handling verification, redirect to profile
  useEffect(() => {
    if (isAuthenticated && status !== "verifying") {
      router.replace("/profile");
    }
  }, [isAuthenticated, status]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nhost SDK Demo</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Email Verification</Text>

        <View style={styles.contentContainer}>
          {status === "verifying" && (
            <View>
              <Text style={styles.statusText}>Verifying your email...</Text>
              <ActivityIndicator
                size="large"
                color="#6366f1"
                style={styles.spinner}
              />
            </View>
          )}

          {status === "success" && (
            <View>
              <Text style={styles.successText}>✓ Successfully verified!</Text>
              <Text style={styles.statusText}>
                You&apos;ll be redirected to your profile page shortly...
              </Text>
            </View>
          )}

          {status === "error" && (
            <View>
              <Text style={styles.errorText}>Verification failed</Text>
              <Text style={styles.statusText}>{error}</Text>

              <View style={styles.debugInfo}>
                <Text style={styles.debugTitle}>Testing in Expo Go?</Text>
                <Text style={styles.debugText}>
                  Make sure your magic link uses the proper Expo Go format.
                </Text>
              </View>

              {Object.keys(urlParams).length > 0 && (
                <View style={styles.paramsContainer}>
                  <Text style={styles.paramsTitle}>URL Parameters:</Text>
                  {Object.entries(urlParams).map(([key, value]) => (
                    <View key={key} style={styles.paramRow}>
                      <Text style={styles.paramKey}>{key}:</Text>
                      <Text style={styles.paramValue}>
                        {value?.toString() || "undefined"}
                      </Text>
                    </View>
                  ))}
                </View>
              )}

              <TouchableOpacity
                onPress={() => router.replace("/signin")}
                style={styles.button}
              >
                <Text style={styles.buttonText}>Back to Sign In</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  debugInfo: {
    backgroundColor: "#fff8dc",
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#ffd700",
  },
  debugTitle: {
    fontWeight: "bold",
    marginBottom: 5,
    color: "#b8860b",
  },
  debugText: {
    color: "#5a4a00",
    fontSize: 14,
  },
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  card: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  contentContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  statusText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 15,
    color: "#4a5568",
  },
  spinner: {
    marginVertical: 20,
  },
  successText: {
    color: "#38a169",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  errorText: {
    color: "#e53e3e",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  paramsContainer: {
    backgroundColor: "#f7fafc",
    borderRadius: 5,
    padding: 10,
    marginVertical: 15,
    width: "100%",
    maxHeight: 150,
  },
  paramsTitle: {
    fontWeight: "bold",
    marginBottom: 5,
    color: "#2d3748",
  },
  paramRow: {
    flexDirection: "row",
    marginBottom: 5,
  },
  paramKey: {
    color: "#4299e1",
    marginRight: 5,
    fontFamily: "monospace",
  },
  paramValue: {
    flex: 1,
    fontFamily: "monospace",
    color: "#2d3748",
  },
  button: {
    backgroundColor: "#6366f1",
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 15,
    width: "100%",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
