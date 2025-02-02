import React, { useState, useEffect } from "react";
import { View, StyleSheet, Modal, TouchableOpacity, Pressable } from "react-native";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Text, Button } from "@/components/StyledComponents";

import { getUser, isUserLoggedIn, logoutUser } from "@/services/authService";

export default function Home() {
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState();

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const loggedIn = await isUserLoggedIn();
      if (loggedIn) {
        const userData = await getUser();
        setUserData(userData);
      }
      setIsLoggedIn(loggedIn);
    } catch (error) {
      console.error("Error checking login status:", error);
    }
  };

  const handleLogout = async () => {
    logoutUser();
    setModalVisible(false);
    setIsLoggedIn(false);
    setUserData(undefined);
  };

  console.log(userData);

  return (
    <View style={styles.container}>
      {isLoggedIn && (
        <TouchableOpacity 
          style={styles.settingsButton}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="settings-outline" size={24} color="white" />
        </TouchableOpacity>
      )}
      
      {isLoggedIn && (
        <View style={styles.welcomeContainer}>
          <View style={styles.welcomeRow}>
            <Text style={styles.welcomeText}>Welcome</Text>
            <Text style={styles.emojiText}>👋</Text>
          </View>
          <Text style={styles.nameText}>
            {userData?.name}!
          </Text>
        </View>
      )}

      <View style={styles.contentContainer}>
        <Text style={styles.title}>tour-lens</Text>

        {userData?.isAdmin && (
          <Link href="/destination" asChild>
            <Button style={styles.button} title="Add destination" />
          </Link>
        )}
        
        {!isLoggedIn && (
          <Link href="/login" asChild>
            <Button style={styles.button} title="Go to Login" />
          </Link>
        )}
        
        <Link href="/destinations" asChild>
          <Button style={styles.button} title="View Destinations" />
        </Link>
      </View>

      {isLoggedIn && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Profile</Text>
                <Pressable onPress={() => setModalVisible(false)}>
                  <Ionicons name="close" size={24} color="white" />
                </Pressable>
              </View>

              <View style={styles.profileData}>
                <Text style={styles.profileText}>Name: {userData.name}</Text>
                <Text style={styles.profileText}>Email: {userData.email}</Text>
                {userData?.isAdmin && (
                  <Text style={styles.adminBadge}>Administrator</Text>
                )}
              </View>

              <Button 
                style={styles.logoutButton}
                title="Logout"
                onPress={handleLogout}
              />
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#B0A8FE",
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 15,
  },
  settingsButton: {
    position: "absolute",
    top: 20,
    right: 20,
    zIndex: 1,
  },
  button: {
    width: 170,
  },
  title: {
    fontFamily: "Montserrat_900Black",
    fontSize: 50,
    marginBottom: 70,
    color: "white",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#9fbafc",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    minHeight: "40%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#f6f6f6",
  },
  profileData: {
    flex: 1,
    gap: 10,
  },
  profileText: {
    fontSize: 16,
    color: "#f6f6f6",
  },
  logoutButton: {
    backgroundColor: "#9184FE",
    marginTop: 20,
  },
  adminBadge: {
    fontSize: 16,
    color: "#fcde3d",
    fontWeight: "bold",
  },
  welcomeContainer: {
    position: "absolute",
    alignItems: "center",
    top: 30,
    left: 0,
    right: 0,
  },
  welcomeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  welcomeText: {
    color: "white",
    fontFamily: "Montserrat_900Black",
    fontSize: 22,
    opacity: 0.9,
  },
  emojiText: {
    fontSize: 22,
  }, 
  nameText: {
    color: "white",
    fontFamily: "Montserrat_900Black",
    fontSize: 22,
  },
});