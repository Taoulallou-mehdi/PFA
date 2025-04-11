import { View, Text, Image, TextInput, StyleSheet, TouchableOpacity, Pressable, StatusBar, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import Colors from '../../constant/Colors';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';

// Enable web authentication to work with redirects
WebBrowser.maybeCompleteAuthSession();

export default function SignUp() {
  const router = useRouter();
  
  const [fullName, setFullName] = useState('');
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

  useEffect(() => {
    if (googleResponse?.type === 'success') {
      const { authentication } = googleResponse;
      // Fetch user information with the access token
      fetchGoogleUserInfo(authentication.accessToken);
    }
  }, [googleResponse]);

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
      
      // You can pre-fill the form or register the user directly
      setEmail(userInfo.email);
      setFullName(userInfo.name);
      
      // Register the user in your database or log them in directly
      handleSocialSignUp(userInfo, 'google');
      
      Alert.alert('Success', `Connected with Google as ${userInfo.name}`);
      setIsLoading(false);
    } catch (error) {
      console.error('Error retrieving Google information:', error);
      Alert.alert('Error', 'Could not retrieve your Google information');
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

  const handleSignUp = async () => {
    // Validate input fields
    if (!email || !password || !fullName) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

   /* try {
      setIsLoading(true);
      // Send a POST request to the backend to register the user
      const response = await fetch(`http://10.10.1.176:5000/api/users/register`, {
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
          console.log('User registered successfully:', data);
          Alert.alert('Success', 'Registration successful');
          router.push('/tabs/home'); // Navigate to the home page
      } else {
          // Handle errors returned by the backend
          console.error('Registration failed:', data.message);
          Alert.alert('Error', data.message || 'An error occurred');
      }
    } catch (error) {
      // Handle network or unexpected errors
      console.error('Error during registration:', error);
      Alert.alert('Error', 'Unable to connect to the server');
    } finally {
      setIsLoading(false);
    }*/
  };

  // Function to handle registration via social networks
  const handleSocialSignUp = (userInfo, provider) => {
    // Logic to register the user in your system
    console.log(`Registration via ${provider}:`, userInfo);
    
    // You might want to make a request to your API here
    // To register the user and create their profile
    /*
    fetch('your-api-url/auth/social-signup', {
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
          router.push('/(tabs)/home');
        }
      })
      .catch(error => {
        console.error('Error in social registration:', error);
      });
    */
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

          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Please fill in the information below</Text>

          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <Ionicons name="person-outline" size={20} color={Colors.GRAY} style={styles.inputIcon} />
              <TextInput
                placeholder="Full Name"
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
          </View>

          <TouchableOpacity
            style={styles.signUpButton}
            onPress={handleSignUp}
            activeOpacity={0.8}
            disabled={isLoading}
          >
            <Text style={styles.signUpButtonText}>
              {isLoading ? 'Loading...' : 'Create Account'}
            </Text>
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or sign up with</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity 
            style={styles.googleButton}
            onPress={handleGoogleSignIn}
            disabled={isLoading}
          >
            <Ionicons name="logo-google" size={20} color="#DB4437" style={styles.googleIcon} />
            <Text style={styles.googleButtonText}>Sign up with Google</Text>
          </TouchableOpacity>

          <View style={styles.signInContainer}>
            <Text style={styles.signInText}>Already have an account?</Text>
            <Pressable onPress={() => router.push('/auth/singin')}>
              <Text style={styles.signInLink}>Sign in</Text>
            </Pressable>
          </View>
          
          <View style={styles.termsContainer}>
            <Text style={styles.termsText}>
              By signing up, you agree to our{' '}
              <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
              <Text style={styles.termsLink}>Privacy Policy</Text>
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
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