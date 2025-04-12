import { View, Text, StyleSheet, TouchableOpacity, Image, Modal, ScrollView, ActivityIndicator, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Tabs, useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import axios from 'axios'; // Make sure to install axios: npm install axios

// Create a service file to handle API calls
const API_URL = 'http://192.168.1.88:5000/api'; // Replace with your backend URL

// User service for API calls
const userService = {
  // Get user profile information
  getUserProfile: async (userId) => {
    try {
      const response = await axios.get(`${API_URL}/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  },
  
  // Get user stats
  getUserStats: async (userId) => {
    try {
      const response = await axios.get(`${API_URL}/users/${userId}/stats`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user stats:', error);
      throw error;
    }
  },
  
  // Logout user
  logoutUser: async () => {
    try {
      const response = await axios.post(`${API_URL}/auth/logout`);
      return response.data;
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  }
};

// Custom header component with profile
const CustomHeader = () => {
  const router = useRouter();
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loggingOut, setLoggingOut] = useState(false);
  
  // Replace with actual user ID from your authentication system
  const userId = "current-user-id"; // You would typically get this from auth context or storage
  
  const toggleProfileModal = () => {
    setProfileModalVisible(!profileModalVisible);
    
    // Fetch user data when opening the modal
    if (!profileModalVisible && !userProfile) {
      fetchUserData();
    }
  };
  
  const fetchUserData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [profileResult, statsResult] = await Promise.allSettled([
        userService.getUserProfile(userId),
        userService.getUserStats(userId),
      ]);

      if (profileResult.status === 'fulfilled') {
        setUserProfile(profileResult.value);
      } else {
        console.error('Error fetching profile:', profileResult.reason);
      }

      if (statsResult.status === 'fulfilled') {
        setUserStats(statsResult.value);
      } else {
        console.error('Error fetching stats:', statsResult.reason);
      }
    } catch (error) {
      setError('Failed to load user information. Please try again.');
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await userService.logoutUser();
      setProfileModalVisible(false);
      router.replace('/auth/singin');
      setUserProfile(null);
      setUserStats(null);
    } catch (error) {
      console.error('Logout failed:', error);
      Alert.alert('Error', 'Failed to log out. Please try again.');
    } finally {
      setLoggingOut(false);
    }
  };
  
  return (
    <SafeAreaView style={styles.headerContainer}>
      <View style={styles.headerContent}>
        <View style={styles.logoContainer}>
          <MaterialCommunityIcons name="leaf" size={24} color="white" />
          <Text style={styles.headerTitle}>Env++</Text>
        </View>
        
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.profileButton} onPress={toggleProfileModal}>
            {userProfile?.profileImage ? (
              <Image
                source={{ uri: userProfile.profileImage }}
                style={styles.profileImage}
              />
            ) : (
              <View style={styles.profileInitialContainer}>
                <Text style={styles.profileInitial}>
                  {userProfile?.name?.charAt(0).toUpperCase() || "?"}
                </Text>
              </View>
            )}
            <View style={styles.statusIndicator} />
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Profile Side Window */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={profileModalVisible}
        onRequestClose={() => setProfileModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={toggleProfileModal}
        >
          <View style={styles.profileSideWindow}>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={toggleProfileModal}
            >
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
            
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#1E8E3E" />
                <Text style={styles.loadingText}>Loading profile...</Text>
              </View>
            ) : error ? (
              <View style={styles.errorContainer}>
                <Ionicons name="alert-circle-outline" size={40} color="#FF5252" />
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity 
                  style={styles.retryButton}
                  onPress={fetchUserData}
                >
                  <Text style={styles.retryButtonText}>Retry</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                <View style={styles.profileHeader}>
                  <Image 
                    source={{ 
                      uri: userProfile?.profileImage || 'https://via.placeholder.com/80' 
                    }} 
                    style={styles.profileLargeImage}
                  />
                  <Text style={styles.profileName}>
                    {userProfile?.name || 'Loading...'}
                  </Text>
                  <Text style={styles.profileEmail}>
                    {userProfile?.email || 'email@example.com'}
                  </Text>
                  
                  <View style={styles.profileStats}>
                    <View style={styles.statItem}>
                      <Text style={styles.statValue}>
                        {userStats?.points || '0'}
                      </Text>
                      <Text style={styles.statLabel}>Points</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                      <Text style={styles.statValue}>
                        {userStats?.collectionsCount || '0'}
                      </Text>
                      <Text style={styles.statLabel}>Collections</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                      <Text style={styles.statValue}>
                        {userStats?.reportsCount || '0'}
                      </Text>
                      <Text style={styles.statLabel}>Reports</Text>
                    </View>
                  </View>
                </View>
                
                <ScrollView style={styles.profileMenuItems}>
                  <TouchableOpacity 
                    style={styles.menuItem}
                    onPress={() => {
                      setProfileModalVisible(false);
                      router.push('/profile/edit');
                    }}
                  >
                    <Ionicons name="person-outline" size={22} color="#1E8E3E" />
                    <Text style={styles.menuItemText}>Edit Profile</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.menuItem}
                    onPress={() => {
                      setProfileModalVisible(false);
                      router.push('/settings');
                    }}
                  >
                    <Ionicons name="settings-outline" size={22} color="#1E8E3E" />
                    <Text style={styles.menuItemText}>Settings</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.menuItem}
                    onPress={() => {
                      setProfileModalVisible(false);
                      router.push('/activity-history');
                    }}
                  >
                    <MaterialCommunityIcons name="history" size={22} color="#1E8E3E" />
                    <Text style={styles.menuItemText}>Activity History</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.menuItem}
                    onPress={() => {
                      setProfileModalVisible(false);
                      router.push('/payment-methods');
                    }}
                  >
                    <AntDesign name="creditcard" size={22} color="#1E8E3E" />
                    <Text style={styles.menuItemText}>Payment Methods</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.menuItem}
                    onPress={() => {
                      setProfileModalVisible(false);
                      router.push('/help-support');
                    }}
                  >
                    <Ionicons name="help-circle-outline" size={22} color="#1E8E3E" />
                    <Text style={styles.menuItemText}>Help & Support</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[styles.menuItem, styles.logoutItem]}
                    onPress={handleLogout}
                    disabled={loggingOut}
                  >
                    <Ionicons name="log-out-outline" size={22} color="#FF5252" />
                    <Text style={[styles.menuItemText, styles.logoutText]}>
                      {loggingOut ? 'Logging out...' : 'Logout'}
                    </Text>
                  </TouchableOpacity>
                </ScrollView>
              </>
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

// Custom tab bar component
const CustomTabBar = ({ state, descriptors, navigation }) => {
  return (
    <View style={styles.tabBarContainer}>
      <View style={styles.tabBar}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label = options.title || route.name;
          const isFocused = state.index === index;
          
          // Skip rendering the profile tab
          if (route.name === 'profile') {
            return null;
          }
          
          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };
          
          return (
            <TouchableOpacity
              key={index}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              onPress={onPress}
              style={styles.tabItem}
            >
              <View style={[styles.iconContainer, isFocused && styles.activeIconContainer]}>
                {options.tabBarIcon && options.tabBarIcon({ 
                  color: isFocused ? '#1E8E3E' : '#757575', 
                  size: 22 
                })}
              </View>
              <Text style={[
                styles.tabBarLabel, 
                isFocused ? styles.tabBarLabelActive : styles.tabBarLabelInactive
              ]}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        header: () => <CustomHeader />,
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      {/* Home Tab */}
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />

      {/* Collect Waste Tab */}
      <Tabs.Screen
        name="collectwaste"
        options={{
          title: 'Collect',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="recycle" size={size} color={color} />
          ),
        }}
      />

      {/* Report Waste Tab */}
      <Tabs.Screen
        name="reportwaste"
        options={{
          title: 'Report',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="warning-outline" size={size} color={color} />
          ),
        }}
      />

      {/* Rewards Tab */}
      <Tabs.Screen
        name="Rewards"
        options={{
          title: 'Rewards',
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="gift" size={size} color={color} />
          ),
        }}
      />
      
      {/* Profile Tab - Hidden but kept for navigation purposes */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarButton: () => null, // Hide the tab from the tab bar
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  // Header styles
  headerContainer: {
    backgroundColor: '#1E8E3E',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 8,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileButton: {
    position: 'relative',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'white',
  },
  profileImage: {
    width: 40, 
    height: 40,
    borderRadius: 20,
  },
  statusIndicator: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4CAF50',
    borderWidth: 1,
    borderColor: 'white',
    bottom: 0,
    right: 0,
  },
  profileInitialContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1E8E3E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitial: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  
  // Profile Side Window styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  profileSideWindow: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: '75%',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: -5, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 10,
    padding: 5,
  },
  profileHeader: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  profileLargeImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
    borderWidth: 3,
    borderColor: '#1E8E3E',
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 16,
  },
  profileStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 20,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E8E3E',
  },
  statLabel: {
    fontSize: 12,
    color: '#757575',
  },
  statDivider: {
    width: 1,
    height: '100%',
    backgroundColor: '#EEEEEE',
  },
  profileMenuItems: {
    paddingTop: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  menuItemText: {
    fontSize: 16,
    marginLeft: 16,
    color: '#333333',
  },
  logoutItem: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  logoutText: {
    color: '#FF5252',
  },
  
  // Loading and error styles
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#757575',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: '#757575',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#1E8E3E',
    borderRadius: 20,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  
  // Tab bar styles
  tabBarContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 8,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(230, 230, 230, 0.5)',
    width: '100%',
    justifyContent: 'space-around',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: 45,
    height: 45,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeIconContainer: {
    backgroundColor: 'rgba(30, 142, 62, 0.1)',
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
  },
  tabBarLabelActive: {
    color: '#1E8E3E',
    fontWeight: '700',
  },
  tabBarLabelInactive: {
    color: '#757575',
  },
});