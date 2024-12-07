import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, ImageBackground, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Link } from 'expo-router';
import { getDestinations } from '../../services/destinationService';
import getUriFromBase64 from '@/utils/getUriFromBase64';

export default function DestinationList() {
  const [destinations, setDestinations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const data = await getDestinations();
      setDestinations(data);
      setIsLoading(false);
    }

    fetchData();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card}>
      <Link href={`/destination/${encodeURIComponent(item.id)}`} asChild>
        <View style={{ flex: 1 }}>
          <ImageBackground source={{ uri: getUriFromBase64(item.picture) }} style={styles.cardImage}>
            <View style={styles.cardOverlay}>
              <Text style={styles.cardTitle}>{item.name}</Text>
            </View>
          </ImageBackground>
        </View>
      </Link>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={destinations}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  list: {
    paddingBottom: 20,
  },
  card: {
    height: 200,
    marginBottom: 15,
    borderRadius: 10,
    overflow: 'hidden',
  },
  cardImage: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  cardOverlay: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});