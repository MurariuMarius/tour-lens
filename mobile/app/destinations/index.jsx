import React, { useEffect } from 'react';
import { StyleSheet, View, FlatList, ImageBackground, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Link } from 'expo-router';

import getUriFromBase64 from '@/utils/getUriFromBase64';
import { useDestinations } from '@/contexts/DestinationContext';

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

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.itemContainer}>
      <Link href={`/destinations/${item.id}`}>
        <ImageBackground source={{ uri: getUriFromBase64(item.picture) }} style={styles.imageBackground}>
          <View style={styles.overlay}>
            <Text style={styles.destinationName}>{item.name}</Text>
          </View>
        </ImageBackground>
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
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },

  listContent: {
    padding: 15,
  },

  itemContainer: {
    marginBottom: 15,
    borderRadius: 8,
    overflow: 'hidden',
  },

  imageBackground: {
    width: '100%',
    height: 350,
    justifyContent: 'flex-end',
  },

  overlay: {
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },

  destinationName: {
    color: 'white',
    fontSize: 35,
    fontWeight: 'bold',
    fontFamily: 'Montserrat_900Black',
  },
  headerText: {
    fontSize: 50,
    fontWeight: 'bold',
    color: 'blue',
    marginBottom: 20,
  },
});