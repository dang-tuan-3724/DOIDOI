import React, { useState, useEffect } from "react";
import axios from 'axios';
import { View, Text, Switch, StyleSheet, ScrollView, Alert, TouchableOpacity, TextInput, ActivityIndicator, RefreshControl  } from "react-native";
import { Menu, PaperProvider } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import CustomText from "@/components/CustomText";
import CustomTextMedium from "@/components/CustomTextMedium";
import CustomTextBold from "@/components/CustomTextBold";
import deviceApi from "@/api/device";
import sensorApi from "@/api/sensor";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { getDeviceStyle, getSensorStyle } from '@/helper/getStyle'
import DateTimePickerModal from 'react-native-modal-datetime-picker';

type AdafruitState = {
  // cho LED
  lightID?: number;
  // cho pump
  pumpID?: string;
  autoLevel?: boolean;
  schedule?: string;
  // cả hai
  state: 'on' | 'off';
  message: string;
  deviceID: number;
  deviceName: string;
};

type DeviceType = {
  deviceID: number;
  deviceName: string;
  quantity: number;
  status: string;
  type: 'led_light' | 'pump'; // có thể thêm 'sensor' nếu có
  adafruitState: AdafruitState;
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
  const [mode, setMode] = useState<string | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [devices, setDevices] = useState<DeviceType[]>([]);
  const [sensors, setSensors] = useState<SensorState[]>([]);
  const [inputValues, setInputValues] = useState<{ [key: number]: string }>({});
  const [menuVisibleIndex, setMenuVisibleIndex] = useState<number | null>(null);
  const [wateringTimes, setWateringTimes] = useState([""]);
  const [visiblePickerIndex, setVisiblePickerIndex] = useState<number | null>(null);
  const [originalSchedule, setOriginalSchedule] = useState([""]);
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

      // ✅ Xử lý lịch tưới nước ngay sau khi có device
      const pumpDevice = (deviceRes ?? []).find((d) => d.type === "pump");
      if (pumpDevice?.adafruitState?.schedule) {
        const times = pumpDevice.adafruitState.schedule
          .split(",")
          .map((t: string) => t.trim());
        setWateringTimes(times);
        setOriginalSchedule(times);
      }
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
  
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#00aaff" />
        <Text>Đang tải dữ liệu...</Text>
      </View>
    );
  }
  
  const handleToggleStatus = async (index: number, id: number, currentStatus: string) => {
    const token = await AsyncStorage.getItem("AccessToken");
    const newStatus = currentStatus === 'able' ? 'disable' : 'able';
      if (!token) return;
        deviceApi.changeStatus(token, id, newStatus)
          .then((response) => {
            setDevices((prevDevices) => {
              const updated = [...prevDevices];
              const device = updated[index];
          
              device.status = device.status === "able" ? "disable" : "able";
              return updated;
            });
          })
          .catch((error) => {
            if (error.response?.status === 401) {
              const errorMessage = error.response.data?.error;
              Alert.alert("Error", errorMessage, [{ text: "OK" }]);
              router.replace("/login");
            } else {
              console.error("Unexpected error:", error);
              return;
            }
          })   
  };
  
  const handleToggleDevice = async (index: number, id: number, currentState: string, type: string) => {
    const status = devices?.find((device) => device.deviceID === id)?.status;
    if (status === 'disable') return;
    
    const token = await AsyncStorage.getItem("AccessToken");
    const newStatus = currentState === "on" ? "off" : "on";
    
      if (!token) return;
        deviceApi.changeState(token, id, newStatus, type === "pump" ? type : "light")
          .then((response) => {            
            setDevices((prevDevices) => {
              const updatedDevices = [...prevDevices];
              const device = updatedDevices[index];
          
              device.adafruitState.state = device.adafruitState.state === "on" ? "off" : "on";
              return updatedDevices;
            });
          })
          .catch((error) => {
            if (error.response?.status === 401) {
              const errorMessage = error.response.data?.error;
              Alert.alert("Error", errorMessage, [{ text: "OK" }]);
              router.replace("/login");
            } else {
              console.error("Unexpected error:", error);
              return;
            }
          })   
  };
  
  const toggleSensorStatus = async (sensorID: number, currentStatus: string) => {
    const token = await AsyncStorage.getItem("AccessToken");
    const newStatus = currentStatus === 'able' ? 'disable' : 'able';
      if (!token) return;
        sensorApi.changeStatus(token, sensorID, newStatus)
          .then((response) => {            
            setSensors((prevSensors) =>
              prevSensors.map(sensor =>
                sensor.sensorID === sensorID
                  ? { ...sensor, status: sensor.status === "able" ? "disable" : "able" }
                  : sensor
              )
            );
          })
          .catch((error) => {
            if (error.response?.status === 401) {
              const errorMessage = error.response.data?.error;
              Alert.alert("Error", errorMessage, [{ text: "OK" }]);
              router.replace("/login");
            } else {
              console.error("Unexpected error:", error);
              return;
            }
          })   
  };

  const handleAlertThresholdChange = (newValue: string, sensorID: number) => {
    const status = sensors.find((sensor) => sensor.sensorID === sensorID)?.status;
    if (status === 'disable') return;
    // Chỉ cho phép một dấu chấm duy nhất
    if (newValue.includes('.') && newValue.split('.').length > 2) {
      return; // Nếu có nhiều hơn 1 dấu chấm, không thay đổi gì
    }
  
    // Kiểm tra nếu giá trị nhập vào là hợp lệ (chỉ cho phép số và một dấu chấm duy nhất)
    const isValidValue = /^[0-9]*\.?[0-9]*$/.test(newValue); // Regex kiểm tra số hợp lệ
  
    if (!isValidValue) {
      return; // Nếu giá trị không hợp lệ, không thay đổi
    }
  
    setInputValues((prevValues) => ({
      ...prevValues,
      [sensorID]: newValue, // Cập nhật giá trị của sensor tương ứng
    }));
  };
  
  const handleBlurAlertThreshold = (sensorID: number) => {
    const status = sensors.find((sensor) => sensor.sensorID === sensorID)?.status;
    if (status === 'disable') return;
    const newInputValue = inputValues[sensorID];
    const originalThreshold = sensors.find((sensor) => sensor.sensorID === sensorID)?.alertThreshold;
    
    if (newInputValue !== originalThreshold) {
      Alert.alert(
        "Xác nhận thay đổi",
        "Bạn có chắc chắn muốn thay đổi ngưỡng cảnh báo?",
        [
          {
            text: "Hủy",
            onPress: () => {
              // Khôi phục giá trị ban đầu
              setInputValues((prevValues) => ({
                ...prevValues,
                [sensorID]: String(originalThreshold),
              }));
            },
            style: "cancel",
          },
          {
            text: "Đồng ý",
            onPress: () => {
              hanldSubmitAlertThreshold(sensorID, newInputValue, originalThreshold)
            },
          },
        ]
      );
    }
  };

  const hanldSubmitAlertThreshold = async (sensorID: number, newInputValue: string, originalThreshold: any) => {
    const token = await AsyncStorage.getItem("AccessToken");
      if (!token) return;
        sensorApi.updateAlertThreshold(token, sensorID, parseFloat(newInputValue))
          .then((response) => {         
            setSensors((prevSensors) =>
              prevSensors.map((sensor) =>
                sensor.sensorID === sensorID
                  ? { ...sensor, alertThreshold: newInputValue }
                  : sensor
              )
            );
          })
          .catch((error) => {
            setInputValues((prevValues) => ({
              ...prevValues,
              [sensorID]: String(originalThreshold),
            }));
            if (error.response?.status === 401) {
              const errorMessage = error.response.data?.error;
              Alert.alert("Error", errorMessage, [{ text: "OK" }]);
              router.replace("/login");
            } else {
              console.error("Unexpected error:", error);
              return;
            }
          })
  }
  
  const handleTimeChange = (index: number, newTime: string) => {
    const updatedTimes = [...wateringTimes];
    updatedTimes[index] = newTime;
    setWateringTimes(updatedTimes);
  };
  
  const addTime = () => {
    setWateringTimes([...wateringTimes, ""]);    
  };
  
  const removeTime = (index: number) => {
    const pumpDevice = devices.find((d) => d.type === "pump");
    if (pumpDevice?.status === 'disable') return;

    const updatedTimes = wateringTimes.filter((_, i) => i !== index);
    setWateringTimes(updatedTimes);
    setTimeout(() => handleSubmitSchedule(), 0);
  };

  const handleBlurSchedule = () => {
    const hasChanged = JSON.stringify(wateringTimes) !== JSON.stringify(originalSchedule);
    if (!hasChanged) return;

    Alert.alert(
      "Xác nhận thay đổi",
      "Bạn có muốn cập nhật lịch tưới mới không?",
      [
        {
          text: "Hủy",
          style: "cancel",
          onPress: () => setWateringTimes(originalSchedule),
        },
        {
          text: "Đồng ý",
          onPress: handleSubmitSchedule,
        },
      ]
    );
  };

  const handleSubmitSchedule = async () => {
    const token = await AsyncStorage.getItem("AccessToken");
    const pumpDevice = devices.find((d) => d.type === "pump");
    const newSchedule = wateringTimes.join(",");

    if (!token || !pumpDevice) return;
    else if (pumpDevice.status === "disable") {
      Alert.alert('Error', "Vui lòng kích hoạt thiết bị", [{text: "Ok"}]);
      setWateringTimes(originalSchedule);
      return;
    }

    deviceApi.updateSchedule(token, pumpDevice.deviceID, newSchedule)
      .then((response) => {
        setOriginalSchedule([...wateringTimes]);
      })
      .catch((error) => {
        setWateringTimes(originalSchedule);
        if (error.response?.status === 401) {
          const errorMessage = error.response.data?.error;
          Alert.alert("Error", errorMessage, [{ text: "OK" }]);
          router.replace("/login");
        } else {
          console.error("Unexpected error:", error);
          return;
        }
      })
  };

  return (
    <ScrollView 
      style={{ backgroundColor: "#FFFFFF" }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <PaperProvider>
        <View style={styles.container}>
          {/* Header */}
          <CustomTextBold style={styles.headerText}>
            Danh sách thiết bị của bạn
          </CustomTextBold>

          {devices?.map((d, index) => {
            const { color, title } = getDeviceStyle(d.type);
            
            return (
              <View key={d.deviceID} 
                style={[
                  styles.card,
                  {
                    backgroundColor: d.status === "disable" ? "#d3d3d3" : color, // màu xám nếu bị vô hiệu
                  },
                ]}
              >
                <View style={styles.cardHeader}>
                  <CustomTextBold style={styles.title}>{title} - {d.deviceName}</CustomTextBold>
                  <Menu
                    visible={menuVisibleIndex === index}
                    onDismiss={() => setMenuVisibleIndex(null)}
                    anchor={
                      <TouchableOpacity
                        style={styles.menuTouchable}
                        onPress={() => {
                          setMenuVisibleIndex((prevIndex) =>
                            prevIndex === index ? null : index
                          );
                        }}
                      >
                        <Text style={styles.menuIcon}>⋮</Text>
                      </TouchableOpacity>
                    }
                  >
                    <Menu.Item
                      onPress={() => {
                        handleToggleStatus(index, d.deviceID, d.status);
                        setMenuVisible(false);
                      }}
                      title={d.status === "able" ? "Vô hiệu hóa" : "Kích hoạt"}
                    />
                  </Menu>
                </View>

                <View style={styles.content}>
                  {/* Trái: Chế độ tưới (chỉ pump mới có) */}
                  {d.type === "pump" && (
                  <View style={styles.leftSection}>
                    <Text style={styles.label}>Chế độ tưới</Text>
                    <View style={styles.pickerContainer}>
                      <Picker
                        selectedValue={d.adafruitState.autoLevel ? "auto" : "manual"}
                        onValueChange={(itemValue) => {
                          setMode(itemValue);
                          d.adafruitState.autoLevel = itemValue === "auto";
                        }}
                        style={styles.picker}
                        mode="dropdown"
                      >
                        <Picker.Item label="Thủ công" value="manual" />
                        <Picker.Item label="Tự động" value="auto" />
                      </Picker>
                    </View>

                    {d.adafruitState.autoLevel && (
                      <View style={styles.autoSection}>
                        <Text style={styles.label}>Chọn thời gian tưới</Text>
                        {wateringTimes?.map((time, index) => (
                          <View key={index} style={styles.timeRow}>
                              <TextInput
                                value={time}
                                placeholder="HH:MM"
                                style={styles.timeInput}
                                onPress={() => setVisiblePickerIndex(index)}
                                onBlur={handleBlurSchedule}
                              />
                            <TouchableOpacity onPress={() => removeTime(index)} style={styles.removeBtn}>
                              <Text style={styles.removeBtnText}>✕</Text>
                            </TouchableOpacity>

                            {visiblePickerIndex === index && (
                              <DateTimePickerModal
                                isVisible={true}
                                mode="time"
                                is24Hour={true}
                                onConfirm={(date) => {
                                  const formattedTime = date.toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    hour12: false,
                                  });
                                  handleTimeChange(index, formattedTime);
                                  setVisiblePickerIndex(null);
                                }}
                                onCancel={() => setVisiblePickerIndex(null)}
                              />
                            )}
                          </View>
                        ))}
                        <TouchableOpacity onPress={addTime} style={styles.addBtn}>
                          <Text style={styles.addBtnText}>+ Thêm giờ</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                  )}

                  {d.type === "pump" && <View style={styles.separatorDevice} />}

                  {/* Phải: Công tắc on/off */}
                  <View style={styles.rightSection}>
                    <Switch
                      value={d.adafruitState.state === "on"}
                      onValueChange={() => handleToggleDevice(index, d.deviceID, d.adafruitState.state, d.type)}
                      trackColor={{ false: "#767577", true: "#7F3DFF" }}
                      thumbColor={d.adafruitState.state === "on" ? "#FFFFFF" : "#f4f3f4"}
                    />
                    <Text style={styles.statusText}>
                      {d.adafruitState.state.toUpperCase()}
                    </Text>
                  </View>
                </View>
                {d.type === "pump" &&
                  <Text style={styles.footerText}>
                    {d.adafruitState.autoLevel ? "Đã được bật tự động" : "Đang ở chế độ thủ công"}
                  </Text>
                }
              </View>
            );
          })}

          {/** Sensor Cards */}
          {sensors?.map((item, index) => {
            const sensorStyle = getSensorStyle(item.sensorName);

            return (
              <View key={item.sensorID} 
                style={[styles.card,
                  { 
                    backgroundColor: item.status === "disable" ? "#d3d3d3" : sensorStyle.color 
                  }]}
              >
              <View style={styles.cardHeader}>
                <CustomTextBold style={styles.title}>
                  {sensorStyle.title}
                </CustomTextBold>
              </View>
            
              <View style={styles.content}>
                <View style={styles.leftSectionSensor}>
                  <Text style={[styles.label, {height: 40}]}>
                    Tình trạng:{" "}
                    <Text style={styles.statusText}>
                      {item.status === "able" ? "Cho phép" : "Không cho phép"}
                    </Text>
                  </Text>
                  <Switch
                    value={item.status === "able"}
                    onValueChange={() => toggleSensorStatus(item.sensorID, item.status)}
                    trackColor={{ false: "#767577", true: "#000" }}
                    thumbColor={item.status === "able" ? "#FFF" : "#f4f3f4"}
                    style={{ width: 50, height: 30 }} 
                  />
                </View>
            
                <View style={styles.separatorSensor} />
            
                <View style={styles.rightSection}>
                  <Text style={styles.label}>
                    Ngưỡng cảnh báo ({sensorStyle.value})
                  </Text>
                  <TextInput
                    style={styles.sensorValue}
                    value={inputValues[item.sensorID] || String(item.alertThreshold)}// Chuyển giá trị thành string nếu cần
                    onChangeText={(newValue) => handleAlertThresholdChange(newValue, item.sensorID)}
                    keyboardType="numeric"
                    onBlur={() => handleBlurAlertThreshold(item.sensorID)}
                  />
                </View> 
              </View>
            </View>            
          )})}


        </View>
      </PaperProvider>
    </ScrollView>
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
  },
  menuTouchable: {
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
