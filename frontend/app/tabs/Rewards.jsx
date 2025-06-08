import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Rewards() {
  const [user, setUser] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserAndLeaderboard = async () => {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        return; // Handle case where the token is missing (redirect to login)
      }

      // Fetch user info
      const userResponse = await fetch(`${config.BACKEND_URL}/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userData = await userResponse.json();
      setUser(userData);

      // Fetch leaderboard
      const leaderboardResponse = await fetch(`${config.BACKEND_URL}/api/users/leaderboard`);
      const leaderboardData = await leaderboardResponse.json();
      setLeaderboard(leaderboardData);

      setLoading(false);
    };

    fetchUserAndLeaderboard();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1E8E3E" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Rewards</Text>
      <Text style={styles.userCoins}>Coins: {user?.coins || 0}</Text>

      <Text style={styles.title}>Leaderboard</Text>
      <FlatList
        data={leaderboard}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.leaderboardItem}>
            <Text style={styles.rank}>{index + 1}</Text>
            <Text style={styles.userName}>{item.name}</Text>
            <Text style={styles.userCoins}>{item.coins} coins</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  userCoins: {
    fontSize: 18,
    marginBottom: 20,
    color: '#4CAF50',
  },
  leaderboardItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eaeaea',
  },
  rank: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  userName: {
    fontSize: 18,
    color: '#333',
  },
  userCoins: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
