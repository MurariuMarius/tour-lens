import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity, View, Alert } from "react-native";
import { auth, db, app } from "../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";
import { useRouter } from "expo-router";
import { doc, setDoc } from "firebase/firestore";

import AsyncStorage from '@react-native-async-storage/async-storage';

import { getFirestore } from "firebase/firestore";
import firestore from '@react-native-firebase/firestore';



export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleRegister = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      
      

       
       const userDoc = { email: email }; 
       await addDoc(collection(db, "users"), userDoc); 

      
      try {
        await AsyncStorage.setItem("user", JSON.stringify(userDoc));
        console.log("User data stored locally:", userDoc);

        router.push({ pathname: "/profile", params: { userData: userDoc } });
      } catch (storageError) {
        console.error("Error storing user data locally:", storageError);
        
      }
      Alert.alert("Registration Successful");


    } catch (error) {
      Alert.alert("Registration Failed", error.message);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        backgroundColor: "#fff",
        width: "100%",
      }}
    >
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Register</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={{
          width: "100%",
          padding: 10,
          borderWidth: 1,
          borderColor: "#ddd",
          borderRadius: 5,
          marginBottom: 15,
        }}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        style={{
          width: "100%",
          padding: 10,
          borderWidth: 1,
          borderColor: "#ddd",
          borderRadius: 5,
          marginBottom: 15,
        }}
        secureTextEntry
      />

      <TouchableOpacity
        onPress={handleRegister}
        style={{
          backgroundColor: "#4CAF50",
          paddingVertical: 10,
          paddingHorizontal: 20,
          borderRadius: 5,
          width: "100%",
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#fff", fontSize: 18 }}>Register</Text>
      </TouchableOpacity>
    </View>
  );
}
