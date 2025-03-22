import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import CustomText from "@/components/CustomText";
import CustomTextMedium from "@/components/CustomTextMedium";
import CustomTextBold from "@/components/CustomTextBold";
const login = () => {
  const [showSignUp, setShowSignUp] = useState(false);
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
      />
      {showSignUp ? (
        <TextInput
          placeholder="Nhap lai Mật khẩu"
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
