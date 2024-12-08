import React, { useEffect } from 'react';
import { StyleSheet, View, FlatList, ImageBackground, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Link } from 'expo-router';

import getUriFromBase64 from '@/utils/getUriFromBase64';
import { useDestinations } from '../../contexts/DestinationContext';

import { Text } from "@/components/StyledComponents";

export default function DestinationList() {
  const { destinations, isLoading, error, refresh } = useDestinations();

  useEffect(() => {
    refresh();
  }, [refresh]);

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  destinations.forEach(d => console.log(d.id));

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity style={styles.card}>
        <Link href={`/destinations/${item.id}`}>
          <View style={{ flex: 1 }}>
            <ImageBackground source={{ uri: getUriFromBase64(item.picture) }} style={styles.cardImage}>
              <View style={styles.cardOverlay}>
                <Text style={styles.cardTitle}>{item.name}</Text>
              </View>
            </ImageBackground>
          </View>
        </Link>
      </TouchableOpacity>
    )
  };

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
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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