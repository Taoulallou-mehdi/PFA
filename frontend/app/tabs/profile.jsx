import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';

// Profile component that can be used as a modal or dropdown
export function ProfileComponent({ onClose, visible }) {
  const router = useRouter();
  
  // Mock user data - replace with your actual user data
  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
    points: 350,
    recycledItems: 28,
    profileImage: "https://via.placeholder.com/80"
  };
  
  const handleLogout = () => {
    // Add your logout logic here
    console.log("Logging out...");
    // Navigate to login screen or perform logout action
    // router.replace('/login');
    onClose();
  };
  
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <View style={styles.modalContainer} onStartShouldSetResponder={() => true}>
          <View style={styles.profileHeader}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.profileTitle}>My Profile</Text>
            <View style={{ width: 24 }} />
          </View>
          
          <View style={styles.profileContent}>
            <Image 
              source={{ uri: user.profileImage }} 
              style={styles.profileImage}
            />
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
            
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{user.points}</Text>
                <Text style={styles.statLabel}>Points</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{user.recycledItems}</Text>
                <Text style={styles.statLabel}>Items Recycled</Text>
              </View>
            </View>
            
            <View style={styles.menuSection}>
              <TouchableOpacity style={styles.menuItem}>
                <Ionicons name="settings-outline" size={22} color="#555" />
                <Text style={styles.menuItemText}>Settings</Text>
                <Ionicons name="chevron-forward" size={18} color="#AAA" />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.menuItem}>
                <Ionicons name="help-circle-outline" size={22} color="#555" />
                <Text style={styles.menuItemText}>Help & Support</Text>
                <Ionicons name="chevron-forward" size={18} color="#AAA" />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.menuItem}>
                <MaterialCommunityIcons name="history" size={22} color="#555" />
                <Text style={styles.menuItemText}>Activity History</Text>
                <Ionicons name="chevron-forward" size={18} color="#AAA" />
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={20} color="white" />
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
}

// Updated TabsLayout with profile modal integration
export default function Profile() {
  const [profileVisible, setProfileVisible] = useState(false);
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>
      
      <View style={styles.content}>
        <Text>This is the Profile page content</Text>
        <TouchableOpacity 
          style={styles.showProfileButton}
          onPress={() => setProfileVisible(true)}
        >
          <Text style={styles.showProfileButtonText}>Show Profile Modal</Text>
        </TouchableOpacity>
      </View>
      
      <ProfileComponent
        visible={profileVisible}
        onClose={() => setProfileVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#1E8E3E',
    paddingVertical: 15,
    paddingHorizontal: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  showProfileButton: {
    marginTop: 20,
    backgroundColor: '#1E8E3E',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  showProfileButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  closeButton: {
    padding: 5,
  },
  profileTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  profileContent: {
    padding: 20,
    alignItems: 'center',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
    borderWidth: 3,
    borderColor: '#1E8E3E',
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 14,
    color: '#777',
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    width: '100%',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E8E3E',
  },
  statLabel: {
    fontSize: 12,
    color: '#555',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#DDD',
    marginHorizontal: 10,
  },
  menuSection: {
    width: '100%',
    marginVertical: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  menuItemText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 15,
  },
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: '#DD4B39',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
  },
  logoutText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 8,
  },
});