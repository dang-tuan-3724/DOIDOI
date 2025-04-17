import React, { useEffect } from "react";
import { StyleSheet, Text, View, Image, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Splash = () => {
  const router = useRouter();

  useEffect(() => {
    const checkLoginStatus = async () => {
      // Kiểm tra token trong AsyncStorage
      let token = await AsyncStorage.getItem("AccessToken");

      // Điều hướng dựa trên trạng thái đăng nhập
      if (token) {
        router.replace("/(tabs)"); 
      } else {
        router.replace("/login"); 
      }
    };

    setTimeout(() => {
      checkLoginStatus();
    }, 2000); // 2 giây
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require("@/assets/images/Zoizoi_logo_full.png")} // Đường dẫn đến logo
        style={styles.logo}
      />
      <ActivityIndicator size="large" color="#ffffff" style={styles.loading} />
    </View>
  );
};

export default Splash;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white", // Màu nền
  },
  logo: {
    width: 250,
    height: 300,
    marginBottom: 0,
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "black",
    marginBottom: 20,
  },
  loading: {
    color: "#000000",
    marginTop: 20,
  },
});