import { View, Text, Image, TextInput, StyleSheet, TouchableOpacity, Pressable, StatusBar, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import React, { useState } from 'react';
import Colors from '../../constant/Colors';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; // Assurez-vous d'avoir installé expo/vector-icons

export default function SignUp() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSignUp = () => {
    // Logique d'inscription ici
    console.log('Inscription avec:', fullName, email, password);
    // Navigation après une inscription réussie
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
          >
            <Text style={styles.signUpButtonText}>Créer le compte</Text>
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>ou s'inscrire avec</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.socialButtonsContainer}>
            <TouchableOpacity style={styles.socialButton}>
              <Ionicons name="logo-google" size={20} color="#DB4437" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
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