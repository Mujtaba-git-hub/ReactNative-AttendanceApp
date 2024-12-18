import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, Button, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

type AttendanceRecord = { user: string; type: "Check-In" | "Check-Out"; time: string; reason?: string };

export default function MonthlyAttendanceScreen() {
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    const data = await AsyncStorage.getItem("attendance");
    const records: AttendanceRecord[] = data ? JSON.parse(data) : [];
    setAttendanceRecords(records);
  };

  const resetAttendance = async () => {
    await AsyncStorage.removeItem("attendance");
    setAttendanceRecords([]);
    Alert.alert("Reset Successful", "Attendance records have been cleared.");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Monthly Attendance Report</Text>
      {attendanceRecords.length > 0 ? (
        <FlatList
          data={attendanceRecords}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.record}>
              <Text>{item.user || "Unknown"}: {item.type} at {item.time}</Text>
              <Text style={styles.reason}>
                Reason: {item.reason || "N/A"}
              </Text>
            </View>
          )}
        />
      ) : (
        <Text style={styles.noRecords}>No attendance records available.</Text>
      )}
      <Button title="Reset Attendance" onPress={resetAttendance} color="#FF5555" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: "#0E2A3A" },
  header: { fontSize: 20, color: "#FFFFFF", textAlign: "center", marginBottom: 10 },
  record: { padding: 10, backgroundColor: "#FFFFFF", marginVertical: 5 },
  reason: { fontSize: 12, color: "#555", marginTop: 5 },
  noRecords: { color: "#FFFFFF", fontSize: 16, textAlign: "center" },
});
