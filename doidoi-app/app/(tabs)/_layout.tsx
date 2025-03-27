import { Image } from "react-native";
import React from "react";
import { Tabs } from "expo-router";

const _layout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          position: "absolute",
          bottom: 20,
          marginHorizontal: 20,
          height: 70,
          borderRadius: 50,
          backgroundColor: "#7CF5FF",
          shadowColor: "#000", // Màu bóng
          shadowOpacity: 0.1,
          shadowOffset: { width: 0, height: 4 }, // Đổ bóng lên trên
        },
      tabBarItemStyle: {
        height: 80,
        paddingBottom: 10, // Add padding to push icons down
        paddingTop: 10, // Balance padding at the top
      },
      tabBarIconStyle: {
        marginTop: 5, // Add margin to move icons down slightly
      },
      tabBarLabelStyle: {
        fontSize: 10,
        marginBottom: 5, // Add margin to labels to adjust position
      },
      tabBarActiveTintColor: "#3B82F6",
      tabBarInactiveTintColor: "#9CA3AF",
      tabBarShowLabel: false,
      }}
    >

      <Tabs.Screen
      name="log"
      options={{
        title: "Log",
        headerShown: false,
        tabBarIcon: ({ focused }) => (
        <Image
          source={require("@/assets/icons/log_icon.png")}
          style={{ width: focused ? 38 : 31, height: focused ? 38 : 31 }}
        />
        ),
      }}
      />
      <Tabs.Screen
      name="addDevice"
      options={{
        title: "Add",
        headerShown: false,
        tabBarIcon: ({ focused }) => (
        <Image
          source={require("@/assets/icons/add_icon.png")}
          style={{ width: focused ? 41 : 37, height: focused ? 41 : 37 }}
        />
        ),
      }}
      />
      <Tabs.Screen
      name="device"
      options={{
        title: "Device",
        headerShown: false,
        tabBarIcon: ({ focused }) => (
        <Image
          source={require("@/assets/icons/device_icon.png")}
          style={{ width: focused ? 50 : 45, height: focused ? 50 : 45 }}
        />
        ),
      }}
      />
      <Tabs.Screen
      name="index"
      options={{
        title: "Home",
        headerShown: false,
        tabBarIcon: ({ focused }) => (
        <Image
          source={require("@/assets/icons/home_icon.png")}
          style={{ width: focused ? 40 : 34, height: focused ? 40 : 34 }}
        />
        ),
      }}
      />


      <Tabs.Screen
      name="profile"
      options={{
        title: "You",
        headerShown: false,
        tabBarIcon: ({ focused }) => (
        <Image
          source={require("@/assets/icons/you_icon.png")}
          style={{ width: focused ? 42 : 32, height: focused ? 42 : 32 }}
        />
        ),
      }}
      />
    </Tabs>
  );
};

export default _layout;
