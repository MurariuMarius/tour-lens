import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState, useRef } from 'react';
import { StyleSheet, TouchableOpacity, View, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { predict } from '@/services/predictionService';

import { Text, Button } from "@/components/StyledComponents";

import { minimumPredictionConfidence } from "@/config";

export default function CameraComponent({ onClose, modelId, attractions, onAttractionPredicted }) {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [attraction, setAttraction] = useState(null);
  const cameraRef = useRef(null);


  const uploadImage = async () => {
    if (capturedPhoto && capturedPhoto.uri) {

      console.log("Uploading image...");

      try {
        const prediction = await predict(capturedPhoto, modelId);
        
        console.log(`Predicted ${prediction.name} with confidence ${prediction.confidence}`)

        if (parseFloat(prediction.confidence) >= minimumPredictionConfidence) {
          setAttraction(attractions.find(attraction => attraction.label === prediction.class_name))
        } else {
          Alert.alert("No attraction identified", "The picture might not contain a supported landmark. Please try again.")
        }
      } catch (error) {
        Alert.alert("Error", error.message);
      }
    }
  };

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  async function takePicture() {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      setCapturedPhoto(photo);
      setPredictionResult(null);
    }
  }

  if (capturedPhoto) {
    return (
      <View style={styles.container}>
      <Image source={{ uri: capturedPhoto.uri }} style={styles.preview} />
        {attraction ? (
          <View style={styles.floatingLabel}>
            <Text style={styles.labelText}>{attraction.name}</Text>
            <Button style={styles.viewDetailsButton} title="View Details" onPress={() => { onAttractionPredicted(attraction); onClose(); }} />
          </View>
        ) : (
        <View style={styles.buttonRow}>
          <Button title="Retake" style={styles.retakeButton} onPress={() => setCapturedPhoto(null)} />
          <Button title="OK" style={styles.okButton} onPress={uploadImage} />
        </View>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} facing={facing}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={takePicture}>
            <Ionicons name="camera" size={32} color="white" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Ionicons name="close" size={32} color="white" />
        </TouchableOpacity>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 2,
    padding: 10,
    borderRadius: 20,
  },
  preview: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: "#f0f0f0",
    padding: 20,
},
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  floatingLabel: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 8,
  },
  labelText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 15,
  },
  retakeButton: {
    backgroundColor: 'red',
    width: 100,
  },
  okButton: {
    backgroundColor: '#00b500',
    width: 100,
  },
  viewDetailsButton: {
    padding: 15,
  }
});