import {
  View,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
  DevSettings,
  StyleSheet,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Alert } from "react-native";
import { useRouter } from "expo-router";
import CustomTextBold from "@/components/CustomTextBold";
import CustomTextMedium from "@/components/CustomTextMedium";
import { Modal } from "@/components/Modal";
import CustomText from "@/components/CustomText";
import authService from "@/api/authUser";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { isValidEmail, isValidPhone } from "@/helper/validation"

const profile = () => {
  const router = useRouter();
  const [isEdit, setIsEdit] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [isSave, setIsSave] = useState(false);
  const [originalUserInfor, setOriginalUserInfor] = useState<{
    username: string;
    password: string;
    email: string;
    fullName: string;
    phoneNum: string;
  } | null>(null);
  const [userInfor, setUserInfor] = useState({
    username: "",
    password: "",
    email: "",
    fullName: "",
    phoneNum: ""
  });

  useEffect(() => {
    const getInfo = async () => {

      logAsyncStorageData();
      let token = await AsyncStorage.getItem("AccessToken");
      if (token) {
        authService
        .getUserInfo(token)
        .then((response) => {          
          const fullName = `${response.user.firstName ?? ""} ${response.user.lastName ?? ""}`.trim();
          
          const userData = {
            username: response.user.userName,
            password: response.user.password,
            email: response.user.email,
            phoneNum: response.user.phoneNum,
            fullName,
          };
  
          setUserInfor(userData);
          setOriginalUserInfor(userData);
        })
        .catch ((error) => {
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
    };
    getInfo();

  }, []);

  const handleSave = async () => {
    let token = await AsyncStorage.getItem("AccessToken");
    
    if (!isValidEmail(userInfor.email)) {
      Alert.alert("Error", "Email không hợp lệ!");
      return;
    }
  
    if (!isValidPhone(userInfor.phoneNum)) {
      Alert.alert("Error", "Số điện thoại phải có đúng 10 số!");
      return;
    }

    if (!token) return;
    const parts = userInfor.fullName.trim().split(/\s+/);
    const firstName = parts.shift() || ""; 
    const lastName = parts.join(" ");

    authService
    .updateUserInfo(token, firstName, lastName, userInfor.phoneNum, userInfor.email )
    .then((response) => {      
      setIsSave(true);
      setModalVisible(true);
      setIsEdit(false);

      // Đóng modal sau 2 giây
      setTimeout(() => {
        setModalVisible(false);
        setIsSave(false);
      }, 2000);
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
    });
  };

  const handleCancel = () => {
    if (originalUserInfor) {
      setUserInfor(originalUserInfor);
    }
    setIsEdit(false);
  };
  const logAsyncStorageData = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const items = await AsyncStorage.multiGet(keys);
      console.log('AsyncStorage Data:');
      items.forEach(([key, value]) => {
        console.log(`${key}: ${value}`);
      });
    } catch (error) {
      console.error('Error getting AsyncStorage data:', error);
    }
  };

  const handleLogOut = async () => {
    await AsyncStorage.removeItem("AccessToken");
    await AsyncStorage.removeItem("userID");
    await AsyncStorage.removeItem("userInfor");

    setModalVisible(true);
    
    setTimeout(() => {
      setModalVisible(false);
      router.replace("/login");
    }, 2000);
    return
  };

  return (
    <ScrollView style={styles.scrollContainer}>
      <View className="flex-1 mt-20 items-center gap-1">
        {/* <ScrollView contentContainerStyle={{ paddingBottom: 80 }}> */}
        <Image
          style={styles.profileImage}
          source={require("@/assets/images/profile_img.png")}
        />
        <CustomTextBold style={styles.userName}>
          {userInfor?.fullName ? userInfor?.fullName : userInfor?.username} Fammer
        </CustomTextBold>
        <CustomTextMedium style={styles.sectionTitle}>
          Thông tin cá nhân
        </CustomTextMedium>
        <TextInput
          placeholder="Họ và tên"
          placeholderTextColor="black"
          style={[
            styles.input,
            isEdit ? styles.leftText : styles.centerText, 
          ]}
          value={userInfor?.fullName || (isEdit ? "" : undefined)}
          onChangeText={(text) => {
            setUserInfor((prevState) => ({
              ...prevState,
              fullName: text, 
            }));
          }}
          editable={isEdit}
        />
        <TextInput
          placeholder="Số điện thoại"
          placeholderTextColor="black"
          style={[
            styles.input,
            isEdit ? styles.leftText : styles.centerText,
          ]}
          value={userInfor?.phoneNum || (isEdit ? "" : undefined)}
          onChangeText={(text) => {
            const onlyNumbers = text.replace(/[^0-9]/g, "");
            setUserInfor((prevState) => ({
              ...prevState,
              phoneNum: onlyNumbers || "",
            }));
          }}
          editable={isEdit}
          keyboardType="phone-pad"
          maxLength={10}    
        />

        <TextInput
          placeholder="Email"
          placeholderTextColor="black"
          style={[
            styles.input,
            isEdit ? styles.leftText : styles.centerText, // Căn trái khi chỉnh sửa
          ]}
          value={userInfor?.email || (isEdit ? "" : undefined)}
          onChangeText={(text) => {
            setUserInfor((prevState) => ({
              ...prevState,
              email: text || "",
            }));
          }}
          editable={isEdit}
        />
        {/* {isEdit ? (
          <View className="w-full items-center">
            <CustomTextMedium style={styles.sectionTitle}>
              Mật khẩu
            </CustomTextMedium>
            <TextInput
              placeholder="Mật khẩu cũ"
              placeholderTextColor="#888888"
              style={styles.input}
            />
            <TextInput
              placeholder="Mật khẩu mới"
              placeholderTextColor="#888888"
              style={styles.input}
            />
            <TextInput
              placeholder="Xác nhận mật khẩu mới"
              placeholderTextColor="#888888"
              style={styles.input}
            />
          </View>
        ) : null} */}
        {!isEdit ? (
          <View className="flex-row items-center p-3 gap-2 mt-4 ">
            <TouchableOpacity
              className="flex-row items-center p-3 gap-2 mt-4"
              style={styles.button}
              onPress={() => {
                setIsEdit(true);
              }}
            >
              <CustomTextBold style={styles.buttonText}>
                Chỉnh sửa
              </CustomTextBold>

              <Image
                source={require("@/assets/icons/arrow_icon.png")}
                className="w-10 h-10"
              />
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-row items-center p-3 gap-2 mt-4"
              style={styles.button}
              onPress={() => handleLogOut()}
            >
              <CustomTextBold style={styles.buttonText}>
                Đăng xuất
              </CustomTextBold>

              <Image
                source={require("@/assets/icons/arrow_icon.png")}
                className="w-10 h-10"
              />
            </TouchableOpacity>
          </View>
        ) : (
          <View className="flex-row items-center p-3 gap-2 mt-2">
            <TouchableOpacity
              className="flex-row items-center p-3 gap-2 mt-2"
              style={styles.button}
              onPress={() => {
                handleCancel();
              }}
            >
              <CustomTextBold style={styles.buttonText}>
                Hủy
              </CustomTextBold>

              <Image
                source={require("@/assets/icons/arrow_icon.png")}
                className="w-10 h-10"
              />
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-row items-center p-3 gap-2 mt-2"
              style={styles.button}
              onPress={() => handleSave()}
            >
              <CustomTextBold style={styles.buttonText}>
                Lưu
              </CustomTextBold>

              <Image
                source={require("@/assets/icons/arrow_icon.png")}
                className="w-10 h-10"
              />
            </TouchableOpacity>
          </View>
        )}
        <Modal isOpen={modalVisible} withInput={false}>
          <View style={styles.modalContainer}>
            <Image source={require("@/assets/icons/success_icon.png")} />
            {isSave ? (
              <>
                <CustomTextBold>Đã lưu thông tin</CustomTextBold>
                <CustomTextMedium>
                  Hãy kiểm trang ở trang thông tin
                </CustomTextMedium>
              </>
            ) : (
              <>
                <CustomTextBold>Đã đăng xuất</CustomTextBold>
                <CustomTextMedium>Hãy đăng nhập lại để tiếp tục</CustomTextMedium>
              </>
            )}
          </View>
        </Modal>
        {/* </ScrollView> */}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    marginBottom: 90, 
  },
  profileImage: {
    width: 150,
    height: 150,
    borderWidth: 3,
    borderColor: "blue",
    borderRadius: 100,
  },
  userName: {
    fontSize: 20,
    textAlign: "center",
  },
  sectionTitle: {
    alignSelf: "flex-start",
    textAlign: "left",
    marginLeft: 20,
  },
  input: {
    borderRadius: 15,
    backgroundColor: "#7CF5FF",
    borderWidth: 0,
    padding: 10,
    marginTop: 20,
    marginHorizontal: 0,
    height: 60,
    width: "90%",
    fontFamily: "Quicksand-Medium",
    color: "black",
  },
  centerText: {
    textAlign: "center", 
  },
  leftText: {
    textAlign: "left", 
  },
  button: {
    borderWidth: 2,
    paddingVertical: 10,
    borderRadius: 50,
    marginHorizontal: 20,
    alignItems: "center",
    borderColor: "#0400FF",
  },
  buttonText: {
    color: "black",
    fontSize: 16,
  },
  modalContainer: {
    backgroundColor: "#FFFFFF",
    width: "100%",
    padding: 16,
    gap: 16,
    borderRadius: 30,
    shadowColor: "rgba(124,245,255,0.25)",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
    marginLeft: 20,
    marginRight: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#448AFD",
  }
});

export default profile;