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
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from "react";
import Colors from "../../constant/Colors";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import config from '../../config';

WebBrowser.maybeCompleteAuthSession();

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [googleRequest, googleResponse, googlePromptAsync] = Google.useAuthRequest({
    expoClientId: "YOUR_EXPO_CLIENT_ID",
    iosClientId: "YOUR_IOS_CLIENT_ID",
    androidClientId: "YOUR_ANDROID_CLIENT_ID",
    webClientId: "YOUR_WEB_CLIENT_ID",
  });

  useEffect(() => {
    if (googleResponse?.type === "success") {
      const { authentication } = googleResponse;
      console.log("Google Auth Success", authentication);
      fetchGoogleUserInfo(authentication.accessToken);
    } else {
      console.log("Google Auth Failure", googleResponse);
    }
  }, [googleResponse]);

  const fetchGoogleUserInfo = async (accessToken) => {
    try {
      setIsLoading(true);
      const response = await fetch("https://www.googleapis.com/userinfo/v2/me", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const userInfo = await response.json();
      console.log("Google User Info:", userInfo);
      handleSocialLogin(userInfo, "google");
      Alert.alert("Succès", `Connecté avec Google en tant que ${userInfo.name}`);
      router.push("/tabs/home");
    } catch (error) {
      console.error("Error fetching Google user info:", error);
      Alert.alert("Erreur", "Impossible de récupérer les informations Google");
    } finally {
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

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }
    setIsLoading(true);
    try {
      console.log("Trying to login with:", { email, password });
      const response = await fetch(`${config.BACKEND_URL}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log("Backend Response:", data);

      if (response.ok) {
        await AsyncStorage.setItem('token', data.token);
        console.log('User logged in successfully:', data);
        Alert.alert('Succès', 'Connexion réussie');
        router.push('/tabs/home');
      } else {
        console.error('Login failed:', data.message);
        Alert.alert('Erreur', data.message || 'Une erreur est survenue');
      }
    } catch (error) {
      console.error('Error during login:', error);
      Alert.alert('Erreur', 'Impossible de se connecter au serveur');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (userInfo, provider) => {
    console.log(`Login via ${provider}:`, userInfo);
    // Additional logic for social login can go here
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
          style={[styles.socialButton, { borderColor: "#DB4437" }]}
          onPress={handleGoogleSignIn}
          disabled={isLoading}
          activeOpacity={0.8}
        >
          <Ionicons name="logo-google" size={24} color="#DB4437" />
          <Text style={styles.socialButtonText}>Se connecter avec Google</Text>
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
  container: { flex: 1, backgroundColor: Colors.WHITE, alignItems: "center", justifyContent: "center", paddingHorizontal: 24 },
  logoContainer: { alignItems: "center", marginBottom: 30 },
  logo: { width: 150, height: 150, borderRadius: 75 },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 10, color: Colors.TEXT_DARK || "#000", textAlign: "center" },
  subtitle: { fontSize: 16, color: Colors.TEXT_GRAY || "#666", marginBottom: 30, textAlign: "center" },
  inputContainer: { width: "100%", marginBottom: 20 },
  inputWrapper: { flexDirection: "row", alignItems: "center", backgroundColor: Colors.INPUT_BG || "#f5f5f5", borderRadius: 12, marginBottom: 16, borderWidth: 1, borderColor: Colors.INPUT_BORDER || "#eaeaea", paddingHorizontal: 12 },
  inputIcon: { marginRight: 10 },
  textInput: { flex: 1, height: 55, fontSize: 16, color: Colors.TEXT_DARK || "#000" },
  passwordInput: { paddingRight: 40 },
  eyeIcon: { position: "absolute", right: 15 },
  forgotPassword: { alignSelf: "flex-end", marginTop: 5 },
  forgotPasswordText: { color: Colors.GREEN, fontSize: 14, fontWeight: "600" },
  signInButton: { width: "100%", height: 55, backgroundColor: Colors.GREEN, borderRadius: 12, justifyContent: "center", alignItems: "center", marginTop: 10, shadowColor: Colors.GREEN, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 6, elevation: 3 },
  signInButtonText: { color: Colors.WHITE, fontSize: 18, fontWeight: "bold" },
  divider: { flexDirection: "row", alignItems: "center", width: "100%", marginVertical: 30 },
  dividerLine: { flex: 1, height: 1, backgroundColor: Colors.DIVIDER || "#eaeaea" },
  dividerText: { marginHorizontal: 15, color: Colors.TEXT_GRAY || "#666", fontSize: 14 },
  socialButtonsContainer: { flexDirection: "row", justifyContent: "center", marginBottom: 30 },
  socialButton: { flexDirection: "row", alignItems: "center", width: "80%", height: 50, borderRadius: 25, backgroundColor: Colors.WHITE, justifyContent: "center", marginHorizontal: 10, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 2, borderWidth: 1.5, borderColor: Colors.BORDER_LIGHT || "#eaeaea", marginBottom: 10 },
  socialButtonText: { marginLeft: 10, color: "#DB4437", fontWeight: "bold", fontSize: 16 },
  signUpContainer: { flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 10 },
  signUpText: { fontSize: 16, color: Colors.TEXT_GRAY || "#666" },
  signUpLink: { fontSize: 16, fontWeight: "bold", color: Colors.GREEN, marginLeft: 5 },
});
