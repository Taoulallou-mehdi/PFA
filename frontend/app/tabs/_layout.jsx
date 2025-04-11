import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { Tabs } from 'expo-router';
import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';

// Custom header component with profile
const CustomHeader = () => {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.headerContainer}>
      <View style={styles.headerContent}>
        <View style={styles.logoContainer}>
          <MaterialCommunityIcons name="leaf" size={24} color="white" />
          <Text style={styles.headerTitle}>EcoRecycle</Text>
        </View>
        
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications-outline" size={22} color="white" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.profileButton}
            onPress={() => router.push('/profile')}
          >
            <Image 
              source={{ uri: 'https://via.placeholder.com/40' }} 
              style={styles.profileImage}
            />
            <View style={styles.statusIndicator} />
          </TouchableOpacity>
        </View>
      </View>
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
    <>
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
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person-outline" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </>
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
  notificationButton: {
    marginRight: 12,
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