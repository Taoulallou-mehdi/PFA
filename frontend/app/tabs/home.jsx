import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { MaterialCommunityIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get("window");

export default function Home() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
     
      
      {/* Map Container */}
      <View style={styles.mapContainer}>
        <MaterialCommunityIcons name="map-outline" size={48} color="#757575" />
        <Text style={styles.mapPlaceholder}>Your Map Will Appear Here</Text>
        {/* Map will be integrated here */}
      </View>
      
      {/* Action Cards */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.cardsContainer}
      >
        {/* Report Waste Card */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push("/tabs/reportwaste")}
        >
          <View style={[styles.cardIconContainer, { backgroundColor: '#ffe0e0' }]}>
            <MaterialCommunityIcons name="trash-can-outline" size={28} color="#e53935" />
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
          style={styles.card}
          onPress={() => router.push("/tabs/collectwaste")}
        >
          <View style={[styles.cardIconContainer, { backgroundColor: '#e0f2f1' }]}>
            <Ionicons name="locate-outline" size={28} color="#009688" />
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
          style={styles.card}
          onPress={() => router.push("/tabs/Rewards")}
        >
          <View style={[styles.cardIconContainer, { backgroundColor: '#fff8e1' }]}>
            <FontAwesome5 name="award" size={28} color="#ffc107" />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Rewards</Text>
            <Text style={styles.cardDescription}>
              Earn points and redeem rewards for your eco-actions
            </Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
      
      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.quickActionButton}>
          <Ionicons name="location-outline" size={16} color="#4CAF50" style={styles.actionIcon} />
          <Text style={styles.quickActionText}>Nearby</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickActionButton}>
          <MaterialCommunityIcons name="history" size={16} color="#4CAF50" style={styles.actionIcon} />
          <Text style={styles.quickActionText}>My Reports</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickActionButton}>
          <Ionicons name="stats-chart-outline" size={16} color="#4CAF50" style={styles.actionIcon} />
          <Text style={styles.quickActionText}>Stats</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: "#43a047", // Slightly darker green for better contrast
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ffffff",
  },
  subtitle: {
    fontSize: 16,
    color: "#e8f5e9",
    marginTop: 5,
  },
  mapContainer: {
    height: 250,
    margin: 15,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  mapPlaceholder: {
    fontSize: 16,
    color: "#757575",
    fontStyle: "italic",
    marginTop: 8,
  },
  cardsContainer: {
    padding: 15,
    paddingRight: 5,
  },
  card: {
    width: width * 0.75,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    marginRight: 15,
    flexDirection: "row",
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  cardContent: {
    flex: 1,
    justifyContent: "center",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  cardDescription: {
    fontSize: 14,
    color: "#757575",
    lineHeight: 20,
  },
  quickActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 15,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    marginTop: 10,
    paddingBottom: 25,
  },
  quickActionButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: "#e8f5e9",
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  actionIcon: {
    marginRight: 6,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#4CAF50",
  }
});