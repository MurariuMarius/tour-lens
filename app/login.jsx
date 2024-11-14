import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity, View, Alert } from "react-native";
import { auth } from "../firebaseConfig"; 
import { signInWithEmailAndPassword } from "firebase/auth"; 
import { Link } from "expo-router"; 

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      
      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert("Login Successful");
    } catch (error) {
      Alert.alert("Login Failed", error.message);
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
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Login</Text>a

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
        onPress={handleLogin}
        style={{
          backgroundColor: "#4CAF50",
          paddingVertical: 10,
          paddingHorizontal: 20,
          borderRadius: 5,
          width: "100%",
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#fff", fontSize: 18 }}>Login</Text>
      </TouchableOpacity>

      <View style={{ marginTop: 20 }}>
        <Text>
          Don't have an account?{" "}
          <Link href="/register" style={{ color: "#4CAF50", fontWeight: "bold" }}>
            Register here
          </Link>
        </Text>
      </View>
    </View>
  );
}
