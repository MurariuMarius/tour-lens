import React from "react";
import { View, Text, Button } from "react-native";
import { Link } from "expo-router";

export default function Home() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Welcome to the App!</Text>
      <Link href="/login" asChild>
        <Button title="Go to Login" />
      </Link>
    </View>
  );
}
