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
  ScrollView,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import Colors from "../../constant/Colors";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import config from '../../config';

// Allow web authentication to complete
WebBrowser.maybeCompleteAuthSession();

export default function SignUp() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
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

  useEffect(() => {
    if (googleResponse?.type === "success") {
      const { authentication } = googleResponse;
      console.log("Google Auth Success", authentication);  // Log Google Auth success
      fetchGoogleUserInfo(authentication.accessToken);
    } else {
      console.log("Google Auth Failure", googleResponse);  // Log Google Auth failure
    }
  }, [googleResponse]);

  const fetchGoogleUserInfo = async (accessToken) => {
    try {
      setIsLoading(true);
      const response = await fetch("https://www.googleapis.com/userinfo/v2/me", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const userInfo = await response.json();
      console.log("Google User Info:", userInfo);  // Log user info fetched from Google

      // Pre-fill the form or register the user directly
      setEmail(userInfo.email);
      setFullName(userInfo.name);

      Alert.alert("Succès", `Connecté avec Google en tant que ${userInfo.name}`);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching Google user info:", error);
      Alert.alert("Erreur", "Impossible de récupérer les informations Google");
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await googlePromptAsync();
    } catch (error) {
      console.error("Google Sign-In Error:", error);
      Alert.alert("Erreur", "La connexion Google a échoué");
    }
  };

  const handleSignUp = async () => {
    if (!fullName || !email || !password) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs");
      return;
    }

    setIsLoading(true);

    try {
      // Log the form data before sending it to the backend
      console.log("Form Data:", { name: fullName, email: email, password: password });

      // Send a POST request to the backend to register the user
      const response = await fetch(`${config.BACKEND_URL}/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fullName,
          email: email,
          password: password,
          role: 'citoyen', // Default role, can be adjusted as needed
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Registration successful
        console.log("User registered successfully:", data);
        Alert.alert("Succès", "Inscription réussie");
        router.push("/tabs/home"); // Navigate to the home page
      } else {
        // Handle errors returned by the backend
        console.error("Registration failed:", data.message);
        Alert.alert("Erreur", data.message || "Une erreur est survenue");
      }
    } catch (error) {
      // Handle network or unexpected errors
      console.error("Error during registration:", error);
      Alert.alert("Erreur", "Impossible de se connecter au serveur");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <StatusBar barStyle="dark-content" backgroundColor={Colors.WHITE} />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.logoContainer}>
          <Image
            source={require("./../../assets/images/istockphoto.jpg")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.title}>Créer un compte</Text>
        <Text style={styles.subtitle}>Veuillez remplir les informations ci-dessous</Text>

        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <Ionicons name="person-outline" size={20} color={Colors.GRAY} style={styles.inputIcon} />
            <TextInput
              placeholder="Nom complet"
              style={styles.textInput}
              value={fullName}
              onChangeText={setFullName}
            />
          </View>

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
        </View>

        <TouchableOpacity
          style={styles.signUpButton}
          onPress={handleSignUp}
          activeOpacity={0.8}
          disabled={isLoading}
        >
          <Text style={styles.signUpButtonText}>
            {isLoading ? "Chargement..." : "Créer un compte"}
          </Text>
        </TouchableOpacity>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>ou</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Google Sign-In Button */}
        <View style={styles.socialButtonsContainer}>
          <TouchableOpacity
            style={[styles.socialButton, { borderColor: "#DB4437" }]}
            onPress={handleGoogleSignIn}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            <Ionicons name="logo-google" size={24} color="#DB4437" />
            <Text style={styles.socialButtonText}>S'inscrire avec Google</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.signInContainer}>
          <Text style={styles.signInText}>Vous avez déjà un compte ?</Text>
          <Pressable onPress={() => router.push("/auth/singin")}>
            <Text style={styles.signInLink}>Se connecter</Text>
          </Pressable>
        </View>

        <View style={styles.termsContainer}>
          <Text style={styles.termsText}>
            En vous inscrivant, vous acceptez nos{" "}
            <Text style={styles.termsLink}>Conditions d'utilisation</Text> et{" "}
            <Text style={styles.termsLink}>Politique de confidentialité</Text>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 40,
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
  signUpButton: {
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
  signUpButtonText: {
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
    flexDirection: "row",
    alignItems: "center",
    width: "80%",
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.WHITE,
    justifyContent: "center",
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1.5,
    borderColor: Colors.BORDER_LIGHT || "#eaeaea",
    marginBottom: 10,
  },
  socialButtonText: {
    marginLeft: 10,
    color: "#DB4437",
    fontWeight: "bold",
    fontSize: 16,
  },
  signInContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  signInText: {
    fontSize: 16,
    color: Colors.TEXT_GRAY || "#666",
  },
  signInLink: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.GREEN,
    marginLeft: 5,
  },
  termsContainer: {
    marginTop: 15,
    paddingHorizontal: 10,
  },
  termsText: {
    fontSize: 13,
    color: Colors.TEXT_GRAY || "#666",
    textAlign: "center",
    lineHeight: 20,
  },
  termsLink: {
    color: Colors.GREEN,
    fontWeight: "500",
  },
});
