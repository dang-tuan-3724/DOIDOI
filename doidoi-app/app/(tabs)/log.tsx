import { View, Text, Image, TouchableOpacity } from "react-native";
import { useState } from "react";
import React from "react";
import LogItem from "@/components/logItem";
import { Modal } from "@/components/Modal";
import CustomTextMedium from "@/components/CustomTextMedium";
import CustomTextBold from "@/components/CustomTextBold";

const log = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const handlePress = () => {
    setModalVisible(true);
    const timer = setTimeout(() => {
      setModalVisible(false);
    }, 2000);
    return () => clearTimeout(timer);
  };
  return (
    <View>
      <View>
        <TouchableOpacity onPress={() => handlePress()}>
          <Image
            style={{
              width: 30,
              height: 30,
              alignSelf: "flex-end",
              margin: 20,
            }}
            source={require("@/assets/icons/download_icon.png")}
          />
        </TouchableOpacity>
        <Modal isOpen={modalVisible} withInput={false}>
          <View className="bg-[#FFFFFF] w-full p-4 gap-4 rounded-[30px] shadow-[0_0_10px_10px_rgba(124,245,255,0.25)] ml-5 mr-5 items-center justify-center border-solid border-[1px] border-[#448AFD] ">
            <Image source={require("@/assets/icons/success_icon.png")} />
            <CustomTextBold>Tải xuống thành công</CustomTextBold>
            <CustomTextMedium>
              Hãy kiểm tra trong phần quản lý file của thiết bị
            </CustomTextMedium>
          </View>
        </Modal>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          padding: 20,
        }}
      >
        <Text>Ngày</Text>
        <Text>Hoạt động</Text>
        <Text>Bởi</Text>
      </View>
      <View>
        <LogItem />
      </View>
    </View>
  );
};

export default log;
