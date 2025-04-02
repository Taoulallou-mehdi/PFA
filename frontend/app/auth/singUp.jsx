import { View, Text, Image, TextInput, StyleSheet, TouchableOpacity, Pressable, StatusBar, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import React, { useState } from 'react';
import Colors from '../../constant/Colors';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import * as Facebook from 'expo-auth-session/providers/facebook';
import * as AuthSession from 'expo-auth-session';

// Permet à l'authentification web de fonctionner en redirection
WebBrowser.maybeCompleteAuthSession();

export default function SignUp() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Configuration pour Google Sign-In
  // Remplacez ces valeurs par vos propres identifiants
  const [googleRequest, googleResponse, googlePromptAsync] = Google.useAuthRequest({
    expoClientId: 'VOTRE_EXPO_CLIENT_ID',
    iosClientId: 'VOTRE_IOS_CLIENT_ID',
    androidClientId: 'VOTRE_ANDROID_CLIENT_ID',
    webClientId: 'VOTRE_WEB_CLIENT_ID',
  });

  // Configuration pour Facebook Login
  // Remplacez ces valeurs par vos propres identifiants
  const [fbRequest, fbResponse, fbPromptAsync] = Facebook.useAuthRequest({
    clientId: 'VOTRE_FACEBOOK_APP_ID',
  });

  React.useEffect(() => {
    if (googleResponse?.type === 'success') {
      const { authentication } = googleResponse;
      // Récupérer les informations utilisateur avec le token d'accès
      fetchGoogleUserInfo(authentication.accessToken);
    }
  }, [googleResponse]);

  React.useEffect(() => {
    if (fbResponse?.type === 'success') {
      const { authentication } = fbResponse;
      // Récupérer les informations utilisateur avec le token d'accès
      fetchFacebookUserInfo(authentication.accessToken);
    }
  }, [fbResponse]);

  const fetchGoogleUserInfo = async (accessToken) => {
    try {
      setIsLoading(true);
      const response = await fetch(
        'https://www.googleapis.com/userinfo/v2/me',
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      const userInfo = await response.json();
      
      // Traiter les informations de l'utilisateur
      console.log('Google User Info:', userInfo);
      
      // Vous pouvez pré-remplir le formulaire ou enregistrer directement l'utilisateur
      setEmail(userInfo.email);
      setFullName(userInfo.name);
      
      // Enregistrer l'utilisateur dans votre base de données ou le connecter directement
      // handleSocialSignUp(userInfo, 'google');
      
      Alert.alert('Succès', `Connecté avec Google en tant que ${userInfo.name}`);
      setIsLoading(false);
    } catch (error) {
      console.error('Erreur lors de la récupération des informations Google:', error);
      Alert.alert('Erreur', 'Impossible de récupérer vos informations Google');
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
      
      // Traiter les informations de l'utilisateur
      console.log('Facebook User Info:', userInfo);
      
      // Vous pouvez pré-remplir le formulaire ou enregistrer directement l'utilisateur
      if (userInfo.email) setEmail(userInfo.email);
      setFullName(userInfo.name);
      
      // Enregistrer l'utilisateur dans votre base de données ou le connecter directement
      // handleSocialSignUp(userInfo, 'facebook');
      
      Alert.alert('Succès', `Connecté avec Facebook en tant que ${userInfo.name}`);
      setIsLoading(false);
    } catch (error) {
      console.error('Erreur lors de la récupération des informations Facebook:', error);
      Alert.alert('Erreur', 'Impossible de récupérer vos informations Facebook');
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await googlePromptAsync();
    } catch (error) {
      console.error('Erreur de connexion Google:', error);
      Alert.alert('Erreur', 'La connexion avec Google a échoué');
    }
  };

  const handleFacebookSignIn = async () => {
    try {
      await fbPromptAsync();
    } catch (error) {
      console.error('Erreur de connexion Facebook:', error);
      Alert.alert('Erreur', 'La connexion avec Facebook a échoué');
    }
  };

  const handleSignUp = () => {
    // Logique d'inscription traditionnelle ici
    console.log('Inscription avec:', fullName, email, password);
    // Navigation après une inscription réussie
    // router.push('/home');
  };

  // Fonction pour gérer l'inscription via réseaux sociaux
  const handleSocialSignUp = (userInfo, provider) => {
    // Logique pour enregistrer l'utilisateur dans votre système
    console.log(`Inscription via ${provider}:`, userInfo);
    // Une fois l'inscription terminée, rediriger vers la page d'accueil
    // router.push('/home');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <StatusBar barStyle="dark-content" backgroundColor={Colors.WHITE} />
        
        <View style={styles.container}>
          <View style={styles.logoContainer}>
            <Image
              source={require('./../../assets/images/istockphoto.jpg')}
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
              {isLoading ? 'Chargement...' : 'Créer le compte'}
            </Text>
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>ou s'inscrire avec</Text>
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

          <View style={styles.signInContainer}>
            <Text style={styles.signInText}>Vous avez déjà un compte?</Text>
            <Pressable onPress={() => router.push('/auth/singin')}>
              <Text style={styles.signInLink}>Connexion</Text>
            </Pressable>
          </View>
          
          <View style={styles.termsContainer}>
            <Text style={styles.termsText}>
              En vous inscrivant, vous acceptez nos{' '}
              <Text style={styles.termsLink}>conditions d'utilisation</Text> et notre{' '}
              <Text style={styles.termsLink}>politique de confidentialité</Text>
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  // Styles existants conservés
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logo: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: Colors.TEXT_DARK || '#000',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: Colors.TEXT_GRAY || '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.INPUT_BG || '#f5f5f5',
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.INPUT_BORDER || '#eaeaea',
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    height: 55,
    fontSize: 16,
    color: Colors.TEXT_DARK || '#000',
  },
  passwordInput: {
    paddingRight: 40,
  },
  eyeIcon: {
    position: 'absolute',
    right: 15,
  },
  signUpButton: {
    width: '100%',
    height: 55,
    backgroundColor: Colors.GREEN,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
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
    fontWeight: 'bold',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: 25,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.DIVIDER || '#eaeaea',
  },
  dividerText: {
    marginHorizontal: 15,
    color: Colors.TEXT_GRAY || '#666',
    fontSize: 14,
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 25,
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.WHITE,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: Colors.BORDER_LIGHT || '#eaeaea',
  },
  signInContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  signInText: {
    fontSize: 16,
    color: Colors.TEXT_GRAY || '#666',
  },
  signInLink: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.GREEN,
    marginLeft: 5,
  },
  termsContainer: {
    marginTop: 15,
    paddingHorizontal: 10,
  },
  termsText: {
    fontSize: 13,
    color: Colors.TEXT_GRAY || '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  termsLink: {
    color: Colors.GREEN,
    fontWeight: '500',
  },
});