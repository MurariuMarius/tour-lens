import React, { useEffect } from 'react';
import { StyleSheet, View, FlatList, ImageBackground, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Link } from 'expo-router';

import { useDestinations } from '@/contexts/DestinationContext';

import { Text } from "@/components/StyledComponents";
import { useSearchParams } from 'expo-router/build/hooks';

export default function DestinationList() {
  const { destinations, isLoading, error, refresh } = useDestinations();

  const searchParams = useSearchParams();
  const headerText = searchParams.get('headerText') || "Destinations";

  useEffect(() => {
    refresh();
  }, [refresh]);

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.itemContainer}>
      <Link href={`/destinations/${item.id}`}>
        <ImageBackground source={{ uri: item.picture }} style={styles.imageBackground}>
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
      <View style={styles.titleContainer}>
        <Text style={styles.headerText}>{headerText}</Text>
      </View>      
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
  titleContainer: {
    backgroundColor: '#cec4fc',
    padding: 20,
    borderRadius: 15,
    marginBottom: 10,
    marginLeft: 15,
    marginRight: 15,
    marginTop: 5,

  },
  headerText: {
    fontSize: 32,
    textAlign: 'center',
    fontFamily: "Montserrat_900Black",
  },
});