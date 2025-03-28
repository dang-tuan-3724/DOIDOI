import { Link } from "expo-router";
import { View, Text, ScrollView, Dimensions } from "react-native";
import { useFonts } from "expo-font";
import AppLoading from "expo-app-loading";
import CustomText from "@/components/CustomText";
import CustomTextMedium from "@/components/CustomTextMedium";
import CustomTextBold from "@/components/CustomTextBold";
import { LineChart } from "react-native-chart-kit";

const Index = () => {
const Index = () => {
  const [fontsLoaded] = useFonts({
    "Quicksand-Regular": require("@/assets/fonts/Quicksand-Regular.ttf"),
    "Quicksand-Medium": require("@/assets/fonts/Quicksand-Medium.ttf"),
    "Quicksand-Bold": require("@/assets/fonts/Quicksand-Bold.ttf"),
  });
  const currentExTemp = 32;

  if (!fontsLoaded) {
    return <AppLoading />; // Hoặc return null để chờ font load
  }
  return (
    <ScrollView className="flex-1 bg-[#FFFFFF]">
      <View className="flex-1 justify-center items-center gap-5">
        <View className="flex-1 justify-center items-center w-[90%] h-60 bg-[#9AF7FF] rounded-[30px] mt-5">
          <CustomTextBold className="">Tình trạng vườn của bạn</CustomTextBold>
          <CustomTextMedium>Mọi thứ hoàn hảo</CustomTextMedium>
        </View>
        <View className="flex-1 justify-center items-center ">
          <CustomTextBold className="">
            Nhiệt độ hiện tại: {currentExTemp}°C
          </CustomTextBold>
          <LineChart
            data={{
              labels: [
                "6:00",
                "8:00",
                "10:00",
                "12:00",
                "14:00",
                "16:00",
                "18:00",
              ],
              datasets: [
                {
                  data: [25, 26, 28], // Dữ liệu nhiệt độ
                  color: (opacity = 1) => `rgba(255, 99, 132, ${opacity})`, // Màu đỏ
                  strokeWidth: 4,
                },
              ],
              legend: [`Nhiệt độ (°C)`],
            }}
            width={Dimensions.get("window").width - 40}
            height={200}
            yAxisSuffix="°C"
            chartConfig={{
              backgroundColor: "#D1E0FF",
              backgroundGradientFrom: "#D1E0FF",
              backgroundGradientTo: "#D1E0FF",
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              propsForDots: {
                r: "4",
                strokeWidth: "2",
                stroke: "#ffa726",
              },
            }}
            bezier
            style={{
              marginVertical: 5,
              borderRadius: 30,
              alignSelf: "center",
            }}
          />
        </View>

        <View className="flex-1 justify-center items-center">
          <CustomTextBold className="">
            Hiện tại độ ẩm đất: 70% và không khí 60%
          </CustomTextBold>
          <LineChart
            data={{
              labels: [
                "6:00",
                "8:00",
                "10:00",
                "12:00",
                "14:00",
                "16:00",
                "18:00",
              ],
              datasets: [
                {
                  data: [60, 62, 58], // Dữ liệu độ ẩm đất
                  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`, // Màu trắng
                  strokeWidth: 5,
                },
                {
                  data: [70, 72, 68], // Dữ liệu độ ẩm không khí
                  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Màu xanh lục
                  strokeWidth: 4,
                },
              ],
              legend: ["Độ ẩm đất (%)", "Độ ẩm không khí (%)"],
            }}
            width={Dimensions.get("window").width - 40}
            height={200}
            yAxisSuffix="%"
            chartConfig={{
              backgroundColor: "#f5f5f5",
              backgroundGradientFrom: "#ADC7FF",
              backgroundGradientTo: "#ADC7FF",
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              propsForDots: {
                r: "4",
                strokeWidth: "2",
                stroke: "#FFFFFF",
              },
            }}
            bezier
            style={{
              marginVertical: 5,
              borderRadius: 30,
              alignSelf: "center",
            }}
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default Index;
