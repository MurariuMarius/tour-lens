import React, { useState } from "react";
import { TouchableOpacity, View, Alert } from "react-native";
import { auth, db } from "../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, Timestamp, doc, setDoc } from "firebase/firestore";
import { useRouter } from "expo-router";

import AsyncStorage from '@react-native-async-storage/async-storage';

import { Text, TextInput } from "@/components/StyledComponents";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();

  const checkPasswords = (password, confirmPassword) => {
    if (password !== confirmPassword) {
      return false;
    }

    if (password.length < 8) {
      Alert.alert("Error", "Password must be at least 8 characters long.");
      return false;
    }

    const hasCapitalLetter = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialCharacter = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);

    if (!hasCapitalLetter) {
      Alert.alert("Error", "Password must contain at least one capital letter.");
      return false;
    }

    if (!hasNumber) {
      Alert.alert("Error", "Password must contain at least one number.");
      return false;
    }

    if (!hasSpecialCharacter) {
      Alert.alert("Error", "Password must contain at least one special character.");
      return false;
    }

    return true;
  };

  const handleRegister = async () => {

    if (!checkPasswords(password, confirmPassword)) {
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      userDoc =  {
        name: name,
        email: email,
        createdAt: Timestamp.now()
      }

      const docRef = doc(collection(db, "users"), user.uid);
      await setDoc(docRef, userDoc)

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

      <View style={{ width: '100%', flexDirection: 'column', alignItems: 'center', marginBottom: 15 }}>


        <TextInput
          placeholder="Name"
          value={name}
          onChangeText={setName}
          style={{
            width: "100%",
            height: 40,
            padding: 10,
            borderWidth: 1,
            borderColor: "#ddd",
            borderRadius: 5,
            marginBottom: 15,
          }}
        />

        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={{
            width: "100%",
            padding: 10,
            height: 40,
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
            height: 40,
            borderWidth: 1,
            borderColor: "#ddd",
            borderRadius: 5,
            marginBottom: 15,
          }}
          secureTextEntry
        />

        <TextInput
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          style={{
            width: "100%",
            padding: 10,
            height: 40,
            borderWidth: 1,
            borderColor: "#ddd",
            borderRadius: 5,
            marginBottom: 15,
          }}
          secureTextEntry
        />
      </View>

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
