import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { MaterialCommunityIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';
import MapView from 'react-native-maps';

const { width, height } = Dimensions.get("window");

export default function Home() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Map Container */}
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 34.0152581, 
            longitude: -5.0052666, 
            latitudeDelta: 1,
            longitudeDelta: 1,
          }}
        />
        <View style={styles.mapOverlay}>
          <Text style={styles.mapTitle}>Morocco Waste Map</Text>
        </View>
      </View>
      
      {/* Action Cards - smaller, floating, and with glass effect */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.cardsContainer}
      >
        {/* Report Waste Card */}
        <TouchableOpacity
          style={[styles.card, { backgroundColor: 'rgba(255,255,255,0.85)', borderColor: '#e53935' }]}
          onPress={() => router.push("/tabs/reportwaste")}
        >
          <View style={[styles.cardIconContainer, { backgroundColor: '#ffe0e0' }]}>
            <MaterialCommunityIcons name="trash-can-outline" size={22} color="#e53935" />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Report Waste</Text>
            <Text style={styles.cardDescription}>
              Report illegal dumping or waste that needs attention
            </Text>
          </View>
        </TouchableOpacity>

        {/* Collect Waste Card */}
        <TouchableOpacity
          style={[styles.card, { backgroundColor: 'rgba(255,255,255,0.85)', borderColor: '#009688' }]}
          onPress={() => router.push("/tabs/collectwaste")}
        >
          <View style={[styles.cardIconContainer, { backgroundColor: '#e0f2f1' }]}>
            <Ionicons name="locate-outline" size={22} color="#009688" />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Collect Waste</Text>
            <Text style={styles.cardDescription}>
              Find waste collection points near you
            </Text>
          </View>
        </TouchableOpacity>

        {/* Rewards Card */}
        <TouchableOpacity
          style={[styles.card, { backgroundColor: 'rgba(255,255,255,0.85)', borderColor: '#ffc107' }]}
          onPress={() => router.push("/tabs/Rewards")}
        >
          <View style={[styles.cardIconContainer, { backgroundColor: '#fff8e1' }]}>
            <FontAwesome5 name="award" size={22} color="#ffc107" />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Rewards</Text>
            <Text style={styles.cardDescription}>
              Earn points and redeem rewards for your eco-actions
            </Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
      
      {/* Quick Actions - with rounded background and shadow */}
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e8f5e9",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  mapContainer: {
    width: width * 0.96,
    height: height * 0.58, // Bigger map
    marginTop: 18,
    marginBottom: 10,
    backgroundColor: "#f5f5f5",
    borderRadius: 28,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.13,
    shadowRadius: 12,
    elevation: 5,
    alignSelf: "center",
    position: "relative",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  mapOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    paddingVertical: 10,
    backgroundColor: "rgba(76,175,80,0.85)",
    alignItems: "center",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    zIndex: 2,
  },
  mapTitle: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
    letterSpacing: 1,
  },
  cardsContainer: {
    paddingVertical: 8,
    paddingLeft: 10,
    alignItems: "center",
    marginBottom: 5,
  },
  card: {
    width: width * 0.38,
    minHeight: 90,
    borderRadius: 16,
    marginRight: 12,
    flexDirection: "row",
    padding: 10,
    borderWidth: 1.5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 2,
    alignItems: "center",
    backdropFilter: "blur(8px)", // for web, ignored on native
  },
  cardIconContainer: {
    width: 34,
    height: 34,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  cardContent: {
    flex: 1,
    justifyContent: "center",
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 2,
  },
  cardDescription: {
    fontSize: 10,
    color: "#757575",
    lineHeight: 14,
  },
  quickActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: width * 0.94,
    backgroundColor: "#fff",
    borderRadius: 22,
    marginTop: 12,
    paddingVertical: 12,
    paddingHorizontal: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    alignSelf: "center",
  },
  quickActionButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: "#e8f5e9",
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 4,
  },
  actionIcon: {
    marginRight: 6,
  },
  quickActionText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#4CAF50",
  }
});