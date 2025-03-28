import React, { useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from "react-native";
import CustomText from "@/components/CustomText";
import CustomTextMedium from "@/components/CustomTextMedium";
import CustomTextBold from "@/components/CustomTextBold";
import { Modal } from '@/components/Modal';

const LogScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const handlePress = () => {
    setModalVisible(true);
    const timer = setTimeout(() => { setModalVisible(false); }, 2000);
    return () => clearTimeout(timer)
  }
  const [logs, setLogs] = useState([
    { id: "1", date: "25.02.02", activity: "Bật máy bơm", category: "Người dùng" },
    { id: "2", date: "25.02.02", activity: "Tắt máy bơm", category: "Hệ thống" },
    { id: "3", date: "25.02.02", activity: "Tắt máy bơm", category: "Hệ thống" },
    { id: "4", date: "25.02.02", activity: "Tắt máy bơm", category: "Hệ thống" },
    { id: "5", date: "25.02.02", activity: "Tắt máy bơm", category: "Hệ thống" },
    { id: "6", date: "25.02.02", activity: "Tắt máy bơm", category: "Hệ thống" },
  ]);

  return (
    <View style={styles.container}>
      <View>
        <TouchableOpacity onPress={() => handlePress()} style={styles.iconButton}>
          <Image
            source={require("@/assets/icons/download_icon.png")}
            className="w-10 h-10"
          />
        </TouchableOpacity> 
      </View>
      {/* Header */}
      <View style={styles.header}>
        <CustomTextBold style={styles.headerText}>Ngày</CustomTextBold>
        <CustomTextBold style={styles.headerText}>Hoạt động</CustomTextBold>
        <CustomTextBold style={styles.headerText}>Phân loại</CustomTextBold>
      </View>

      {/* Danh sách hoạt động */}
      <FlatList
        data={logs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.logItem, { backgroundColor: item.category === "Người dùng" ? "#E3FFDE" : "#C4FFB8" }]}>
            <CustomTextMedium style={styles.logText}>{item.date}</CustomTextMedium>
            <CustomTextMedium style={styles.logText}>{item.activity}</CustomTextMedium>
            <CustomTextMedium style={styles.logText}>{item.category}</CustomTextMedium>
          </View>
        )}
      />
    <Modal isOpen={modalVisible} withInput={false}>
      <View className="bg-[#FFFFFF] w-full p-4 gap-4 rounded-[30px] shadow-[0_0_10px_10px_rgba(124,245,255,0.25)] ml-5 mr-5 items-center justify-center border-solid border-[1px] border-[#448AFD] ">
        <Image source={require('@/assets/icons/success_icon.png')} />
        <CustomTextBold>Đã tải xuống lịch sử hoạt động</CustomTextBold>
        <CustomTextMedium>Kiểm tra trong phần quản lí tệp của thiết bị</CustomTextMedium>
      </View>
    </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    borderBottomWidth: 2,
    paddingBottom: 5,
  },
  headerText: {
    fontSize: 20,
    flex: 1,
    textAlign: "center",
  },
  iconButton: {
    marginLeft: "auto",
    marginBottom: 10,
  },
  logItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    marginBottom: 8,
    borderRadius: 30,
    height: 60,
  },
  logText: {
    flex: 1,
    textAlign: "center",
    fontSize: 14,
  },
});

export default LogScreen;
