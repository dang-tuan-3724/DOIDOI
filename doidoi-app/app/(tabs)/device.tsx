import React, { useState } from "react";
import { View, Text, Switch, StyleSheet } from "react-native";
import { Menu, Divider, PaperProvider } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import CustomText from "@/components/CustomText";
import CustomTextMedium from "@/components/CustomTextMedium";
import CustomTextBold from "@/components/CustomTextBold";

const device = [
  {color: "#7CF5FF", title: "Máy bơm"},
  {color: "##D2FBFE", title: "Đèn LED"}
]

const sensor = [
  {color: "#FFF2D0", title: "Cảm biến ánh sáng", value: "LUX"}, 
  {color: "#BAFF8F", title: "Cảm biến độ ẩm", value: "%"}, 
  {color: "#F3FFA8", title: "Cảm biến độ ẩm đất", value: "%"}, 
  {color: "#FFF2D0", title: "Cảm biến nhiệt độ", value: "độ C"}, 
]

export default function PumpControlCard() {
  const [mode, setMode] = useState("manual"); 
  const [isOn, setIsOn] = useState(true); // Trạng thái máy bơm
  const [menuVisible, setMenuVisible] = useState(false);
  const [isEnabled, setIsEnabled] = useState(true); // Trạng thái sensor

  return (
    <PaperProvider>
      <View style={styles.container}>
        {/* Header */}
        <CustomTextBold style={styles.headerText}>Danh sách thiết bị của bạn</CustomTextBold>

        {/* Device Card */}
        <View style={[styles.card, {backgroundColor: device[0].color}]}>
          {/* Header của card */}
          <View style={styles.cardHeader}>
            <CustomTextBold style={styles.title}>{device[0].title}</CustomTextBold>
            <Menu
              visible={menuVisible}
              onDismiss={() => setMenuVisible(false)}
              anchor={
                <Text style={styles.menuIcon} onPress={() => setMenuVisible(true)}>
                  ⋮
                </Text>
              }
            >
              <Menu.Item onPress={() => {}} title="Cài đặt" />
              <Divider />
              <Menu.Item onPress={() => {}} title="Thông tin" />
            </Menu>
          </View>

          {/* Nội dung */}
          <View style={styles.content}>
            {/* Chế độ tưới */}
            <View style={styles.leftSection}>
              <Text style={styles.label}>Chế độ tưới</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={mode}
                  onValueChange={(itemValue) => setMode(itemValue)}
                  style={styles.picker}
                  mode="dropdown"
                >
                  <Picker.Item label="Thủ công" value="manual" />
                  <Picker.Item label="Tự động" value="auto" />
                </Picker>
              </View>
            </View>

            {/* Thanh dọc */}
            <View style={styles.separatorDevice} />

            {/* Công tắc */}
            <View style={styles.rightSection}>
              <Switch
                value={isOn}
                onValueChange={() => setIsOn(!isOn)}
                trackColor={{ false: "#767577", true: "#7F3DFF" }}
                thumbColor={isOn ? "#FFFFFF" : "#f4f3f4"}
              />
              <Text style={styles.statusText}>{isOn ? "ON" : "OFF"}</Text>
            </View>
          </View>

          {/* Ghi chú */}
          <Text style={styles.footerText}>Đã được bật tự động</Text>
        </View>
        
        {/* Sensor Card */}   
        <View style={[styles.card, {backgroundColor: sensor[0].color}]}>
          {/* Header của card */}
          <View style={styles.cardHeader}>
            <CustomTextBold style={styles.title}>{sensor[0].title}</CustomTextBold>
          </View>

          {/* Nội dung */}
          <View style={styles.content}>
            {/* Chế độ tưới */}
            <View style={styles.leftSectionSensor}>
              <Text style={styles.label}>Tình trạng: <Text style={styles.statusText}>Cho phép</Text></Text>
              <Switch
                value={isEnabled}
                onValueChange={() => setIsEnabled(!isEnabled)}
                trackColor={{ false: "#767577", true: "#000" }}
                thumbColor={isEnabled ? "#FFF" : "#f4f3f4"}
              />
            </View>

            {/* Thanh dọc */}
            <View style={styles.separatorSensor} />

            {/* Giá trị cảm biến */}
            <View style={styles.rightSection}>
              <Text style={styles.label}>Giá trị ({sensor[0].value})</Text>
              <Text style={styles.sensorValue}>1000</Text>
            </View>
          </View>
        </View>
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#FFFFFF",
  },
  headerText: {
    fontSize: 18,
    color: "#000A9C",
    marginBottom: 10,
  },
  card: {
    padding: 15,
    borderRadius: 30,
    width: "100%",
    marginBottom: 20,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingRight: 15,
    paddingLeft: 15,
  },
  title: {
    fontSize: 20,
    flex: 1, 
    textAlign: "center",
  },
  menuIcon: {
    fontSize: 20,
    fontWeight: "bold",
  },
  content: {
    flexDirection: "row", 
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 15,
  },
  leftSection: {
    flex: 3,
    alignItems: "flex-start",
  },
  label: {
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 5,
  },
  pickerContainer: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 5,
    height: 40,
    width: "70%", 
    justifyContent: "center",
  },
  picker: {
    color: "black",
    
  },
  separatorDevice: {
    width: 1,
    height: 50,
    backgroundColor: "#FFFFFF", 
    marginHorizontal: 10, 
  },
  rightSection: {
    flex: 1,
    alignItems: "center",
  },
  statusText: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 5,
  },
  footerText: {
    fontSize: 14,
    color: "#7E7878",
    textAlign: "center",
    marginTop: 10,
  },
  separatorSensor: {
    width: 1,
    height: 50,
    backgroundColor: "#000000", 
    marginHorizontal: 10, 
  },
  leftSectionSensor: {
    flex: 1,
    alignItems: "center",
  },
  rightSectionSensor: {
    flex: 1,
    alignItems: "center",
  },
  sensorValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "blue",
  },
});
