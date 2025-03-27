import { Link } from "expo-router";
import { View, Text, ScrollView } from "react-native";
import { useFonts } from "expo-font";
import AppLoading from "expo-app-loading";
import CustomText from "@/components/CustomText";
import CustomTextMedium from "@/components/CustomTextMedium";
import CustomTextBold from "@/components/CustomTextBold";

export default function Index() {
  const [fontsLoaded] = useFonts({
    "Quicksand-Regular": require("@/assets/fonts/Quicksand-Regular.ttf"),
    "Quicksand-Medium": require("@/assets/fonts/Quicksand-Medium.ttf"),
    "Quicksand-Bold": require("@/assets/fonts/Quicksand-Bold.ttf"),
  });

  if (!fontsLoaded) {
    return <AppLoading />; // Hoặc return null để chờ font load
  }
  return (
    <ScrollView>
    <View className="flex-1 justify-center items-center gap-2">
      <View className="flex-1 justify-center items-center  bg-[#9AF7FF] w-[90%] h-60 rounded-[30px] mt-5">
        <CustomTextBold className="">Tình trạng vườn của bạn</CustomTextBold>
        <CustomTextMedium>Mọi thứ hoàn hảo</CustomTextMedium>
      </View>
      <View className="flex-1 justify-center items-center  bg-[#5AF1F0] w-[90%] h-60 rounded-[30px]">
        <CustomTextBold className="">Nhiệt độ</CustomTextBold>
        <CustomTextMedium>Mọi thứ hoàn hảo</CustomTextMedium>
      </View>
      <View className="flex-1 justify-center items-center  bg-[#5AF1F0] w-[90%] h-60 rounded-[30px]">
        <CustomTextBold className="">Độ ẩm</CustomTextBold>
        <CustomTextMedium>Mọi thứ hoàn hảo</CustomTextMedium>
      </View>
      
    </View>
    </ScrollView>
  );
}
