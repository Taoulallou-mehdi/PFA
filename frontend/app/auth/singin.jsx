import { View, Text, Image, TextInput, StyleSheet, TouchableOpacity, Pressable, StatusBar, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import Colors from '../../constant/Colors';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import * as Facebook from 'expo-auth-session/providers/facebook';
import * as AuthSession from 'expo-auth-session';

// Enable web authentication to work with redirects
WebBrowser.maybeCompleteAuthSession();

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Google Sign-In configuration
  // Replace these values with your own credentials
  const [googleRequest, googleResponse, googlePromptAsync] = Google.useAuthRequest({
    expoClientId: 'VOTRE_EXPO_CLIENT_ID',
    iosClientId: 'VOTRE_IOS_CLIENT_ID',
    androidClientId: 'VOTRE_ANDROID_CLIENT_ID',
    webClientId: 'VOTRE_WEB_CLIENT_ID',
  });

  // Configuration for Facebook Login
  // Replace these values with your own credentials
  const [fbRequest, fbResponse, fbPromptAsync] = Facebook.useAuthRequest({
    clientId: 'VOTRE_FACEBOOK_APP_ID',
  });

  useEffect(() => {
    if (googleResponse?.type === 'success') {
      const { authentication } = googleResponse;
      // Fetch user information with the access token
      fetchGoogleUserInfo(authentication.accessToken);
    }
  }, [googleResponse]);

  useEffect(() => {
    if (fbResponse?.type === 'success') {
      const { authentication } = fbResponse;
      // Fetch user information with the access token
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
      
      // Process user information
      console.log('Google User Info:', userInfo);
      
      // Connect the user to your system
      handleSocialLogin(userInfo, 'google');
      
      Alert.alert('Success', `Connected with Google as ${userInfo.name}`);
      setIsLoading(false);
      
      // Redirect to tabs page after successful login
      router.replace('/tabs');
    } catch (error) {
      console.error('Error retrieving Google information:', error);
      Alert.alert('Error', 'Could not retrieve your Google information');
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
      
      // Process user information
      console.log('Facebook User Info:', userInfo);
      
      // Connect the user to your system
      handleSocialLogin(userInfo, 'facebook');
      
      Alert.alert('Success', `Connected with Facebook as ${userInfo.name}`);
      setIsLoading(false);
      
      // Redirect to home page after successful login
      router.replace('/tabs');
    } catch (error) {
      console.error('Error retrieving Facebook information:', error);
      Alert.alert('Error', 'Could not retrieve your Facebook information');
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await googlePromptAsync();
    } catch (error) {
      console.error('Google login error:', error);
      Alert.alert('Error', 'Google login failed');
    }
  };


  const handleFacebookSignIn = async () => {
    try {
      await fbPromptAsync();
    } catch (error) {
      console.error('Facebook login error:', error);
      Alert.alert('Error', 'Facebook login failed');
    }
  };

  const handleSignIn = async () => {
    // Validate input fields
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setIsLoading(true);

    try {
      // Send a POST request to the backend to log in the user
      const response = await fetch(`http://192.168.1.88:5000/api/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
          // Login successful
          console.log('User logged in successfully:', data);
          Alert.alert('Success', 'Login successful');
          router.replace('/tabs'); // Navigate to the tabs page
      } else {
          // Handle errors returned by the backend
          console.error('Login failed:', data.message);
          Alert.alert('Error', data.message || 'An error occurred');
      }
    } catch (error) {
        // Handle network or unexpected errors
        console.error('Error during login:', error);
        Alert.alert('Error', 'Unable to connect to the server');
    } finally {
        setIsLoading(false);
    }
  };

  // Function to handle social login
  const handleSocialLogin = (userInfo, provider) => {
    // Logic to connect the user to your system
    console.log(`Login via ${provider}:`, userInfo);
    
    // You might want to make a request to your MongoDB API here
    // To check if the user exists or create them, then return a token
    /*
    fetch('your-api-url/auth/social-login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        provider,
        providerId: userInfo.id,
        email: userInfo.email,
        name: userInfo.name,
        // other useful information
      }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          // Store user token or data
          // AsyncStorage.setItem('userToken', data.token);
        }
      })
      .catch(error => {
        console.error('Error in social login:', error);
      });
    */
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <StatusBar barStyle="dark-content" backgroundColor={Colors.WHITE} />
      
      <View style={styles.logoContainer}>
        <Image
          source={require('./../../assets/images/istockphoto.jpg')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <Text style={styles.title}>Sign In</Text>
      <Text style={styles.subtitle}>Please enter your login credentials</Text>

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
            placeholder="Password"
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
        
        <Pressable style={styles.forgotPassword} onPress={() => router.push('/auth/resetPassword')}>
          <Text style={styles.forgotPasswordText}>Forgot password?</Text>
        </Pressable>
      </View>

      <TouchableOpacity
        style={styles.signInButton}
        onPress={handleSignIn}
        activeOpacity={0.8}
        disabled={isLoading}
      >
        <Text style={styles.signInButtonText}>
          {isLoading ? 'Loading...' : 'Sign In'}
        </Text>
      </TouchableOpacity>

      <View style={styles.divider}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>or</Text>
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
        <Text style={styles.signUpText}>Don't have an account?</Text>
        <Pressable onPress={() => router.push('/auth/singUp')}>
          <Text style={styles.signUpLink}>Sign up</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
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
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: 5,
  },
  forgotPasswordText: {
    color: Colors.GREEN,
    fontSize: 14,
    fontWeight: '600',
  },
  signInButton: {
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
  signInButtonText: {
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
    marginBottom: 30,
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
  googleButton: {
    flexDirection: 'row',
    width: '100%',
    height: 55,
    backgroundColor: Colors.WHITE,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  googleIcon: {
    marginRight: 10,
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.TEXT_DARK || '#000',
  },
  signUpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  signUpText: {
    fontSize: 16,
    color: Colors.TEXT_GRAY || '#666',
  },
  signUpLink: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.GREEN,
    marginLeft: 5,
  },
});