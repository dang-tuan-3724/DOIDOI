import { Stack } from "expo-router";
import './globals.css';
import { View, Text } from "react-native";

export default function RootLayout() {
  return <Stack>
    <Stack.Screen
    name="(tabs)"
    options={{headerShown: false}}
    />
  </Stack>
}
