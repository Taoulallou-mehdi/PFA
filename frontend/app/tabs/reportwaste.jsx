import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';

let Camera;
try {
  Camera = require('expo-camera').Camera;
} catch (error) {
  console.log('Camera module not available');
}

export default function ReportWaste() {
  const navigation = useNavigation();
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraRef, setCameraRef] = useState(null);
  const [image, setImage] = useState(null);
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState('Detecting location...');
  const [loading, setLoading] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraAvailable, setCameraAvailable] = useState(!!Camera);

  useEffect(() => {
    if (cameraAvailable) {
      requestCameraPermission();
    }
  }, [cameraAvailable]);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestCameraPermission = async () => {
    try {
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setHasPermission(cameraStatus.status === 'granted');
    } catch (error) {
      console.log('Error requesting camera permissions:', error);
      setCameraAvailable(false);
    }
  };

  const requestLocationPermission = async () => {
    try {
      const locationStatus = await Location.requestForegroundPermissionsAsync();
      if (locationStatus.status === 'granted') {
        const currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation);
        getAddressFromLocation(currentLocation);
      } else {
        Alert.alert('Location Permission', 'Permission to access location was denied.');
      }
    } catch (error) {
      console.log('Error getting location:', error);
      setAddress('Location not available');
    }
  };

  const getAddressFromLocation = async (currentLocation) => {
    try {
      const geocode = await Location.reverseGeocodeAsync({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });

      if (geocode.length > 0) {
        const loc = geocode[0];
        setAddress(`${loc.street || ''} ${loc.city || ''}, ${loc.region || ''}`);
      }
    } catch (error) {
      setAddress('Location detected (coordinates only)');
    }
  };

  const takePicture = async () => {
    if (cameraRef) {
      try {
        const photo = await cameraRef.takePictureAsync();
        setImage(photo.uri);
        setShowCamera(false);
      } catch (error) {
        Alert.alert('Error', 'Failed to take picture');
      }
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image from gallery');
    }
  };

  const handleSubmit = () => {
    if (!image) {
      Alert.alert('Missing Image', 'Please take or upload a photo of the waste');
      return;
    }
    
    if (!location) {
      Alert.alert('Missing Location', 'We need your location to process this report');
      return;
    }
    
    setLoading(true);
    
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Report Submitted!', 'Thank you for your contribution! The waste collection team has been notified.', [
        { 
          text: 'OK',
          onPress: () => {
            setImage(null);
            navigation.navigate('Home');
          },
        },
      ]);
    }, 1500);
  };

  if (!cameraAvailable && hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Camera module not available</Text>
        <Text>You can still upload images from your gallery</Text>
        <TouchableOpacity 
          style={[styles.submitButton, { marginTop: 20 }]}
          onPress={() => setCameraAvailable(false)}
        >
          <Text style={styles.submitButtonText}>Continue without camera</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        {showCamera && cameraAvailable ? (
          <View style={styles.cameraContainer}>
            <Camera
              style={styles.camera}
              type={Camera.Constants?.Type?.back || 'back'}
              ref={(ref) => setCameraRef(ref)}
            >
              <View style={styles.cameraControls}>
                <TouchableOpacity style={styles.cameraButton} onPress={takePicture}>
                  <View style={styles.captureBtnOuter}>
                    <View style={styles.captureBtnInner} />
                  </View>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.cancelButton}
                  onPress={() => setShowCamera(false)}
                >
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </Camera>
          </View>
        ) : (
          <>
            <View style={styles.imageSection}>
              {image ? (
                <View style={styles.imagePreviewContainer}>
                  <Image source={{ uri: image }} style={styles.imagePreview} />
                  <TouchableOpacity 
                    style={styles.retakeButton}
                    onPress={() => setImage(null)}
                  >
                    <Text style={styles.retakeText}>Retake</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.uploadSection}>
                  <Text style={styles.uploadTitle}>Report Waste Collection</Text>
                  <Text style={styles.uploadSubtitle}>Upload a photo of waste that needs to be collected</Text>

                  <View style={styles.uploadButtons}>
                    <TouchableOpacity 
                      style={styles.uploadOption}
                      onPress={pickImage}
                    >
                      <View style={styles.uploadIconBg}>
                        <Ionicons name="images" size={28} color="#4CAF50" />
                      </View>
                      <Text style={styles.uploadButtonText}>Gallery</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>

            {image && (
              <>
                {loading ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#4CAF50" />
                    <Text style={styles.loadingText}>Submitting report...</Text>
                  </View>
                ) : (
                  <View style={styles.formSection}>
                    <Text style={styles.sectionTitle}>Location</Text>
                    <View style={styles.locationContainer}>
                      <View style={styles.locationIconContainer}>
                        <Ionicons name="location" size={24} color="#4CAF50" />
                      </View>
                      <Text style={styles.locationText}>{address}</Text>
                    </View>
                    
                    <TouchableOpacity 
                      style={styles.submitButton}
                      onPress={handleSubmit}
                    >
                      <Text style={styles.submitButtonText}>Submit Report</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#f44336',
  },
  content: {
    flex: 1,
  },
  imageSection: {
    padding: 16,
  },
  imagePreviewContainer: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
    height: 300,
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  retakeButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  retakeText: {
    color: '#fff',
    fontWeight: '600',
  },
  uploadSection: {
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eeeeee',
    borderStyle: 'dashed',
  },
  uploadTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  uploadSubtitle: {
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  uploadButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  uploadOption: {
    alignItems: 'center',
    marginHorizontal: 20,
  },
  uploadIconBg: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#e8f5e9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  uploadButtonText: {
    color: '#4CAF50',
    fontWeight: '600',
  },
  cameraContainer: {
    height: 400,
    borderRadius: 12,
    overflow: 'hidden',
    margin: 16,
  },
  camera: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  cameraControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  cameraButton: {
    alignSelf: 'center',
    marginBottom: 20,
  },
  captureBtnOuter: {
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 35,
    height: 70,
    width: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureBtnInner: {
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 30,
    height: 60,
    width: 60,
    backgroundColor: 'white',
  },
  cancelButton: {
    position: 'absolute',
    right: 20,
    bottom: 30,
  },
  cancelText: {
    color: 'white',
    fontSize: 16,
  },
  loadingContainer: {
    padding: 24,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: '#4CAF50',
    fontWeight: '500',
  },
  formSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f5e9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 24,
  },
  locationIconContainer: {
    marginRight: 8,
  },
  locationText: {
    flex: 1,
    color: '#4CAF50',
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 24,
    padding: 16,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
