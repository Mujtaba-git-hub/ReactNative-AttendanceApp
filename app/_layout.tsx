// _layout.tsx
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#0E2A3A" },
        headerTintColor: "#FFFFFF",
        headerTitleStyle: { fontWeight: "bold" },
      }}
    >
     <Stack.Screen name="index" options={{ headerShown: false }} />

      <Stack.Screen name="employeeHome" />
      <Stack.Screen name="monthlyAttendance" />
    </Stack>
  );
}
