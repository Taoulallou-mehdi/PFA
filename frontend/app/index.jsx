import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import Colors from "../constant/Colors";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const router=useRouter();
  return (
    <View style={styles.container}>
      {/* Top Section */}
      <View style={styles.topSection}>
        <TouchableOpacity style={styles.loginButton}
        
        onPress={()=>router.push('/auth/singUp')}>
        
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
      </View>

      {/* Logo Section */}
      <View style={styles.logoContainer}>
        <View style={styles.logoBackground}>
          <Image
            source={require('./../assets/images/wasteAI.png')} // Replace with your logo
            style={styles.logo}
          />
        </View>
      </View>

      {/* Title Section */}
      <Text style={styles.title}>Env++ Waste Management</Text>
      <Text style={styles.subtitle}>
        Join our community in making waste management more efficient and
        rewarding!
      </Text>

      {/* Button Section */}
      <TouchableOpacity style={styles.getStartedButton}
       onPress={()=>router.push('/auth/singin')}>
        
      

        <Text style={styles.getStartedButtonText}>Get Started →</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  topSection: {
    position: "absolute",
    top: 20,
    right: 20,
  },
  loginButton: {
    backgroundColor: Colors.GREEN,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  loginButtonText: {
    color: Colors.WHITE,
    fontSize: 16,
    fontWeight: "bold",
  },
  logoContainer: {
    backgroundColor: Colors.GREEN,
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  logoBackground: {
    backgroundColor: Colors.WHITE,
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: '100%',
    height: '100%',
    borderRadius: 40,

  },
  title: {
    fontSize: 24,
    fontFamily: "YourFont-Bold",
    color: Colors.GREEN,
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
  },
  getStartedButton: {
    backgroundColor: Colors.GREEN,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  getStartedButtonText: {
    color: Colors.WHITE,
    fontSize: 18,
    fontFamily: "YourFont-Bold",
    textAlign: "center",
  },
});
