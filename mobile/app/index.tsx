import React from "react";
import { View, StyleSheet } from "react-native";
import { Link } from "expo-router";

import { Text, Button } from "@/components/StyledComponents";

export default function Home() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 15,
        backgroundColor: "#B0A8FE",
      }}
    >
      <Text style={styles.title}>tour-lens</Text>
      <Link href="/destination" asChild>
        <Button style={styles.button} title="Add destination" />
      </Link>
      <Link href="/login" asChild>
        <Button style={styles.button} title="Go to Login" />
      </Link>
      <Link href="/destinations" asChild>
        <Button style={styles.button} title="View Destinations" />
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 170,
  },
  title: {
    fontFamily: "Montserrat_900Black",
    fontSize: 50,
    marginBottom: 70,
    color: "white",
  }
});
