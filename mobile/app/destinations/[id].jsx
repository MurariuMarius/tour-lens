import React, { useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { useDestinations } from '@/contexts/DestinationContext';

import { Modal, StyleSheet, View, FlatList, Text, ImageBackground, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import getUriFromBase64 from '@/utils/getUriFromBase64';

import CameraComponent from '@/components/CameraComponent';

export default function DestinationDetails() {

  const { destinations } = useDestinations();
  const { id } = useLocalSearchParams();

  const [cameraVisible, setCameraVisible] = useState(false);

  const destination = destinations.find(destination => destination.id === id);

  console.log(destination.modelId);

  if (!destination) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Destination not found.</Text>
      </View>
    );
  }

  const renderAttraction = ({ item }) => (
    <View style={styles.attractionCard}>
      <ImageBackground source={{ uri: getUriFromBase64(item.picture) }} style={styles.attractionImage}>
        <View style={styles.attractionOverlay}>
          <Text style={styles.attractionTitle}>{item.name}</Text>
        </View>
      </ImageBackground>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.destinationName}>{destination.name}</Text>
      <Text style={styles.destinationDescription}>{destination.description}</Text>
      <FlatList
        data={destination.attractions}
        renderItem={renderAttraction}
        keyExtractor={(item) => item.label}
        contentContainerStyle={styles.list}
      />
      <TouchableOpacity style={styles.fixedButton} onPress={() => setCameraVisible(true)}>
        <View style={styles.buttonContent}>
          <Ionicons name="camera" size={24} color="white" style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Scan Now</Text>
        </View>
      </TouchableOpacity>
      <Modal visible={cameraVisible} animationType="slide" onRequestClose={() => setCameraVisible(false)}>
        <CameraComponent
          onClose={() => setCameraVisible(false)}
          modelId={destination.modelId}
          attractions={destination.attractions}
        />
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  listContent: {
    padding: 10,
    paddingBottom: 80,
  },
  fixedButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    borderRadius: 10,
    elevation: 5,
    backgroundColor: '#f0f0f0',
    shadowColor: 'black',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    padding: 10,
    zIndex: 1,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    color: 'black',
    marginRight: 10,
  },
  buttonText: {
    color: 'black',
    fontWeight: 'bold',
  },
  destinationName: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  destinationDescription: {
    fontSize: 16,
    marginBottom: 20,
  },
  list: {
    paddingBottom: 20,
  },
  attractionCard: {
    height: 150,
    marginBottom: 15,
    borderRadius: 10,
    overflow: 'hidden',
  },
  attractionImage: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  attractionOverlay: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 5,
  },
  attractionTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});