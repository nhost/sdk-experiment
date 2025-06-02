import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { useAuth } from "./lib/nhost/AuthProvider";
import ProtectedScreen from "./components/ProtectedScreen";

export default function Profile() {
  const { nhost, user, session } = useAuth();

  const handleSignOut = async () => {
    try {
      const session = nhost.getUserSession();
      if (session) {
        await nhost.auth.signOut({
          refreshToken: session.refreshToken,
        });
      }

      router.replace("/signin");
    } catch {
      Alert.alert("Error", "Failed to sign out");
    }
  };

  return (
    <ProtectedScreen>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        <Text style={styles.title}>Your Profile</Text>

        <View style={styles.card}>
          <View style={styles.profileItem}>
            <Text style={styles.itemLabel}>Display Name:</Text>
            <Text style={styles.itemValue}>
              {user?.displayName || "Not set"}
            </Text>
          </View>

          <View style={styles.profileItem}>
            <Text style={styles.itemLabel}>Email:</Text>
            <Text style={styles.itemValue}>
              {user?.email || "Not available"}
            </Text>
          </View>

          <View style={styles.profileItem}>
            <Text style={styles.itemLabel}>User ID:</Text>
            <Text
              style={styles.itemValue}
              numberOfLines={1}
              ellipsizeMode="middle"
            >
              {user?.id || "Not available"}
            </Text>
          </View>

          <View style={styles.profileItem}>
            <Text style={styles.itemLabel}>Roles:</Text>
            <Text style={styles.itemValue}>
              {user?.roles?.join(", ") || "None"}
            </Text>
          </View>

          <View style={styles.profileItem}>
            <Text style={styles.itemLabel}>Email Verified:</Text>
            <Text style={styles.itemValue}>
              {user?.emailVerified ? "Yes" : "No"}
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Session Information</Text>
          <View style={styles.sessionInfo}>
            <Text style={styles.sessionText}>Refresh Token ID:</Text>
            <Text
              style={styles.sessionValue}
              numberOfLines={1}
              ellipsizeMode="middle"
            >
              {session?.refreshTokenId || "None"}
            </Text>

            <Text style={styles.sessionText}>Access Token Expires In:</Text>
            <Text style={styles.sessionValue}>
              {session?.accessTokenExpiresIn
                ? `${session.accessTokenExpiresIn}s`
                : "N/A"}
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Text style={styles.signOutButtonText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </ProtectedScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  profileItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  itemLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  itemValue: {
    fontSize: 16,
    color: "#666",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
  },
  sessionInfo: {
    backgroundColor: "#f8f8f8",
    padding: 12,
    borderRadius: 6,
  },
  sessionText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    marginBottom: 2,
  },
  sessionValue: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
  },
  signOutButton: {
    backgroundColor: "#e53e3e",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  signOutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
