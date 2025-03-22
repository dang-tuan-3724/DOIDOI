import { Stack } from "expo-router";
import './globals.css';
import { View, Text } from "react-native";

export default function RootLayout() {
  return (
    <Stack>
      {/* Màn hình login xuất hiện trước, không có thanh điều hướng */}
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
