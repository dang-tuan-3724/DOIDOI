import React, { useState, useEffect } from "react";
import axios from 'axios';
import { View, Text, Switch, StyleSheet, ScrollView, Alert, TouchableOpacity, TextInput, ActivityIndicator, RefreshControl  } from "react-native";
import CustomText from "@/components/CustomText";
import CustomTextMedium from "@/components/CustomTextMedium";
import CustomTextBold from "@/components/CustomTextBold";
import deviceApi from "@/api/device";
import sensorApi from "@/api/sensor";
import DeviceCard from '@/components/DeviceCard'
import SensorCard from "@/components/SensorCard"
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { getDeviceStyle, getSensorStyle } from '@/helper/getStyle'
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { MenuProvider } from 'react-native-popup-menu';

type DeviceType = {
  deviceID: number;
  deviceName: string;
  quantity: number;
  status: string;
  type: 'led_light' | 'pump'; 
  state: string;
  schedule: string | null;
};

type SensorState = {
  sensorID: number;
  sensorName: string;
  userID: number;
  quantity: number;
  status: 'able' | 'disable';
  type: 'Temperature & Humidity Sensor' | string;
  alertThreshold: number | string;
};

export default function DeviceControlCard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [devices, setDevices] = useState<DeviceType[]>([]);
  const [sensors, setSensors] = useState<SensorState[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const fetchData = async () => {
    const token = await AsyncStorage.getItem("AccessToken");
    if (!token) return;

    try {
      const [deviceRes, sensorRes] = await Promise.all([
        deviceApi.getAllDevice(token),
        sensorApi.getAllSensor(token),
      ]);

      setDevices(deviceRes ?? []);
      setSensors(sensorRes ?? []);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        const errorMessage = error.response.data?.error;
        Alert.alert("Error", errorMessage, [{ text: "OK" }]);
        router.replace("/login");
      } else {
        console.error("Unexpected error:", error);
      }
    } finally {
      setIsLoading(false); 
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const getListAlert = async () => {
      if (sensors.length > 0) {
        const filtered = sensors
          .filter(sensor => sensor.status === "able")
          .map(sensor => {
            const flag = sensor.sensorName.split("#")[1]?.trim() || "";
            return {
              id: sensor.sensorID,
              alert: sensor.alertThreshold,
              flag: flag,
            };
          });
    
        await AsyncStorage.setItem("ListAlert", JSON.stringify(filtered));
      }
    }

    getListAlert();
  }, [sensors]); // chạy khi sensors thay đổi
  
  
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#00aaff" />
        <Text>Đang tải dữ liệu...</Text>
      </View>
    );
  }

  const handleDeleteSensor = (sensorID: number) => {
    setSensors(prev => prev.filter(s => s.sensorID !== sensorID));
  };

  const handleDeleteDevice = (deviceId: number) => {
    setDevices(prev => prev.filter(d => d.deviceID !== deviceId));
  };

  return (
    <MenuProvider>
      <ScrollView 
        style={{ backgroundColor: "#FFFFFF" }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
          <View style={styles.container}>
            {/* Header */}
            <CustomTextBold style={styles.headerText}>
              Danh sách thiết bị của bạn
            </CustomTextBold>

            {devices?.map((item, index) => {
              const { color, title } = getDeviceStyle(item.type);
              
              return (
                <DeviceCard key={item.deviceID} item={item} color={color} styles={styles} title={title} handleDelete={handleDeleteDevice} />
              );
            })}

            {/** Sensor Cards */}
            {sensors?.map((item, index) => {
            const sensorStyle = getSensorStyle(item.sensorName);
            
            return (
              <SensorCard key={item.sensorID} item={item} sensorStyle={sensorStyle} styles={styles} handleDelete={handleDeleteSensor} />
            );
          })}

          </View>
      </ScrollView>
    </MenuProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginBottom: 90,
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
    padding: 7, // vùng nhấn lớn hơn
    justifyContent: 'center',
    alignItems: 'center',
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
    textAlign: "center",
    
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
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 10,
  },
  autoSection: {
    marginTop: 15,
    width: "100%",
  },
  
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  
  timeInput: {
    backgroundColor: "white",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    width: "60%",
    borderWidth: 1,
    borderColor: "#ccc",
    marginRight: 10,
  },
  
  removeBtn: {
    backgroundColor: "#ff5c5c",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  
  removeBtnText: {
    color: "white",
    fontWeight: "bold",
  },
  
  addBtn: {
    backgroundColor: "#4caf50",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    alignSelf: "flex-start",
  },
  
  addBtnText: {
    color: "white",
    fontWeight: "bold",
  },
  
});
