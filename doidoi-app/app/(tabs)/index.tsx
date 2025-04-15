import { Link } from "expo-router";
import { View, Text, ScrollView, Dimensions } from "react-native";
import { useFonts } from "expo-font";
import AppLoading from "expo-app-loading";
import CustomText from "@/components/CustomText";
import CustomTextMedium from "@/components/CustomTextMedium";
import CustomTextBold from "@/components/CustomTextBold";
import { LineChart } from "react-native-chart-kit";
import { useState } from "react";
import adafruitService from "@/api/adafruitService";
import { useEffect } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Index = () => {
  const [fontsLoaded] = useFonts({
    "Quicksand-Regular": require("@/assets/fonts/Quicksand-Regular.ttf"),
    "Quicksand-Medium": require("@/assets/fonts/Quicksand-Medium.ttf"),
    "Quicksand-Bold": require("@/assets/fonts/Quicksand-Bold.ttf"),
  });
  const [somoArr, setSomoArr] = useState<
    {
      value: number;
      timestamp: Date;
    }[]
  >([]);
  const [tempArr, setTempArr] = useState<{ value: number; timestamp: Date }[]>(
    []
  );

  const [humidArr, setHumidArr] = useState<
    {
      value: number;
      timestamp: Date;
    }[]
  >([]);
  useEffect(() => {
    // Function to fetch temperature data
    const fetchTemperature = async () => {
      try {
        const token = await AsyncStorage.getItem("AccessToken");
        if (!token) {
          console.error("No access token found");
          return;
        }

        axios
          .get(`http://10.0.2.2:3000/api/adafruit/fetch-temp`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            if (response.data) {
              const tempData = response.data.data[0];
              console.log(response.data.data[0]);
              const newTempReading = {
                value: parseFloat(tempData.value),
                timestamp: new Date(tempData.created_at),
              };

              // Update tempArr with new reading (using functional update to avoid stale state)
              setTempArr((prevTempArr) => [...prevTempArr, newTempReading]);
            }
          })
          .catch((error) => {
            console.error("Error fetching temperature data:", error);
          });
      } catch (error) {
        console.error("Error retrieving access token:", error);
      }
    };
    // -------------------------------------------------
    const fetchHumid = async () => {
      try {
        const token = await AsyncStorage.getItem("AccessToken");
        if (!token) {
          console.error("No access token found");
          return;
        }

        axios
          .get(`http://10.0.2.2:3000/api/adafruit/fetch-humd`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            if (response.data) {
              const humData = response.data.data[0];
              console.log(response.data.data[0]);
              const newHumidReading = {
                value: parseFloat(humData.value),
                timestamp: new Date(humData.created_at),
              };

              // Update tempArr with new reading (using functional update to avoid stale state)
              setHumidArr((prevHumidArr) => [...prevHumidArr, newHumidReading]);
            }
          })
          .catch((error) => {
            console.error("Error fetching humid data:", error);
          });
      } catch (error) {
        console.error("Error retrieving access token:", error);
      }
    };
    // -------------------------------------------------
    const fetchSomo = async () => {
      try {
        const token = await AsyncStorage.getItem("AccessToken");
        if (!token) {
          console.error("No access token found");
          return;
        }

        axios
          .get(`http://10.0.2.2:3000/api/adafruit/fetch-somo`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            if (response.data) {
              const somoData = response.data.data[0];
              console.log(response.data.data[0]);
              const newSomoReading = {
                value: parseFloat(somoData.value),
                timestamp: new Date(somoData.created_at),
              };

              // Update tempArr with new reading (using functional update to avoid stale state)
              setSomoArr((prevSomoArr) => [...prevSomoArr, newSomoReading]);
            }
          })
          .catch((error) => {
            console.error("Error fetching humid data:", error);
          });
      } catch (error) {
        console.error("Error retrieving access token:", error);
      }
    };
    // -------------------------------------------------

    fetchTemperature();
    fetchHumid();
    fetchSomo();
    const intervalId = setInterval(fetchTemperature, 300000);
    const intervalId2 = setInterval(fetchHumid, 300000);
    const intervalId3 = setInterval(fetchSomo, 300000);
    return () => {
      clearInterval(intervalId);
      clearInterval(intervalId2);
      clearInterval(intervalId3);
    };
  }, []);
  if (!fontsLoaded) {
    return <AppLoading />;
  }
  return (
    <ScrollView className="flex-1 bg-[#FFFFFF] mb-[90px]">
      <View className="flex-1 justify-center items-center gap-5">
        <View className="flex-1 justify-center items-center w-[90%] h-60 bg-[#9AF7FF] rounded-[30px] mt-5">
          <CustomTextBold className="">Tình trạng vườn của bạn</CustomTextBold>
          <CustomTextMedium>Mọi thứ hoàn hảo</CustomTextMedium>
        </View>
        <View className="flex-1 justify-center items-center ">
          <CustomTextBold className="">
            Nhiệt độ hiện tại:{" "}
            {tempArr.length > 0
              ? tempArr[tempArr.length - 1].value
              : "Đang tải..."}{" "}
            °C
          </CustomTextBold>
          <LineChart
            data={{
              labels: tempArr
                .slice(-7)
                .map(
                  (item) =>
                    item.timestamp.getHours().toString().padStart(2, "0") +
                    ":" +
                    item.timestamp.getMinutes().toString().padStart(2, "0")
                ),
              datasets: [
                {
                  data:
                    tempArr.length > 0
                      ? tempArr.slice(-7).map((item) => item.value)
                      : [25, 26, 28],
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
            Hiện tại độ ẩm đất:{" "}
            {somoArr.length > 0
              ? somoArr[somoArr.length - 1].value
              : "Đang tải..."}{" "}
            % và không khí{" "}
            {humidArr.length > 0
              ? humidArr[humidArr.length - 1].value
              : "Đang tải..."}{" "}
            %
          </CustomTextBold>
          <LineChart
            data={{
              labels: humidArr
                .slice(-7)
                .map(
                  (item) =>
                    item.timestamp.getHours().toString().padStart(2, "0") +
                    ":" +
                    item.timestamp.getMinutes().toString().padStart(2, "0")
                ),
              datasets: [
                {
                  data:
                    humidArr.length > 0
                      ? humidArr.slice(-7).map((item) => item.value)
                      : [25, 26, 28], // Dữ liệu độ ẩm đất
                  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`, // Màu trắng
                  strokeWidth: 5,
                },
                {
                  data:
                    somoArr.length > 0
                      ? somoArr.slice(-7).map((item) => item.value)
                      : [25, 26, 28], // Dữ liệu độ ẩm không khí
                  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Màu xanh lục
                  strokeWidth: 4,
                },
              ],
              legend: ["Độ ẩm không khí (%)", "Độ ẩm đất (%)"],
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
