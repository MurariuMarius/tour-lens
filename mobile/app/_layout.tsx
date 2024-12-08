import { Stack } from "expo-router";
import { DestinationsProvider } from "@/contexts/DestinationContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
export default function RootLayout() {
  return (
    <ThemeProvider>
      <DestinationsProvider>
        <Stack />
      </DestinationsProvider>
    </ThemeProvider>
  );
}