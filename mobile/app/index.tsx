import React from "react";
import { View } from "react-native";
import { Link } from "expo-router";

import { Text, Button } from "@/components/StyledComponents";

export default function Home() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{fontFamily: "Montserrat_900Black"}}>Welcome to the App!</Text>
      <Link href="/destination" asChild>
        <Button title="Add destination" />
      </Link>
      <Link href="/login" asChild>
        <Button title="Go to Login" />
      </Link>
      <Link href="/destinations" asChild>
        <Button title="View Destinations" />
      </Link>
    </View>
  );
}
