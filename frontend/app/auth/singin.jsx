import { View, Text, Image, TextInput, StyleSheet, Button, TouchableOpacity, Pressable } from 'react-native';
import React from 'react';
import Colors from '../../constant/Colors'; // Import for Colors
import { useRouter } from 'expo-router';

export default function singin() {
  const router = useRouter();

  return (
    <View
      style={{
        display: 'flex',
        alignItems: 'center',
        backgroundColor: Colors.WHITE, // Ensure Colors.WHITE is defined
        paddingTop: 100,
        flex: 1,
        borderRadius: 10,
      }}
    >
      <Image
        source={require('./../../assets/images/istockphoto.jpg')}
        style={{ width: 200, height: 200 }}
      />
      <Text
        style={{
          fontSize: 20,
          fontWeight: 'bold',
          marginTop: 20,
        }}
      >
        SingUp
      </Text>
     
      <TextInput placeholder="Email" style={styles.TextInput} />
      <TextInput placeholder="Password" style={styles.TextInput} secureTextEntry={true} />

      {/* Add a button to navigate to the app */}
      <TouchableOpacity
        style={{
            padding:15,
            backgroundColor: Colors.GREEN, // Ensure Colors.GREEN is defined
            borderRadius: 10,
            marginTop: 20,
            alignItems: 'center',
            justifyContent: 'center',
            width: 200,
        }}
        
      >
        <Text style={{
            color: 'white',
            fontSize: 16,
            fontWeight: 'bold',
        }}>SignUp</Text>
      </TouchableOpacity>
      <View style={{
        display: 'flex',
        flexDirection:'row',
        gap: '5px',
        marginTop: 20,
        
        
        }}>
      <Text 
        style={{
            fontFamily: 'Arial',
            fontSize: 16,
            }}>
          Create an Account ! </Text>
        <Pressable onPress={() => router.push('/auth/singUp') }
        > 
            <Text style={{
                color: Colors.GREEN, // Ensure Colors.GREEN is defined
                fontWeight: 'bold',
            }}>sign up</Text>
        </Pressable>
    </View>
    </View>
  );
}

const styles = StyleSheet.create({
  TextInput: {
    width: 300,
    height: 50,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
    marginTop: 20,
    padding: 10,
  },
  
});