import React, { useState } from "react";
import { View, Text, Switch, Alert, TextInput } from "react-native";
import CustomText from "@/components/CustomText";
import CustomTextMedium from "@/components/CustomTextMedium";
import CustomTextBold from "@/components/CustomTextBold";
import sensorApi from "@/api/sensor";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
  
type SensorState = {
    sensorID: number;
    sensorName: string;
    userID: number;
    quantity: number;
    status: 'able' | 'disable';
    type: 'Temperature & Humidity Sensor' | string;
    alertThreshold: number | string;
  };

const SensorCard = ({ item, sensorStyle, styles, handleDelete }: { 
    item: SensorState; 
    sensorStyle: any; 
    styles: any;
    handleDelete: Function;
}) => {
    const router = useRouter();
    const [inputValues, setInputValues] = useState<string>(String(item.alertThreshold));
    const [sensor, setSensor] = useState<SensorState>(item);

    const toggleSensorStatus = async (sensorID: number, currentStatus: string) => {        
        const token = await AsyncStorage.getItem("AccessToken");
        const newStatus = currentStatus === 'able' ? 'disable' : 'able';
        if (!token) return;
        sensorApi.changeStatus(token, sensorID, newStatus)
            .then((response) => {            
                setSensor((prev) => ({ ...prev, status: newStatus }));
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

    const handleAlertThresholdChange = (newValue: string) => {        
        if (sensor.status === 'disable') return;
        // Chỉ cho phép một dấu chấm duy nhất

        if (newValue === "") {
            setInputValues(newValue); // Xóa hết giá trị
            return;
        }

        if (newValue.includes('.') && newValue.split('.').length > 2) {
            return; // Nếu có nhiều hơn 1 dấu chấm, không thay đổi gì
        }
        
        // Kiểm tra nếu giá trị nhập vào là hợp lệ (chỉ cho phép số và một dấu chấm duy nhất)
        const isValidValue = /^[0-9]*\.?[0-9]*$/.test(newValue); // Regex kiểm tra số hợp lệ
        
        if (!isValidValue) {
            return; // Nếu giá trị không hợp lệ, không thay đổi
        }
        
        setInputValues(newValue);
    };
      
    const handleBlurAlertThreshold = (sensorID: number) => {
        if (sensor.status === 'disable') return;
        const originalThreshold = sensor.alertThreshold;

        if (inputValues === "") {
            setInputValues(String(originalThreshold))
            return;
        }

        if (inputValues !== originalThreshold) {
            Alert.alert(
            "Xác nhận thay đổi",
            "Bạn có chắc chắn muốn thay đổi ngưỡng cảnh báo?",
            [
                {
                text: "Hủy",
                onPress: () => {
                    // Khôi phục giá trị ban đầu
                    setInputValues(String(originalThreshold));
                },
                style: "cancel",
                },
                {
                text: "Đồng ý",
                onPress: () => {
                    hanldSubmitAlertThreshold(sensorID, inputValues, originalThreshold)
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
                    setSensor((prev) => ({ ...prev, alertThreshold: newInputValue }));
                    
                    const updateFlagStorage = async () => {
                        const flagDataStr = await AsyncStorage.getItem("ListAlert");
                        let flagData = flagDataStr ? JSON.parse(flagDataStr) : [];
    
                        const updatedFlagData = flagData.map((item: any) =>
                        item.id === sensorID ? { ...item, alert: parseFloat(newInputValue) } : item
                        );
    
                        await AsyncStorage.setItem("ListAlert", JSON.stringify(updatedFlagData));
                    }

                    updateFlagStorage();
                })
                .catch((error) => {
                    setInputValues(String(originalThreshold));
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

    const handleDeleteCard = async (sensorID: number) => {
        const token = await AsyncStorage.getItem("AccessToken");
        
        if (!token) return;
        Alert.alert(
            "Xác nhận thay đổi",
            "Bạn có chắc chắn muốn xóa cảm biến?",
            [
                {
                text: "Hủy",
                style: "cancel",
                },
                {
                text: "Đồng ý",
                onPress: () => {
                    sensorApi.deleteSensor(token, sensorID)
                        .then((respone) => {
                            handleDelete(sensorID);
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
                },
                },
            ]
            );
    }

    return (
        <View
            style={[styles.card,
                { 
                backgroundColor: sensor.status === "disable" ? "#d3d3d3" : sensorStyle.color 
                }]}
            >

            <View style={styles.cardHeader}>
                <CustomTextBold style={styles.title}>
                    {sensorStyle.title}
                </CustomTextBold>
                <Menu>
                    <MenuTrigger>
                        <Text style={styles.menuIcon}>⋮</Text>
                    </MenuTrigger>

                    <MenuOptions>
                        <MenuOption onSelect={() => handleDeleteCard(sensor.sensorID)}>
                        <Text style={{ padding: 10 }}>
                            Delete
                        </Text>
                        </MenuOption>
                    </MenuOptions>
                </Menu>
            </View>
        
            <View style={styles.content}>
            <View style={styles.leftSectionSensor}>
                <Text style={[styles.label, {height: 40}]}>
                Tình trạng:{" "}
                <Text style={styles.statusText}>
                    {sensor.status === "able" ? "Cho phép" : "Không cho phép"}
                </Text>
                </Text>
                <Switch
                value={sensor.status === "able"}
                onValueChange={() => toggleSensorStatus(sensor.sensorID, sensor.status)}
                trackColor={{ false: "#767577", true: "#000" }}
                thumbColor={sensor.status === "able" ? "#FFF" : "#f4f3f4"}
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
                value={inputValues}// Chuyển giá trị thành string nếu cần
                onChangeText={(newValue) => handleAlertThresholdChange(newValue)}
                keyboardType="numeric"
                onBlur={() => handleBlurAlertThreshold(sensor.sensorID)}
                />
            </View> 
            </View>
        </View> 
    );
}

export default SensorCard;