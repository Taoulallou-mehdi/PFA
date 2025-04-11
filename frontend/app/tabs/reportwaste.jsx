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
  TextInput,
  ActivityIndicator,
  Platform
} from 'react-native';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

export default function ReportWaste({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraRef, setCameraRef] = useState(null);
  const [image, setImage] = useState(null);
  const [wasteType, setWasteType] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState('Detecting location...');
  const [loading, setLoading] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [showCamera, setShowCamera] = useState(false);

  // Request camera and location permissions
  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setHasPermission(cameraStatus.status === 'granted');
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const locationStatus = await Location.requestForegroundPermissionsAsync();
      if (locationStatus.status === 'granted') {
        const currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation);
        
        // Get readable address
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
      }
    })();
  }, []);

  const takePicture = async () => {
    if (cameraRef) {
      try {
        const photo = await cameraRef.takePictureAsync();
        setImage(photo.uri); // Save the image URI
        setShowCamera(false); // Hide the camera view
        analyzeWasteImage(photo.uri); // Analyze the image
      } catch (error) {
        Alert.alert('Error', 'Failed to take picture');
      }
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      analyzeWasteImage(result.assets[0].uri);
    }
  };
  
  // Mock AI analysis function (in a real app, this would call your AI service)
  const analyzeWasteImage = async (imageUri) => {
    setLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      // Mock AI response
      setAiAnalysis({
        isWaste: true,
        wasteTypes: ['Plastic', 'General'],
        confidenceScore: 0.94,
        estimatedSize: 'Medium',
        environmentalImpact: 'Moderate'
      });
      
      setWasteType('Plastic');
      setLoading(false);
    }, 2000);
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
    
    // Mock submission - in real app, this would send data to your server
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        'Report Submitted!',
        'You earned 25 points for your contribution!',
        [
          { 
            text: 'View My Points', 
            onPress: () => navigation.navigate('Rewards') 
          },
          { 
            text: 'OK', 
            onPress: () => {
              // Reset form
              setImage(null);
              setWasteType('');
              setDescription('');
              setAiAnalysis(null);
            } 
          },
        ]
      );
    }, 1500);
  };

  if (hasPermission === null) {
    return <View style={styles.container}><Text>Requesting permissions...</Text></View>;
  }
  
  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text>No access to camera</Text>
        <Text>Please enable camera permissions in your phone settings.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Report Waste</Text>
        <View style={styles.pointsBadge}>
          <Text style={styles.pointsText}>0.00</Text>
        </View>
      </View>
      
      <ScrollView style={styles.content}>
        {showCamera ? (
          <View style={styles.cameraContainer}>
            <Camera
              style={styles.camera}
              type={Camera.Constants.Type.back}
              ref={(ref) => setCameraRef(ref)}
            >
              <View style={styles.cameraControls}>
                <TouchableOpacity style={styles.cameraButton} onPress={takePicture}>
                  <View style={styles.captureBtnOuter}>
                    <View style={styles.captureBtnInner} />
                  </View>
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
                    onPress={() => setImage(null)}>
                    <Text style={styles.retakeText}>Retake</Text>
                  </TouchableOpacity>
                  
                  {aiAnalysis && (
                    <View style={styles.aiResultOverlay}>
                      <MaterialIcons name="check-circle" size={24} color="#4CAF50" />
                      <Text style={styles.aiResultText}>Waste Detected</Text>
                    </View>
                  )}
                </View>
              ) : (
                <View style={styles.uploadSection}>
                  <Text style={styles.uploadTitle}>Upload or Take a Photo</Text>
                  <Text style={styles.uploadSubtitle}>
                    Our AI will analyze the waste and help categorize it
                  </Text>
                  
                  <View style={styles.uploadButtons}>
                    <TouchableOpacity 
                      style={styles.uploadOption}
                      onPress={() => setShowCamera(true)}>
                      <View style={styles.uploadIconBg}>
                        <Ionicons name="camera" size={28} color="#4CAF50" />
                      </View>
                      <Text style={styles.uploadButtonText}>Camera</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={styles.uploadOption}
                      onPress={pickImage}>
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
                    <Text style={styles.loadingText}>Analyzing waste image...</Text>
                  </View>
                ) : (
                  <>
                    {aiAnalysis && (
                      <View style={styles.aiAnalysisContainer}>
                        <Text style={styles.sectionTitle}>AI Analysis Results</Text>
                        
                        <View style={styles.aiResultsGrid}>
                          <View style={styles.aiResultItem}>
                            <Text style={styles.aiResultLabel}>Waste Type</Text>
                            <Text style={styles.aiResultValue}>{aiAnalysis.wasteTypes.join(', ')}</Text>
                          </View>
                          
                          <View style={styles.aiResultItem}>
                            <Text style={styles.aiResultLabel}>Confidence</Text>
                            <Text style={styles.aiResultValue}>{aiAnalysis.confidenceScore * 100}%</Text>
                          </View>
                          
                          <View style={styles.aiResultItem}>
                            <Text style={styles.aiResultLabel}>Size</Text>
                            <Text style={styles.aiResultValue}>{aiAnalysis.estimatedSize}</Text>
                          </View>
                          
                          <View style={styles.aiResultItem}>
                            <Text style={styles.aiResultLabel}>Impact</Text>
                            <Text style={styles.aiResultValue}>{aiAnalysis.environmentalImpact}</Text>
                          </View>
                        </View>
                      </View>
                    )}
                    
                    <View style={styles.formSection}>
                      <Text style={styles.sectionTitle}>Waste Details</Text>
                      
                      <Text style={styles.inputLabel}>Waste Type</Text>
                      <View style={styles.selectContainer}>
                        <TextInput
                          style={styles.input}
                          value={wasteType}
                          onChangeText={setWasteType}
                          placeholder="Select waste type"
                        />
                        <MaterialIcons name="arrow-drop-down" size={24} color="#666" />
                      </View>
                      
                      <Text style={styles.inputLabel}>Description (Optional)</Text>
                      <TextInput
                        style={[styles.input, styles.textArea]}
                        value={description}
                        onChangeText={setDescription}
                        placeholder="Add more details about the waste"
                        multiline
                        numberOfLines={4}
                      />
                      
                      <Text style={styles.sectionTitle}>Location</Text>
                      <View style={styles.locationContainer}>
                        <View style={styles.locationIconContainer}>
                          <Ionicons name="location" size={24} color="#4CAF50" />
                        </View>
                        <Text style={styles.locationText}>{address}</Text>
                      </View>
                      
                      <TouchableOpacity 
                        style={styles.submitButton}
                        onPress={handleSubmit}>
                        <Text style={styles.submitButtonText}>Submit Report</Text>
                      </TouchableOpacity>
                    </View>
                  </>
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
    backgroundColor: '#ffffff',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
    color: '#333',
  },
  pointsBadge: {
    backgroundColor: '#e8f5e9',
    borderRadius: 16,
    padding: 6,
    minWidth: 32,
    alignItems: 'center',
  },
  pointsText: {
    color: '#4CAF50',
    fontWeight: 'bold',
    fontSize: 12,
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
  aiResultOverlay: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  aiResultText: {
    color: '#4CAF50',
    fontWeight: 'bold',
    marginLeft: 4,
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
  aiIndicator: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  aiText: {
    color: '#fff',
    fontSize: 12,
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
  aiAnalysisContainer: {
    padding: 16,
    backgroundColor: '#f8f8f8',
    margin: 16,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  aiResultsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  aiResultItem: {
    width: '48%',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  aiResultLabel: {
    color: '#666',
    fontSize: 12,
    marginBottom: 4,
  },
  aiResultValue: {
    fontWeight: 'bold',
    color: '#333',
  },
  formSection: {
    padding: 16,
  },
  inputLabel: {
    color: '#666',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  selectContainer: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    alignItems: 'center',
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