import { View, Text, TouchableOpacity, Image, Pressable } from "react-native";
import React from "react";
import CustomText from "@/components/CustomText";
import CustomTextMedium from "@/components/CustomTextMedium";
import CustomTextBold from "@/components/CustomTextBold";
import { TextInput } from "react-native";
import {Modal} from '@/components/Modal';
import {useState} from 'react';
import { useEffect } from "react";

const addDevice = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const handlePress = () => {
    setModalVisible(true);
    const timer = setTimeout(() => { setModalVisible(false); }, 2000);
    return () => clearTimeout(timer)
  }

  return (
    <View>
      <CustomTextBold className="m-5 text-[20px]">
        Thêm thiết bị mới
      </CustomTextBold>
      <TextInput
        placeholder="Hãy nhập ID của thiết bị"
        placeholderTextColor="#978CEA"
        style={{
          borderRadius: 50,
          backgroundColor: "#0400FF",
          borderWidth: 0,
          padding: 10,
          marginTop: 20,
          marginHorizontal: 20,
          height: 60,
          fontFamily: "Quicksand-Medium",
          color: "#FFFFFF",
        }}
      />
      <CustomText className="m-10">
        ID thiết bị được in trên bề mặt sản phẩm Nếu không tìm thấy, bạn hãy
        liên hệ với nhà bán hàng của mình nhé
      </CustomText>
      {/* Nút "Thêm thiết bị" */}
      {!modalVisible && (
        <TouchableOpacity
          className="ml-auto flex-row items-center p-3 gap-2 "
          style={{
            borderWidth: 2,
            paddingVertical: 10,
            borderRadius: 50,
            marginHorizontal: 20,
            alignItems: "center",
            borderColor: "#0400FF",
          }}
          onPress={() => {handlePress()}}
        >
          <CustomTextBold style={{ color: "black", fontSize: 16 }}>
            Thêm
          </CustomTextBold>
          <Image 
            source={require("@/assets/icons/arrow_icon.png")}
            className="w-10 h-10"
          />
        </TouchableOpacity>
      )}
      <Modal isOpen={modalVisible} withInput={false}>
        <View className="bg-[#FFFFFF] w-full p-4 gap-4 rounded-[30px] shadow-[0_0_10px_10px_rgba(124,245,255,0.25)] ml-5 mr-5 items-center justify-center border-solid border-[1px] border-[#448AFD] ">
          <Image source={require('@/assets/icons/success_icon.png')} />
          <CustomTextBold>Thêm thiết bị thành công</CustomTextBold>
          <CustomTextMedium>Hãy kiểm tra trong phần quản lý thiết bị</CustomTextMedium>
        </View>
      </Modal>
    </View>
  );
};

export default addDevice;
