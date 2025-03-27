import {
  View,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import CustomTextBold from "@/components/CustomTextBold";
import CustomTextMedium from "@/components/CustomTextMedium";
import { Modal } from "@/components/Modal";
import AsyncStorage from "@react-native-async-storage/async-storage";

const profile = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const handlePress = () => {
    AsyncStorage.removeItem("userToken");
    setModalVisible(true);
    const timer = setTimeout(() => {
      setModalVisible(false);
    }, 2000);
    return () => clearTimeout(timer);
  };
  return (
    <View className="flex-1 mt-20 items-center gap-1">
      {/* <ScrollView contentContainerStyle={{ paddingBottom: 80 }}> */}
      <Image
        style={{
          width: 150,
          height: 150,
          borderWidth: 3,
          borderColor: "blue",
          borderRadius: 100,
        }}
        source={require("@/assets/images/profile_img.png")}
      />
      <CustomTextBold style={{ fontSize: 20, textAlign: "center" }}>
        Dang Tuan fammer
      </CustomTextBold>
      <CustomTextMedium
        style={{ alignSelf: "flex-start", textAlign: "left", marginLeft: 20 }}
      >
        Thông tin cá nhân
      </CustomTextMedium>
      <TextInput
        placeholder="Đặng Minh Tuấn"
        placeholderTextColor="black"
        style={{
          borderRadius: 15,
          backgroundColor: "#7CF5FF",
          padding: 10,
          marginTop: 5,
          marginHorizontal: 0,
          height: 60,
          width: "90%",
          fontFamily: "Quicksand-Medium",
          color: "black",
          textAlign: "center",
        }}
      />
      <TextInput
        placeholder="02/02/2004"
        placeholderTextColor="black"
        style={{
          borderRadius: 15,
          backgroundColor: "#7CF5FF",
          padding: 10,
          marginTop: 20,
          marginHorizontal: 0,
          height: 60,
          width: "90%",
          fontFamily: "Quicksand-Medium",
          color: "black",
          textAlign: "center",
        }}
      />
      {isEdit ? (
        <View className="w-full items-center">
          <CustomTextMedium
            style={{
              alignSelf: "flex-start",
              textAlign: "left",
              marginLeft: 20,
            }}
          >
            Mật khẩu
          </CustomTextMedium>
          <TextInput
            placeholder="Mật khẩu cũ"
            placeholderTextColor="#888888"
            style={{
              borderRadius: 15,
              backgroundColor: "#7CF5FF",
              borderWidth: 0,
              padding: 10,
              marginTop: 5,
              marginHorizontal: 0,
              height: 60,
              width: "90%",
              fontFamily: "Quicksand-Medium",
              color: "black",
            }}
          />
          <TextInput
            placeholder="Mật khẩu mới"
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
          />
          <TextInput
            placeholder="Xác nhận mật khẩu mới"
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
          />
        </View>
      ) : null}
      {!isEdit ? (
        <View className="flex-row items-center p-3 gap-2 mt-5 ">
          <TouchableOpacity
            className=" flex-row items-center p-3 gap-2 mt-5 "
            style={{
              borderWidth: 2,
              paddingVertical: 10,
              borderRadius: 50,
              marginHorizontal: 20,
              alignItems: "center",
              borderColor: "#0400FF",
            }}
            onPress={() => {
              setIsEdit(true);
            }}
          >
            <CustomTextBold style={{ color: "black", fontSize: 16 }}>
              Chỉnh sửa
            </CustomTextBold>

            <Image
              source={require("@/assets/icons/arrow_icon.png")}
              className="w-10 h-10"
            />
          </TouchableOpacity>
          <TouchableOpacity
            className=" flex-row items-center p-3 gap-2 mt-5 "
            style={{
              borderWidth: 2,
              paddingVertical: 10,
              borderRadius: 50,
              marginHorizontal: 20,
              alignItems: "center",
              borderColor: "#0400FF",
            }}
            onPress={() => {
              handlePress();
            }}
          >
            <CustomTextBold style={{ color: "black", fontSize: 16 }}>
              Đăng xuất
            </CustomTextBold>

            <Image
              source={require("@/assets/icons/arrow_icon.png")}
              className="w-10 h-10"
            />
          </TouchableOpacity>
          <Modal isOpen={modalVisible} withInput={false}>
            <View className="bg-[#FFFFFF] w-full p-4 gap-4 rounded-[30px] shadow-[0_0_10px_10px_rgba(124,245,255,0.25)] ml-5 mr-5 items-center justify-center border-solid border-[1px] border-[#448AFD] ">
              <Image source={require("@/assets/icons/success_icon.png")} />
              <CustomTextBold>Đăng xuất thành công</CustomTextBold>
              <CustomTextMedium>
                Hãy kiểm tra trong phần quản lý thiết bị
              </CustomTextMedium>
            </View>
          </Modal>
        </View>
      ) : (
        <View className="flex-row items-center p-3 gap-2 mt-5 ">
          <TouchableOpacity
            className=" flex-row items-center p-3 gap-2 mt-5 "
            style={{
              borderWidth: 2,
              paddingVertical: 10,
              borderRadius: 50,
              marginHorizontal: 20,
              alignItems: "center",
              borderColor: "#0400FF",
            }}
            onPress={() => {
              setIsEdit(false);
            }}
          >
            <CustomTextBold style={{ color: "black", fontSize: 16 }}>
              Hủy
            </CustomTextBold>

            <Image
              source={require("@/assets/icons/arrow_icon.png")}
              className="w-10 h-10"
            />
          </TouchableOpacity>
          {/* <TouchableOpacity
        className=" flex-row items-center p-3 gap-2 mt-5 "
        style={{
          borderWidth: 2,
          paddingVertical: 10,
          borderRadius: 50,
          marginHorizontal: 20,
          alignItems: "center",
          borderColor: "#0400FF",
        }}
        onPress={() => setModalVisible(true)}
      >
        <CustomTextBold style={{ color: "black", fontSize: 16 }}>
          Đăng xuất
        </CustomTextBold>

        <Image
          source={require("@/assets/icons/arrow_icon.png")}
          className="w-10 h-10"
        />
      </TouchableOpacity> */}
        </View>
      )}
      {/* </ScrollView> */}
    </View>
  );
};

export default profile;
