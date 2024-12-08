import React, { useState } from "react";
import { TouchableOpacity, View, Alert } from "react-native";
import { auth } from "../firebaseConfig"; 
import { signInWithEmailAndPassword } from "firebase/auth"; 
import { Link } from "expo-router";

import { Text, TextInput } from "@/components/StyledComponents";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      
      const usersCollection = collection(db, "users"); 
      const q = query(usersCollection, where("email", "==", user.email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data(); 
        console.log("User Data from Firestore:", userData);
        router.push({ pathname: "/profile", params: { userData } });

      } else {
        console.log("No user found in Firestore with this email.");
        
        
      }



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
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Login</Text>

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
