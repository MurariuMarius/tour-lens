import React, { ReactNode } from 'react';
import { SafeAreaView } from 'react-native';
import { Stack } from 'expo-router';
import { DestinationsProvider } from "@/contexts/DestinationContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { MessageModal } from "@/components/MessageModal";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <MessageModal>
        {children}
      </MessageModal>
    </SafeAreaView>
  );
};

export default function RootLayout() {
  return (
    <ThemeProvider>
      <DestinationsProvider>
        <Layout>
          <Stack
            screenOptions={{
              headerShown: false,
            }}
          />
        </Layout>
      </DestinationsProvider>
    </ThemeProvider>
  );
}