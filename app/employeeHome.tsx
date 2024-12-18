import React, { useLayoutEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  StatusBar,
  TextInput,
  Modal,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export default function EmployeeHomeScreen() {
  const navigation = useNavigation();
  const router = useRouter();
  const { username = "Unknown" } = useLocalSearchParams();

  const [isModalVisible, setModalVisible] = useState(false);
  const [reason, setReason] = useState("");

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: `Welcome 👋 ${username}`,
      headerStyle: { backgroundColor: "#1E90FF" },
      headerTintColor: "#FFFFFF",
      headerTitleStyle: { fontWeight: "bold", fontSize: 18 },
    });
  }, [navigation, username]);

  const handleCheckIn = async () => {
    const now = new Date().toLocaleString();
    const currentAttendance = await AsyncStorage.getItem("attendance");
    const parsedAttendance = currentAttendance ? JSON.parse(currentAttendance) : [];
    const record = { user: username, type: "Check-In", time: now };
    await AsyncStorage.setItem("attendance", JSON.stringify([...parsedAttendance, record]));
    Alert.alert("Check-In Successful", now);
  };

  const handleCheckOut = async () => {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes(); // Time in minutes
    const cutoffTime = 1 * 60 + 50; // 1:50 AM in minutes

    if (currentTime < cutoffTime) {
      setModalVisible(true); // Show modal to collect reason
    } else {
      await saveCheckOutRecord(); // No reason needed for on-time checkout
    }
  };

  const saveCheckOutRecord = async (reasonProvided?: string) => {
    const now = new Date().toLocaleString();
    const currentAttendance = await AsyncStorage.getItem("attendance");
    const parsedAttendance = currentAttendance ? JSON.parse(currentAttendance) : [];
    const record = {
      user: username,
      type: "Check-Out",
      time: now,
      reason: reasonProvided || "On Time",
    };

    await AsyncStorage.setItem("attendance", JSON.stringify([...parsedAttendance, record]));
    Alert.alert("Check-Out Successful", now);
    setReason(""); // Reset the reason input
    setModalVisible(false); // Close the modal
  };

  const handleReasonSubmit = () => {
    if (!reason.trim()) {
      Alert.alert("Error", "Reason cannot be empty.");
      return;
    }
    saveCheckOutRecord(reason.trim());
  };

  const handleLogout = () => {
    Alert.alert("Logout Successful", "You have been logged out.");
    router.push("/");
  };

  return (
    <>
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Image source={require("../assets/logo.jpg")} style={styles.logo} />
        </View>

        <View style={styles.buttonContainer}>
          {/* Check-In Button */}
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#2ECC71" }]}
            onPress={handleCheckIn}
          >
            <FontAwesome name="sign-in" size={20} color="#fff" />
            <Text style={styles.buttonText}>Check-In</Text>
          </TouchableOpacity>

          {/* Check-Out Button */}
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#FF5555" }]}
            onPress={handleCheckOut}
          >
            <FontAwesome name="sign-out" size={20} color="#fff" />
            <Text style={styles.buttonText}>Check-Out</Text>
          </TouchableOpacity>

          {/* Logout Button */}
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#000000" }]}
            onPress={handleLogout}
          >
            <FontAwesome name="power-off" size={20} color="#fff" />
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Modal for Early Check-Out Reason */}
      <Modal visible={isModalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Early Check-Out Reason</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your reason"
              placeholderTextColor="#888"
              value={reason}
              onChangeText={setReason}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: "#2ECC71" }]}
                onPress={handleReasonSubmit}
              >
                <Text style={styles.buttonText}>Submit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: "#FF5555" }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#143145",
  },
  logoContainer: {
    marginBottom: 40,
  },
  logo: {
    width: 250,
    height: 250,
    resizeMode: "contain",
    borderRadius: 10,
  },
  buttonContainer: {
    width: "80%",
    paddingHorizontal: 20,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    marginLeft: 10,
    fontWeight: "600",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalContent: {
    width: "80%",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 20,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
});
