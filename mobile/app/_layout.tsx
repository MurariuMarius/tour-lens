import React, { ReactNode } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { DestinationsProvider } from "@/contexts/DestinationContext";
import { ThemeProvider } from "@/contexts/ThemeContext";

import { MessageModal } from "@/components/MessageModal";

const Layout: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
      <SafeAreaView style={styles.container}>
          <MessageModal>
            {children}
          </MessageModal>
      </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
      flex: 1,
  },
});

export default function RootLayout() {
  return (
    <ThemeProvider>
      <DestinationsProvider>
        <Layout>
          <Stack />
        </Layout>
      </DestinationsProvider>
    </ThemeProvider>
  );
}