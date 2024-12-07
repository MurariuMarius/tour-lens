import { Stack } from "expo-router";
import { DestinationsProvider } from "@/contexts/DestinationContext";
import { View, Text } from "react-native"; 
export default function RootLayout() {
  return (
    <DestinationsProvider>
      <Stack />
    </DestinationsProvider>
  );
}