import {
  View,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
  DevSettings,
  StyleSheet,
} from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import { useRouter } from "expo-router";
import CustomTextBold from "@/components/CustomTextBold";
import CustomTextMedium from "@/components/CustomTextMedium";
import { Modal } from "@/components/Modal";
import CustomText from "@/components/CustomText";

const profile = () => {
  const [isEdit, setIsEdit] = useState(false);
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [isSave, setIsSave] = useState(false);
  const handleSave = () => {
    setIsSave(true);
    setModalVisible(true);
    setIsEdit(false);
    const timer = setTimeout(() => {
      setModalVisible(false);
      setIsSave(false);
    }, 2000);
    return () => clearTimeout(timer);
  };
  const handleLogin = () => {
    setModalVisible(true);
    const timer = setTimeout(() => {
      setModalVisible(false);
      router.replace("/login");
    }, 2000);
    return () => clearTimeout(timer);
  };
  return (
    <View className="flex-1 mt-20 items-center gap-1">
      {/* <ScrollView contentContainerStyle={{ paddingBottom: 80 }}> */}
      <Image
        style={styles.profileImage}
        source={require("@/assets/images/profile_img.png")}
      />
      <CustomTextBold style={styles.userName}>
        Dang Tuan fammer
      </CustomTextBold>
      <CustomTextMedium style={styles.sectionTitle}>
        Thông tin cá nhân
      </CustomTextMedium>
      <TextInput
        placeholder="Đặng Minh Tuấn"
        placeholderTextColor="black"
        style={[styles.input, styles.centerText]}
      />
      <TextInput
        placeholder="02/02/2004"
        placeholderTextColor="black"
        style={[styles.input, styles.centerText]}
      />
      {isEdit ? (
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
      ) : null}
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
            onPress={() => handleLogin()}
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
              setIsEdit(false);
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
  );
};

const styles = StyleSheet.create({
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