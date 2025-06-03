import React from "react";
import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
import AppleSignIn from "./AppleSignIn";

interface NativeLoginFormProps {
  action: "Sign In" | "Sign Up";
  isLoading: boolean;
  setAppleAuthInProgress: (inProgress: boolean) => void;
}

export default function NativeLoginForm({
  action,
  isLoading,
  setAppleAuthInProgress,
}: NativeLoginFormProps) {
  // Function to update loading state
  const updateLoadingState = (loading: boolean) => {
    if (setAppleAuthInProgress) {
      setAppleAuthInProgress(loading);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        {action} using native authentication methods
      </Text>
      {isLoading ? (
        <ActivityIndicator size="large" color="#6366f1" />
      ) : (
        <View style={styles.buttonContainer}>
          <AppleSignIn
            action={action}
            isLoading={isLoading}
            setIsLoading={updateLoadingState}
          />
          <Text style={styles.infoText}>
            Native sign-in options are available based on your device
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingVertical: 10,
    width: "100%",
  },
  text: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
    color: "#4a5568",
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
  },
  infoText: {
    marginTop: 10,
    fontSize: 12,
    color: "#718096",
    textAlign: "center",
  },
});
