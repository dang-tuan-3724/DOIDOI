import React, { useState, useEffect } from "react";
import { View, Text, Switch, StyleSheet, ScrollView, Alert, TouchableOpacity, TextInput, ActivityIndicator, RefreshControl  } from "react-native";
import { Picker } from "@react-native-picker/picker";
import CustomText from "@/components/CustomText";
import CustomTextMedium from "@/components/CustomTextMedium";
import CustomTextBold from "@/components/CustomTextBold";
import deviceApi from "@/api/device";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Menu, MenuOptions, MenuOption, MenuTrigger,  } from 'react-native-popup-menu';

type DeviceType = {
  deviceID: number;
  deviceName: string;
  quantity: number;
  status: string;
  type: 'led_light' | 'pump'; 
  state: string;
  schedule: string | null;
};

const DeviceCard = ({item, color, styles, title, handleDelete}: {
    item: DeviceType;
    color: string;
    styles: any;
    title: string;
    handleDelete: Function;
}) => {
    const router = useRouter();
    const [device, setDevice] = useState<DeviceType>(item);
    const [wateringTimes, setWateringTimes] = useState(
        device.schedule ? device.schedule.split(",") : []
      );
    const [visiblePickerIndex, setVisiblePickerIndex] = useState<number | null>(null);
    const [originalSchedule, setOriginalSchedule] = useState(
        device.schedule ? device.schedule.split(",") : []
      );
    
    const handleToggleStatus = async () => {        
        const token = await AsyncStorage.getItem("AccessToken");        
        const newStatus = device.status === 'able' ? 'disable' : 'able';
        if (!token) return;
        deviceApi.changeStatus(token, device.deviceID, newStatus)
            .then((response) => {
                setDevice((prev) => ({ ...prev, status: newStatus }));
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
      
    const handleToggleDevice = async () => {
        if (device.status === 'disable') return;
        if (device.state === "auto") return;
        const token = await AsyncStorage.getItem("AccessToken");
        const newState = device.state === "on" ? "off" : "on";
        
        if (!token) return;
        deviceApi.changeState(token, device.deviceID, newState, device.type === "pump" ? "pump" : "light")
            .then((response) => {            
                setDevice((prev) => ({ ...prev, state: newState }));
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
      
    const handleTimeChange = (index: number, newTime: string) => {
        const updatedTimes = [...wateringTimes];
        updatedTimes[index] = newTime;
        setWateringTimes(updatedTimes);
    };
      
    const addTime = () => {
        setWateringTimes([...wateringTimes, ""]);    
    };
    
    const removeTime = (index: number) => {
        if (device.status === 'disable') return;
        
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
        const newSchedule = wateringTimes.join(",");

        if (!token) return;
        else if (device.status === "disable") {
            Alert.alert('Error', "Vui lòng kích hoạt thiết bị", [{text: "Ok"}]);
            setWateringTimes(originalSchedule);
            return;
        }

        deviceApi.updateSchedule(token, device.deviceID, newSchedule)
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

    const handleDeleteDevice = async () => {
        const token = await AsyncStorage.getItem("AccessToken");
        
        if (!token) return;
        Alert.alert(
            "Xác nhận thay đổi",
            "Bạn có chắc chắn muốn xóa thiết bị?",
            [
                {
                text: "Hủy",
                style: "cancel",
                },
                {
                text: "Đồng ý",
                onPress: () => {
                    deviceApi.deleteDevice(token, device.deviceID)
                        .then((respone) => {
                            handleDelete(device.deviceID);
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

    const handlWateringState = async (value: string) => {
        if (device.status === "disable") return;
        const token = await AsyncStorage.getItem("AccessToken");
        if (!token) return;
        deviceApi.changePumpAutoLevel(token, device.deviceID, value)
            .then((response) => {
                console.log(response);
                
                setDevice((prev) => ({ ...prev, state: value === "auto" ? value : "off" }));
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
    }

    return (
        <View
            style={[
            styles.card,
            {
                backgroundColor: device.status === "disable" ? "#d3d3d3" : color, // màu xám nếu bị vô hiệu
            },
            ]}
        >
            <View style={styles.cardHeader}>
                <CustomTextBold style={styles.title}>{title} - {device.deviceName}</CustomTextBold>
                <Menu>
                    <MenuTrigger>
                        <Text style={styles.menuIcon}>⋮</Text>
                    </MenuTrigger>

                    <MenuOptions>
                        <MenuOption onSelect={() => handleToggleStatus()}>
                            <Text style={{ padding: 10 }}>
                                {device.status === "able" ? "Vô hiệu hóa" : "Kích hoạt"}
                            </Text>
                        </MenuOption>
                        <MenuOption onSelect={() => handleDeleteDevice()}>
                            <Text style={{ padding: 10 }}>
                                Delete
                            </Text>
                        </MenuOption>
                    </MenuOptions>
                </Menu>
            </View>

            <View style={styles.content}>
            {/* Trái: Chế độ tưới (chỉ pump mới có) */}
            {device.type === "pump" && (
            <View style={styles.leftSection}>
                <Text style={styles.label}>Chế độ tưới</Text>
                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={device.state === "auto" ? "auto" : "manual"}
                        onValueChange={(deviceValue) => handlWateringState(deviceValue)}
                        style={styles.picker}
                        mode="dropdown"
                        enabled={device.status !== "disable"}
                    >
                        <Picker.Item label="Thủ công" value="manual" />
                        <Picker.Item label="Tự động" value="auto" />
                    </Picker>
                </View>

                {device.state ==="auto" && (
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

            {device.type === "pump" && <View style={styles.separatorDevice} />}

            {/* Phải: Công tắc on/off */}
            <View style={styles.rightSection}>
                <Switch
                value={device.state === "on"}
                onValueChange={() => handleToggleDevice()}
                trackColor={{ false: "#767577", true: "#7F3DFF" }}
                thumbColor={device.state === "on" ? "#FFFFFF" : "#f4f3f4"}
                />
                <Text style={styles.statusText}>
                {device.state.toUpperCase()}
                </Text>
            </View>
            </View>
            {device.type === "pump" &&
            <Text style={styles.footerText}>
                {device.state ==="auto" ? "Đã được bật tự động" : "Đang ở chế độ thủ công"}
            </Text>
            }
        </View>
    );
}

export default DeviceCard;