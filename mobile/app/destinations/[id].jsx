import React, { useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { useDestinations } from '@/contexts/DestinationContext';

import { Linking, Modal, StyleSheet, View, FlatList, ImageBackground, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import CameraComponent from '@/components/CameraComponent';
import { Text } from "@/components/StyledComponents";

export default function DestinationDetails() {

  const { destinations } = useDestinations();
  const { id } = useLocalSearchParams();

  const [cameraVisible, setCameraVisible] = useState(false);
  const [selectedAttraction, setSelectedAttraction] = useState(null);


  const destination = destinations.find(destination => destination.id === id);

  console.log(destination.modelId);

  if (!destination) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Destination not found.</Text>
      </View>
    );
  }

  const openAttractionModal = (attraction) => {
    setSelectedAttraction(attraction);
    setCameraVisible(false);
  };

  const renderAttraction = ({ item }) => (
    <TouchableOpacity onPress={() => setSelectedAttraction(item)}>
      <View style={styles.attractionCard}>
        <ImageBackground source={{ uri: item.picture }} style={styles.attractionImage}>
          <View style={styles.attractionOverlay}>
            <Text style={styles.attractionTitle}>{item.name}</Text>
          </View>
        </ImageBackground>
      </View>
    </TouchableOpacity>
  );

  const openPlusCodeInMaps = (plusCode) => {
    plusCode = plusCode.replace("+", "%2B")
    const url = `https://www.google.com/maps/search/?api=1&query=${plusCode}`;
    Linking.openURL(url);
  };


  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.destinationName}>{destination.name}</Text>
      </View>
      <View style={styles.descriptionCard}>
        <Text style={styles.destinationDescription}>{destination.description}</Text>
      </View>
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
          onAttractionPredicted={openAttractionModal} 
        />
      </Modal>
      <Modal visible={selectedAttraction !== null} animationType="slide" onRequestClose={() => setSelectedAttraction(null)}>
        <View style={styles.modalContainer}>
          <ImageBackground source={{ uri: selectedAttraction?.picture }} style={styles.modalImage}>
            <View style={styles.modalImageOverlay}>
              <Text style={styles.modalImageTitle}>{selectedAttraction?.name}</Text>
            </View>
          </ImageBackground>
          <ScrollView style={styles.modalContent}>
            <View style={styles.descriptionContainer}>
              <Text style={styles.modalDescription}>{selectedAttraction?.description}</Text>
            </View>
            <TouchableOpacity onPress={() => openPlusCodeInMaps(selectedAttraction?.plusCode)}>
              <View style={styles.mapOverlay}>
                <View style={styles.mapTextButton}>
                  <Ionicons name="navigate-outline" size={20} color="white" style={styles.mapIcon} />
                  <Text style={styles.mapText}>Open in Google Maps</Text>
                </View>
              </View>
            </TouchableOpacity>
          </ScrollView>
          <TouchableOpacity style={styles.closeButton} onPress={() => setSelectedAttraction(null)}>
            <Ionicons name="close" size={32} color="white" />
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  listContent: {
    padding: 10,
    paddingBottom: 80,
  },
  descriptionContainer: {
    backgroundColor: '#cec4fc',
    padding: 20,
    borderRadius: 15,
    marginBottom: 10,
  },
  descriptionCard: {
    backgroundColor: '#cec4fc',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  fixedButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    borderRadius: 10,
    elevation: 5,
    backgroundColor: '#8B5CF6',
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
    color: 'white',
    marginRight: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  destinationName: {
    fontSize: 32,
    textAlign: 'center',
    fontFamily: "Montserrat_900Black",
  },
  destinationDescription: {
    fontSize: 16,
  },
  list: {
    paddingBottom: 20,
  },
  modalContainer: {
    flex: 1,
  },
  modalImage: {
    height: 300,
    justifyContent: 'flex-end',
    resizeMode: 'cover'
  },
  modalImageOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
  },
  modalImageTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  modalContent: {
    padding: 20,
    flex: 1,
  },
  mapPreviewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  mapOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#8B5CF6',
    borderRadius: 15,
    padding: 7,
    marginTop: 10,
  },
  mapTextButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mapIcon: {
    marginRight: 10,
  },
  mapText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalDescription: {
    fontSize: 16,
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 2,
    padding: 10,
    borderRadius: 20,
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