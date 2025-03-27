import { Stack, useRouter } from "expo-router";
import './globals.css';
import { useEffect, useState } from "react";
import { View, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";


export default function RootLayout() {
  const [isToken, setisToken] = useState<string | null>(null);
  const router = useRouter();
  const checkStorage = async () => {
    const token = await AsyncStorage.getItem("userToken");
    console.log("User Token:", token);
  }
  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        setisToken(token);
      } catch (error) {
        console.error("Error fetching token:", error);
        setisToken(null);
      } 
    };

    checkToken();
  }, []);

  useEffect(() => {
    if (isToken) {
      router.replace("(tabs)");
    } else {
      router.replace("login");
    }
  }, [isToken]);

  return (
    <Stack>
      <Stack.Screen
        name="(tabs)"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="login"
        options={{ headerShown: false }}
      />
    </Stack>
  );
}
