import {
  View,
  Text,
  Image,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import Colors from "../../constant/Colors";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import * as Facebook from "expo-auth-session/providers/facebook";
import config from '../../config.js';

// Allow web authentication to complete
WebBrowser.maybeCompleteAuthSession();

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Google Sign-In Configuration
  const [googleRequest, googleResponse, googlePromptAsync] = Google.useAuthRequest({
    expoClientId: "YOUR_EXPO_CLIENT_ID",
    iosClientId: "YOUR_IOS_CLIENT_ID",
    androidClientId: "YOUR_ANDROID_CLIENT_ID",
    webClientId: "YOUR_WEB_CLIENT_ID",
  });

  // Facebook Login Configuration
  const [fbRequest, fbResponse, fbPromptAsync] = Facebook.useAuthRequest({
    clientId: "YOUR_FACEBOOK_APP_ID",
  });

  useEffect(() => {
    if (googleResponse?.type === "success") {
      const { authentication } = googleResponse;
      fetchGoogleUserInfo(authentication.accessToken);
    }
  }, [googleResponse]);

  useEffect(() => {
    if (fbResponse?.type === "success") {
      const { authentication } = fbResponse;
      fetchFacebookUserInfo(authentication.accessToken);
    }
  }, [fbResponse]);

  const fetchGoogleUserInfo = async (accessToken) => {
    try {
      setIsLoading(true);
      const response = await fetch("https://www.googleapis.com/userinfo/v2/me", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const userInfo = await response.json();
      console.log("Google User Info:", userInfo);
      handleSocialLogin(userInfo, "google");
      Alert.alert("Success", `Connected with Google as ${userInfo.name}`);
      router.push("/home");
    } catch (error) {
      console.error("Error fetching Google user info:", error);
      Alert.alert("Error", "Unable to fetch Google user info");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFacebookUserInfo = async (accessToken) => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${accessToken}`
      );
      const userInfo = await response.json();
      console.log("Facebook User Info:", userInfo);
      handleSocialLogin(userInfo, "facebook");
      Alert.alert("Success", `Connected with Facebook as ${userInfo.name}`);
      router.push("/home");
    } catch (error) {
      console.error("Error fetching Facebook user info:", error);
      Alert.alert("Error", "Unable to fetch Facebook user info");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await googlePromptAsync();
    } catch (error) {
      console.error("Google Sign-In Error:", error);
      Alert.alert("Error", "Google Sign-In failed");
    }
  };

  const handleFacebookSignIn = async () => {
    try {
      await fbPromptAsync();
    } catch (error) {
      console.error("Facebook Sign-In Error:", error);
      Alert.alert("Error", "Facebook Sign-In failed");
    }
  };

  const handleSignIn = async () => {
    if (!email || !password) {

        Alert.alert('Erreur', 'Veuillez remplir tous les champs');
        return;
    }
    setIsLoading(true);
    try {
        // Send a POST request to the backend to log in the user
        const response = await fetch(`${config.BACKEND_URL}/api/users/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
            // Login successful
            console.log('User logged in successfully:', data);
            Alert.alert('Succès', 'Connexion réussie');
            router.push('/(tabs)'); // Navigate to the main page
        } else {
            // Handle errors returned by the backend
            console.error('Login failed:', data.message);
            Alert.alert('Erreur', data.message || 'Une erreur est survenue');
        }
    } catch (error) {
        // Handle network or unexpected errors
        console.error('Error during login:', error);
        Alert.alert('Erreur', 'Impossible de se connecter au serveur');
    } finally {
        setIsLoading(false);
    }
};

  const handleSocialLogin = (userInfo, provider) => {
    console.log(`Login via ${provider}:`, userInfo);
    // Implement logic to handle social login
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <StatusBar barStyle="dark-content" backgroundColor={Colors.WHITE} />

      <View style={styles.logoContainer}>
        <Image
          source={require("./../../assets/images/istockphoto.jpg")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <Text style={styles.title}>Connexion</Text>
      <Text style={styles.subtitle}>Veuillez entrer vos informations de connexion</Text>

      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <Ionicons name="mail-outline" size={20} color={Colors.GRAY} style={styles.inputIcon} />
          <TextInput
            placeholder="Email"
            style={styles.textInput}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputWrapper}>
          <Ionicons name="lock-closed-outline" size={20} color={Colors.GRAY} style={styles.inputIcon} />
          <TextInput
            placeholder="Mot de passe"
            style={[styles.textInput, styles.passwordInput]}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeIcon}
          >
            <Ionicons
              name={showPassword ? "eye-outline" : "eye-off-outline"}
              size={20}
              color={Colors.GRAY}
            />
          </TouchableOpacity>
        </View>

        <Pressable style={styles.forgotPassword} onPress={() => router.push("/auth/resetPassword")}>
          <Text style={styles.forgotPasswordText}>Mot de passe oublié?</Text>
        </Pressable>
      </View>

      <TouchableOpacity
        style={styles.signInButton}
        onPress={handleSignIn}
        activeOpacity={0.8}
        disabled={isLoading}
      >
        <Text style={styles.signInButtonText}>
          {isLoading ? "Chargement..." : "Se connecter"}
        </Text>
      </TouchableOpacity>

      <View style={styles.divider}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>ou</Text>
        <View style={styles.dividerLine} />
      </View>

      <View style={styles.socialButtonsContainer}>
        <TouchableOpacity
          style={styles.socialButton}
          onPress={handleGoogleSignIn}
          disabled={isLoading}
        >
          <Ionicons name="logo-google" size={20} color="#DB4437" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.socialButton}
          onPress={handleFacebookSignIn}
          disabled={isLoading}
        >
          <Ionicons name="logo-facebook" size={20} color="#4267B2" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialButton}>
          <Ionicons name="logo-apple" size={20} color="#000000" />
        </TouchableOpacity>
      </View>

      <View style={styles.signUpContainer}>
        <Text style={styles.signUpText}>Pas encore de compte?</Text>
        <Pressable onPress={() => router.push("/auth/singUp")}>
          <Text style={styles.signUpLink}>S'inscrire</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  logo: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
    color: Colors.TEXT_DARK || "#000",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: Colors.TEXT_GRAY || "#666",
    marginBottom: 30,
    textAlign: "center",
  },
  inputContainer: {
    width: "100%",
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.INPUT_BG || "#f5f5f5",
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.INPUT_BORDER || "#eaeaea",
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    height: 55,
    fontSize: 16,
    color: Colors.TEXT_DARK || "#000",
  },
  passwordInput: {
    paddingRight: 40,
  },
  eyeIcon: {
    position: "absolute",
    right: 15,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginTop: 5,
  },
  forgotPasswordText: {
    color: Colors.GREEN,
    fontSize: 14,
    fontWeight: "600",
  },
  signInButton: {
    width: "100%",
    height: 55,
    backgroundColor: Colors.GREEN,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    shadowColor: Colors.GREEN,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  signInButtonText: {
    color: Colors.WHITE,
    fontSize: 18,
    fontWeight: "bold",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginVertical: 30,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.DIVIDER || "#eaeaea",
  },
  dividerText: {
    marginHorizontal: 15,
    color: Colors.TEXT_GRAY || "#666",
    fontSize: 14,
  },
  socialButtonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 30,
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.WHITE,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: Colors.BORDER_LIGHT || "#eaeaea",
  },
  signUpContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  signUpText: {
    fontSize: 16,
    color: Colors.TEXT_GRAY || "#666",
  },
  signUpLink: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.GREEN,
    marginLeft: 5,
  },
});