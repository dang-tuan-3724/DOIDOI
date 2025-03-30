import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import { View, Text } from "react-native";
import './globals.css'

export default function RootLayout() {
  const router = useRouter();

  useEffect(() => {
    // Redirect users to login screen first
    router.replace("/splash");
  }, []);

  return (
    <Stack>
      {/* Hide navigation for login */}
      <Stack.Screen name="splash" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
