import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from "react-native";
import React from "react";
import { StatusBar } from "expo-status-bar";
import { FontAwesome5, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get("window");

export default function Rewards() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <FontAwesome5 name="award" size={32} color="#ffc107" />
        <Text style={styles.headerTitle}>My Rewards</Text>
        <Text style={styles.pointsText}>
          <FontAwesome5 name="coins" size={16} color="#ffc107" />{" "}
          <Text style={{color: "#ffc107", fontWeight: "bold"}}>1200</Text> Points
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionTitle}>Available Rewards</Text>
        <View style={styles.rewardCard}>
          <MaterialCommunityIcons name="recycle" size={28} color="#4caf50" style={styles.rewardIcon} />
          <View style={styles.rewardInfo}>
            <Text style={styles.rewardTitle}>Eco-Friendly Tote Bag</Text>
            <Text style={styles.rewardDesc}>800 points</Text>
          </View>
          <TouchableOpacity style={styles.redeemBtn}>
            <Text style={styles.redeemText}>Redeem</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.rewardCard}>
          <FontAwesome5 name="bicycle" size={28} color="#2196f3" style={styles.rewardIcon} />
          <View style={styles.rewardInfo}>
            <Text style={styles.rewardTitle}>Bike Rental Voucher</Text>
            <Text style={styles.rewardDesc}>1000 points</Text>
          </View>
          <TouchableOpacity style={styles.redeemBtn}>
            <Text style={styles.redeemText}>Redeem</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.rewardCard}>
          <MaterialCommunityIcons name="tree" size={28} color="#388e3c" style={styles.rewardIcon} />
          <View style={styles.rewardInfo}>
            <Text style={styles.rewardTitle}>Plant a Tree</Text>
            <Text style={styles.rewardDesc}>500 points</Text>
          </View>
          <TouchableOpacity style={styles.redeemBtn}>
            <Text style={styles.redeemText}>Redeem</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Points History</Text>
        <View style={styles.historyItem}>
          <Ionicons name="add-circle-outline" size={20} color="#4caf50" />
          <Text style={styles.historyText}>+200 points for reporting waste</Text>
        </View>
        <View style={styles.historyItem}>
          <Ionicons name="add-circle-outline" size={20} color="#4caf50" />
          <Text style={styles.historyText}>+1000 points for collecting waste</Text>
        </View>
        <View style={styles.historyItem}>
          <Ionicons name="remove-circle-outline" size={20} color="#ffc107" />
          <Text style={styles.historyText}>-800 points for redeeming Tote Bag</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e8f5e9",
    alignItems: "center",
    paddingTop: 24,
  },
  header: {
    width: width * 0.94,
    backgroundColor: "#fff8e1",
    borderRadius: 22,
    alignItems: "center",
    paddingVertical: 18,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginTop: 8,
    marginBottom: 4,
  },
  pointsText: {
    fontSize: 16,
    color: "#757575",
    marginTop: 4,
  },
  scrollContent: {
    paddingBottom: 24,
    alignItems: "center",
    width: width,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#388e3c",
    alignSelf: "flex-start",
    marginLeft: width * 0.05,
    marginTop: 10,
    marginBottom: 8,
  },
  rewardCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    width: width * 0.92,
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 2,
  },
  rewardIcon: {
    marginRight: 16,
  },
  rewardInfo: {
    flex: 1,
  },
  rewardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  rewardDesc: {
    fontSize: 12,
    color: "#757575",
    marginTop: 2,
  },
  redeemBtn: {
    backgroundColor: "#ffc107",
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 12,
  },
  redeemText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 13,
  },
  historyItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    width: width * 0.9,
    borderRadius: 12,
    padding: 10,
    marginBottom: 8,
    marginTop: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
  },
  historyText: {
    marginLeft: 10,
    fontSize: 13,
    color: "#333",
  },
});