import { View, Text, TextInput, TouchableOpacity, Image, Alert } from "react-native";
import React, { useState, useEffect } from "react";
import CustomText from "@/components/CustomText";
import { useRouter } from "expo-router";
import CustomTextMedium from "@/components/CustomTextMedium";
import CustomTextBold from "@/components/CustomTextBold";
import { Modal } from "@/components/Modal";
import authService from "@/api/authUser";
import AsyncStorage from "@react-native-async-storage/async-storage";

const login = () => {
  const router = useRouter();
  const [showSignUp, setShowSignUp] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [input, setInput] = useState("");
  const [userName, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");

  const handleLogin = async () => {
    authService
      .login(userName, password)
      .then(async (response) => {
        await AsyncStorage.setItem("AccessToken", response.token);
        await AsyncStorage.setItem("userInfo", JSON.stringify(response.username));
        await AsyncStorage.setItem("userID", response.userID.toString());
        
        setInput(response?.msg);
        setUsername("");
        setPassword("");
        setModalVisible(true);

        setTimeout(() => {
          setModalVisible(false);
          setShowSignUp(false);
          router.replace("/(tabs)");
        }, 2000); 
      })
      .catch((error) => {
        if (error.response?.status === 400) {
          const errorMessage = error.response.data?.error;
          Alert.alert("Error", errorMessage, [{ text: "OK" }]);
          return;
        } else {
          console.error("Unexpected error:", error);
        }
      });
  };

  const logAsyncStorageData = async () => {
    try {
      const accessToken = await AsyncStorage.getItem("AccessToken");
      const userInfo = await AsyncStorage.getItem("userInfo");
      const userID = await AsyncStorage.getItem("userID");

      console.log("AccessToken:", accessToken);
      console.log("userInfo:", userInfo);
      console.log("userID:", userID);
    } catch (error) {
      console.error("Error retrieving data from AsyncStorage:", error);
    }
  };
  useEffect(() => {
    logAsyncStorageData();
  }, []);
  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      Alert.alert("Wrong password", "Password must be matched!", [{ text: "OK" }]);
      return;
    }
    
    authService
      .signUp(userName, password)
      .then((response) => {
        setUsername(response.username);
        setInput(response?.msg);
        setPassword("");
        setconfirmPassword("");
        setModalVisible(true);
        setTimeout(() => {
          setModalVisible(false);
          setShowSignUp(false);
        }, 2000);
      })
      .catch((error) => {         
        if (error.response?.status === 400) {
          const errorMessage = error.response.data?.error;
          Alert.alert("Error", errorMessage, [{ text: "OK" }]);
          return;
        } else {
          console.error("Unexpected error:", error);
        }
      });
  };

  return (
    <View className="flex-1 justify-center items-center gap-2">
      <Image
        style={{ width: 350, height: 150 }}
        source={require("@/assets/images/logo_zoizoi.png")}
      />
      <CustomTextBold style={{ fontSize: 40 }}>Đăng nhập</CustomTextBold>
      <TextInput
        placeholder="Tên đăng nhập / Số điện thoại"
        placeholderTextColor="#888888"
        style={{
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
        }}
        onChangeText={(text) => setUsername(text)}
        value={userName}
      />
      <TextInput
        placeholder="Mật khẩu"
        placeholderTextColor="#888888"
        style={{
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
        }}
        onChangeText={(text) => setPassword(text)}
        value={password}
        secureTextEntry={true}
      />
      {showSignUp ? (
        <TextInput
          placeholder="Nhập lại Mật khẩu"
          placeholderTextColor="#888888"
          style={{
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
          }}
          onChangeText={(text) => setconfirmPassword(text)}
          value={confirmPassword}
          secureTextEntry={true}
        />
      ) : null}
      <TouchableOpacity
        className="ml-auto flex-row items-center p-3 gap-2 mt-5 "
        style={{
          borderWidth: 2,
          paddingVertical: 10,
          borderRadius: 50,
          marginHorizontal: 20,
          alignItems: "center",
          borderColor: "#0400FF",
        }}
        onPress={() => {
          if (showSignUp) {
            handleSignUp();
          } else {
            handleLogin();
          }
        }}        
      >
        {showSignUp ? (
          <CustomTextBold style={{ color: "black", fontSize: 16 }}>
            Đăng kí
          </CustomTextBold>
        ) : (
          <CustomTextBold style={{ color: "black", fontSize: 16 }}>
            Đăng nhập
          </CustomTextBold>
        )}
        <Image
          source={require("@/assets/icons/arrow_icon.png")}
          className="w-10 h-10"
        />
      </TouchableOpacity>
      {showSignUp ? (
        <Modal isOpen={modalVisible} withInput={false}>
          <View className="bg-[#FFFFFF] w-full p-4 gap-4 rounded-[30px] shadow-[0_0_10px_10px_rgba(124,245,255,0.25)] ml-5 mr-5 items-center justify-center border-solid border-[1px] border-[#448AFD] ">
            <Image source={require("@/assets/icons/success_icon.png")} />
            <CustomTextBold>{input}</CustomTextBold>
            <CustomTextMedium style={{ textAlign: "center" }}>
              Bạn có thể kiểm tra và hiệu chỉnh thông tin trong phần hồ sơ
            </CustomTextMedium>
          </View>
        </Modal>
      ) : (
        <Modal isOpen={modalVisible} withInput={false}>
          <View className="bg-[#FFFFFF] w-full p-4 gap-4 rounded-[30px] shadow-[0_0_10px_10px_rgba(124,245,255,0.25)] ml-5 mr-5 items-center justify-center border-solid border-[1px] border-[#448AFD] ">
            <Image source={require("@/assets/icons/success_icon.png")} />
            <CustomTextBold>Đăng nhập thành công</CustomTextBold>
            <CustomTextMedium className="text-center">
              Bạn có thể kiểm tra và hiệu chỉnh thông tin trong phần hồ sơ
            </CustomTextMedium>
          </View>
        </Modal>
      )}
      {!showSignUp ? (
        <CustomText onPress={() => setShowSignUp(true)} className="m-5">
          Bạn chưa có tài khoản ? <CustomTextBold> Đăng kí ngay</CustomTextBold>
        </CustomText>
      ) : (
        <CustomText onPress={() => setShowSignUp(false)} className="m-5">
          Bạn đã có tài khoản ? <CustomTextBold> Đăng nhập ngay</CustomTextBold>
        </CustomText>
      )}
      <CustomText
        style={{
          marginLeft: 16,
          marginRight: 16,
          fontSize: 12,
          color: "#888888",
        }}
      >
        Bằng việc <CustomTextBold> Đăng nhập</CustomTextBold> hoặc{" "}
        <CustomTextBold> Đăng kí</CustomTextBold>, tôi đồng ý với{" "}
        <CustomTextBold style={{ textDecorationLine: "underline" }}>
          Điều khoản sử dụng
        </CustomTextBold>{" "}
        và{" "}
        <CustomTextBold style={{ textDecorationLine: "underline" }}>
          chính sách quyền riêng tư
        </CustomTextBold>{" "}
        của trang web.
      </CustomText>
    </View>
  );
};

export default login;
