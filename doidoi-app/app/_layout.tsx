import { Stack, useRouter } from "expo-router";
import './globals.css';
import { useEffect, useState } from "react";
import { View, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";


export default function RootLayout() {
  return (
    <Stack>
      {/* Màn hình login xuất hiện trước, không có thanh điều hướng */}
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
