import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState, useRef } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { predict } from '@/services/predictionService';

export default function CameraComponent({ onClose, modelId, attractions }) {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [predictionResult, setPredictionResult] = useState(null);
  const cameraRef = useRef(null);


  const uploadImage = async () => {
    if (capturedPhoto && capturedPhoto.uri) {

      console.log("Uploading image...");

      try {
        const prediction = await predict(capturedPhoto, modelId);

        const attraction = attractions.find(attraction => attraction.label === prediction.class_name)

        prediction.name = attraction.name

        setPredictionResult(prediction);

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
        {predictionResult && (
          <View style={styles.floatingLabel}>
            <Text style={styles.labelText}>{predictionResult.name}</Text>
            <Text style={styles.labelText}>{JSON.stringify(predictionResult)}</Text>
          </View>
        )}       
        <View style={styles.buttonRow}>
          <Button title="Retake" onPress={() => setCapturedPhoto(null)} />
          <Button title="OK" onPress={uploadImage} />
        </View>
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
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});