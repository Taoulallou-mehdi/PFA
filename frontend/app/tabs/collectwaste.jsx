import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import Colors from '../../constant/Colors';

export default function CollectWaste() {
  const router = useRouter();
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  // Fetch the user info
  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert("Error", "No token found. Please log in again.");
        router.replace("/auth/singin");
        return;
      }

      const response = await fetch(`${config.BACKEND_URL}/api/users/me`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data);
      } else {
        Alert.alert("Error", "Failed to fetch user information");
      }
    };

    fetchUserInfo();
  }, []);

  // Pick an image from the device (simulate getting the photo from report waste)
  const pickImage = async () => {
    try {
      setLoading(true);  // Set loading true when picking image
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        setPhoto(result.assets[0].uri);  // Set the selected image URI
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert('Erreur', 'Une erreur est survenue lors de la sélection de l\'image.');
    } finally {
      setLoading(false);  // Set loading to false after the process
    }
  };

  // Confirm button handler (simulate checking with report waste and update points and coins)
  const handleConfirm = async () => {
    if (!photo) {
      Alert.alert('Erreur', 'Veuillez sélectionner une photo avant de confirmer.');
      return;
    }

    if (!user) return;

    setLoading(true);
    try {
      const updatedPoints = user.points + 1; // Increment points by 1
      const coins = updatedPoints * 20; // Each point is worth 20 coins

      // Update the user's points and coins in the backend
      const response = await fetch(`${config.BACKEND_URL}/api/users/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          points: updatedPoints,
          coins: coins,
        }),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser);
        Alert.alert('Succès', 'La photo a été vérifiée avec succès et vos points et coins ont été mis à jour.');
        router.push("/tabs/rewards");
      } else {
        Alert.alert("Erreur", "Échec de la mise à jour de vos points et coins.");
      }
    } catch (error) {
      console.error('Error updating points and coins:', error);
      Alert.alert("Erreur", "Il y a eu un problème lors de la mise à jour de vos points.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Vérifier la collecte de déchets</Text>

      <View style={styles.frame}>
        {loading ? (
          <ActivityIndicator size="large" color={Colors.GREEN} />
        ) : photo ? (
          <Image source={{ uri: photo }} style={styles.photo} />
        ) : (
          <TouchableOpacity style={styles.addPhotoButton} onPress={pickImage} accessible={true} accessibilityLabel="Ajouter une photo">
            <Ionicons name="camera-outline" size={40} color={Colors.GRAY} />
            <Text style={styles.addPhotoText}>Ajouter une photo</Text>
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm} disabled={loading}>
        <Text style={styles.confirmButtonText}>
          {loading ? 'Vérification...' : 'Confirmer'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 30,
    color: Colors.TEXT_DARK || '#000',
  },
  frame: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: Colors.BORDER_LIGHT || '#eaeaea',
    borderRadius: 20,
    backgroundColor: Colors.INPUT_BG || '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
    overflow: 'hidden',
  },
  photo: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  addPhotoButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  addPhotoText: {
    marginTop: 10,
    color: Colors.GRAY,
    fontSize: 16,
  },
  confirmButton: {
    width: '80%',
    height: 50,
    backgroundColor: Colors.GREEN,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    shadowColor: Colors.GREEN,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  confirmButtonText: {
    color: Colors.WHITE,
    fontSize: 18,
    fontWeight: 'bold',
  },
});
