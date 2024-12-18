import React, { useState } from "react";
import { View, TextInput, Alert, StyleSheet, TouchableOpacity, Text, Image } from "react-native";
import { useRouter } from "expo-router";

type EmployeeCredentials = { [key: string]: string };

const employees: EmployeeCredentials = {
  emp1: "password1",
  emp2: "password2",
  admin: "admin123",
};

export default function IndexScreen() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const router = useRouter();

  const handleLogin = () => {
    if (employees[username] === password) {
      Alert.alert("Login Successful", `Welcome ${username}`);
      if (username === "admin") {
        router.push("/monthlyAttendance");
      } else {
        router.push({ pathname: "/employeeHome", params: { username } });
      }
    } else {
      Alert.alert("Error", "Invalid Credentials");
    }
  };

  return (
    <View style={styles.container}>
      {/* Logo Section */}
      <Image
        source={require("../assets/logo.jpg")} // Replace this path with the actual path to your logo
        style={styles.logo}
      />

      {/* Login Input Fields */}
      <TextInput
        value={username}
        onChangeText={setUsername}
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="#888"
      />
      <TextInput
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#888"
        secureTextEntry
      />

      {/* Login Button */}
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#143145",
    paddingHorizontal: 20,
  },
  logo: {
    width: 250,
    height: 250,
    marginBottom: 20,
    borderRadius: 10,
  },
  input: {
    marginBottom: 15,
    borderWidth: 1,
    width: "85%",
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    fontSize: 16,
    borderColor: "#ccc",
  },
  loginButton: {
    backgroundColor: "#2ECC71",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
    marginTop: 20,
    elevation: 3, // Adds shadow effect for better appearance
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});
