import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

// Define the config object or import it
const config = {
  BACKEND_URL: "http://your-backend-url.com" // Replace with your backend URL
};

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user information from the backend
  useEffect(() => {
    const fetchUserInfo = async () => {
      setLoading(true);
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          Alert.alert("Error", "No token found. Please log in again.");
          router.replace("/auth/signin");
          return;
        }

        const response = await fetch(`${config.BACKEND_URL}/api/users/me`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`, // Ensure token is in the correct format
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data);
        } else {
          const errorData = await response.json();
          Alert.alert("Error", errorData.message || "Failed to fetch user information");
          if (response.status === 403) {
            // Token is invalid or expired
            Alert.alert("Session Expired", "Please log in again.");
            router.replace("/auth/signin");
          }
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
        Alert.alert("Error", "Unable to connect to the server");
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1E8E3E" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Small Profile Window */}
        <View style={styles.profileWindow}>
          <Text style={styles.profileInitial}>
            {user?.name ? user.name.charAt(0).toUpperCase() : "?"}
          </Text>
        </View>

        {/* User Information */}
        <Text style={styles.userName}>{user?.name || "Unknown User"}</Text>
        <Text style={styles.userEmail}>{user?.email || "No Email Provided"}</Text>

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={async () => {
            await AsyncStorage.removeItem("token");
            Alert.alert("Logged Out", "You have been logged out.");
            router.replace("/auth/signin");
          }}
        >
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#1E8E3E",
    paddingVertical: 15,
    paddingHorizontal: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  profileWindow: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#1E8E3E",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  profileInitial: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
  },
  userName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 14,
    color: "#777",
    marginBottom: 20,
  },
  logoutButton: {
    backgroundColor: "#DD4B39",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 20,
  },
  logoutText: {
    color: "white",
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
});
