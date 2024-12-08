import React, { useState } from 'react';
import { View, FlatList, Modal, Image, StyleSheet, Platform, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { createDestination } from '../services/destinationService';

import { Text, Button, TextInput } from '@/components/StyledComponents';

const Destinations = () => {

    const [destinationName, setDestinationName] = useState('');
    const [destinationDescription, setDestinationDescription] = useState('');
    const [attractions, setAttractions] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [attractionName, setAttractionName] = useState('');
    const [attractionDescription, setAttractionDescription] = useState('');
    const [attractionPictures, setAttractionPictures] = useState([]);

    const getPermissionAsync = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('Sorry, we need camera roll permissions to make this work!');
            return false;
        }
        return true;
    };
    
    const pickImage = async () => {
        console.log('Attempting to open image picker...');
    
        // Ensure permissions are granted
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.status !== 'granted') {
            Alert.alert("Permission required", "Camera roll access is needed to select images.");
            return;
        }
    
        // Launch the image picker
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true,
            quality: 1,
            base64: true,
        });
    
        // Check if the operation was cancelled
        if (result.cancelled) {
            console.log('Image picker was cancelled');
            return;
        }
    
        // Handle selected images
        if (result.assets && result.assets.length > 0) {
            console.log(`Selected ${result.assets.length} images`);
            const newPictures = result.assets.map(asset => asset.base64);
            setAttractionPictures([...attractionPictures, ...newPictures]);
        }
    };

    const addAttraction = () => {

        if (!attractionName.trim()) {
            Alert.alert("Error", "Please enter a name for the attraction.");
            return;
        }
        if (!attractionDescription.trim()) {
            Alert.alert("Error", "Please enter a description for the attraction.");
            return;
        }
        if (attractionPictures.length < 10) {
            Alert.alert("Error", "Please add at least 10 images of the landmark.");
            return;
        }

        setAttractions([
            ...attractions,
            {
                name: attractionName,
                description: attractionDescription,
                pictures: attractionPictures,
            },
        ]);
        setModalVisible(false);
        setAttractionName('');
        setAttractionDescription('');
        setAttractionPictures([]);
    };

    const sendData = async () => {


        if (!destinationName.trim()) {
            Alert.alert("Error", "Please enter a name for the destination.");
            return;
        }
        if (!destinationDescription.trim()) {
            Alert.alert("Error", "Please enter a description for the destination.");
            return;
        }

        return await createDestination({
            name: destinationName,
            description: destinationDescription,
            attractions: attractions,
        });
    }

    const removeAttraction = (index) => {
        const newAttractions = [...attractions];
        newAttractions.splice(index, 1);
        setAttractions(newAttractions);
    };

    return (
        <View style={styles.container}>
            <TextInput
                placeholder="Destination Name"
                value={destinationName}
                onChangeText={setDestinationName}
                style={styles.input}
            />
            <TextInput
                placeholder="Destination Description"
                value={destinationDescription}
                onChangeText={setDestinationDescription}
                style={styles.input}
                multiline
            />

            <Button title="Add Attraction" onPress={() => setModalVisible(true)} />

            <FlatList
                data={attractions}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => (
                    <View style={styles.attractionItem}>
                        <Text>{item.name}</Text>
                        <Button title="Remove" onPress={() => removeAttraction(index)} />
                    </View>
                )}
            />

            <Button title="Send Data" onPress={sendData} />

            <Modal animationType="slide" transparent={false} visible={modalVisible}>
                <View style={styles.modalContainer}>
                    <TextInput
                        placeholder="Attraction Name"
                        value={attractionName}
                        onChangeText={setAttractionName}
                        style={styles.input}
                    />
                    <TextInput
                        placeholder="Attraction Description"
                        value={attractionDescription}
                        onChangeText={setAttractionDescription}
                        style={styles.input}
                        multiline
                    />
                    <Button title="Pick an image from camera roll" onPress={pickImage} />
                    <FlatList
                        data={attractionPictures}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => (
                            <Image source={{ uri: `data:image/jpg;base64,${item}` }} style={styles.image} />
                        )}
                    />
                    <Button title="Add Attraction" onPress={addAttraction} />
                    <Button title="Close Modal" onPress={() => setModalVisible(false)} />
                </View>
            </Modal>
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    modalContainer: {
        flex: 1,
        padding: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: 'gray',
        padding: 10,
        marginBottom: 10,
    },
    image: {
        width: 200,
        height: 150,
        resizeMode: 'cover',
        marginBottom: 10,
    },
    attractionItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc'
    },
});

export default Destinations;
