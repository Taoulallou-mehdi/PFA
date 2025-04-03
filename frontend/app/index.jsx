import React, { useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Animated, Easing } from "react-native";
import Colors from "../constant/Colors";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

export default function HomeScreen() {
  const router = useRouter();
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  
  // Create pulse and rotation animations
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
      ])
    ).start();
    
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 10000,
        useNativeDriver: true,
        easing: Easing.linear,
      })
    ).start();
  }, []);
  
  // Map rotation value to degrees
  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  
  return (
    <LinearGradient
      colors={[Colors.WHITE, '#f0f8f0']}
      style={styles.container}
    >
      {/* Background Elements */}
      <View style={styles.backgroundCircle1} />
      <View style={styles.backgroundCircle2} />
      
      {/* Top Section */}
      <View style={styles.topSection}>
        <TouchableOpacity 
          style={styles.loginButton}
          onPress={() => router.push('/auth/singUp')}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
      </View>
      
      {/* Logo Section - Animated */}
      <Animated.View 
        style={[
          styles.logoContainer,
          {
            transform: [
              { scale: pulseAnim },
            ]
          }
        ]}
      >
        <Animated.View 
          style={[
            styles.logoRing,
            {
              transform: [
                { rotate: rotation }
              ]
            }
          ]}
        />
        <View style={styles.logoBackground}>
          <Text style={styles.logoText}>E++</Text>
        </View>
      </Animated.View>
      
      {/* Title Section */}
      <Text style={styles.title}>Env++ Waste Management</Text>
      <Text style={styles.subtitle}>
        Join our community in making waste management more efficient and
        rewarding!
      </Text>
      
      {/* Button Section */}
      <TouchableOpacity 
        style={styles.getStartedButton}
        activeOpacity={0.8}
        onPress={() => router.push('/auth/singin')}>
        <LinearGradient
          colors={[Colors.GREEN, '#2a9d54']}
          style={styles.gradientButton}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Text style={styles.getStartedButtonText}>Get Started →</Text>
        </LinearGradient>
      </TouchableOpacity>
      
      {/* Footer Text */}
      <Text style={styles.footerText}>
        Making the world cleaner, one step at a time
      </Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    position: "relative",
    overflow: "hidden",
  },
  backgroundCircle1: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(100, 220, 120, 0.1)',
    top: -50,
    left: -50,
  },
  backgroundCircle2: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(100, 220, 120, 0.1)',
    bottom: -30,
    right: -30,
  },
  topSection: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 10,
  },
  loginButton: {
    backgroundColor: 'rgba(42, 157, 84, 0.8)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  loginButtonText: {
    color: Colors.WHITE,
    fontSize: 16,
    fontWeight: "bold",
  },
  logoContainer: {
    width: 120,
    height: 120,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 40,
    position: "relative",
  },
  logoRing: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: Colors.GREEN,
    borderStyle: "dashed",
  },
  logoBackground: {
    backgroundColor: Colors.GREEN,
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  logoText: {
    fontSize: 32,
    fontWeight: "bold",
    color: Colors.WHITE,
    letterSpacing: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.GREEN,
    textAlign: "center",
    marginBottom: 10,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 22,
    maxWidth: "80%",
  },
  getStartedButton: {
    width: "80%",
    maxWidth: 300,
    borderRadius: 25,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  gradientButton: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  getStartedButtonText: {
    color: Colors.WHITE,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  footerText: {
    position: "absolute",
    bottom: 30,
    color: "#666",
    fontSize: 14,
    fontStyle: "italic",
  }
});