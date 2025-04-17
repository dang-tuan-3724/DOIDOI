import { Link } from "expo-router";
import { View, Text, ScrollView, Dimensions } from "react-native";
import { useFonts } from "expo-font";
import AppLoading from "expo-app-loading";
import CustomText from "@/components/CustomText";
import CustomTextMedium from "@/components/CustomTextMedium";
import CustomTextBold from "@/components/CustomTextBold";
import { LineChart } from "react-native-chart-kit";
import { useState } from "react";

import { useEffect } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";

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
  const [tempAlert, setTempAlert] = useState(false);
  const [humidAlert, setHumidAlert] = useState(false);
  const [somoAlert, setSomoAlert] = useState(false);
  let tempLimit = 0; // Default temperature limit
  let humidLimit = 0; // Default humidity limit
  let somoLimit = 0; // Default soil moisture limit
  const base_url = process.env.API_URL;
  useEffect(() => {
    // Function to fetch temperature data
    const getLimit = async () => {
      const alertsString = await AsyncStorage.getItem("ListAlert");
      if (alertsString) {
        try {
          const alertsList = JSON.parse(alertsString);
          const tempAlert = alertsList.find(alert => alert.flag === "temperature");
          const humidAlert = alertsList.find(alert => alert.flag === "humidity");
          const somoAlert = alertsList.find(alert => alert.flag === "soil_humid");
          if (tempAlert) {
            tempLimit = tempAlert.alert;
          }
          if (humidAlert) {
            humidLimit = humidAlert.alert;
          }
          if (somoAlert) {
            somoLimit=somoAlert.alert;
          }
        } catch (error) {
          console.error("Error parsing alert settings:", error);
        }
      }
    }
  
    const fetchTemperature = async () => {
      try {
        const token = await AsyncStorage.getItem("AccessToken");
        if (!token) {
          console.error("No access token found");
          return;
        }
        // Retrieve alert settings from AsyncStorage



        axios
          .get(`${base_url}adafruit/fetch-temp`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            if (response.data) {
              const tempData = response.data.data[0];
             // console.log(response.data.data[0]);
              const newTempReading = {
                value: parseFloat(tempData.value),
                timestamp: new Date(tempData.created_at),
              };
              if (response.data.data[0]>tempLimit) {
                setTempAlert(true);
              } else{
                setTempAlert(false);
              }

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
          .get(`${base_url}adafruit/fetch-humd`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            if (response.data) {
              const humData = response.data.data[0];
             // console.log(response.data.data[0]);
              const newHumidReading = {
                value: parseFloat(humData.value),
                timestamp: new Date(humData.created_at),
              };
              if (response.data.data[0] > humidLimit) {
                setHumidAlert(true);
              }
              else{
                setHumidAlert(false);
              }
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
          .get(`${base_url}adafruit/fetch-somo`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            if (response.data) {
              const somoData = response.data.data[0];
             // console.log(response.data.data[0]);
              const newSomoReading = {
                value: parseFloat(somoData.value),
                timestamp: new Date(somoData.created_at),
              };
              if (response.data.data[0]>somoLimit) {
                setSomoAlert(true);
              }
              else{
                setSomoAlert(false);
              }
              // Update tempArr with new reading (using functional update to avoid stale state)
              setSomoArr((prevSomoArr) => [...prevSomoArr, newSomoReading]);
            }
          })
          .catch((error) => {
            console.error("Error fetching somo data:", error);
          });
      } catch (error) {
        console.error("Error retrieving access token:", error);
      }
    };
    // -------------------------------------------------
    getLimit();
    fetchTemperature();
    fetchHumid();
    fetchSomo();
 // Call the function to get the limits
    const intervalId = setInterval(fetchTemperature, 3000);
    const intervalId2 = setInterval(fetchHumid, 3000);
    const intervalId3 = setInterval(fetchSomo, 3000);

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
          <CustomTextBold className="mt-10">Tình trạng vườn của bạn</CustomTextBold>
          <View className="flex-1 w-full px-5">
            {tempAlert || humidAlert || somoAlert ? (
              <View className="justify-center items-center gap-5 align-items-center">
                <CustomTextBold className="text-red-600 mb-1">Cảnh báo!</CustomTextBold>
                <CustomText className="text-red-600">
                  {tempAlert ? "Nhiệt độ" : ""}
                  {tempAlert && (humidAlert || somoAlert) ? ", " : ""}
                  {humidAlert ? "độ ẩm không khí" : ""}
                  {(tempAlert || humidAlert) && somoAlert ? ", " : ""}
                  {somoAlert ? "độ ẩm đất" : ""} đang vượt mức cho phép, hãy kiểm tra ngay!
                </CustomText>
              </View>
            ) : (
              <View className="justify-center items-center gap-5 align-items-center">
                <CustomTextBold className="">Tuyệt vời!</CustomTextBold>
                <CustomText className="">
                  Mọi thứ đang hoạt động hoàn hảo.
                </CustomText>
              </View>
            )}
          </View>

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
              backgroundColor: tempAlert ? "#FF0000" : "#D1E0FF",
              backgroundGradientFrom: tempAlert ? "#FF5555" : "#D1E0FF",
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
              backgroundGradientFrom: (humidAlert || somoAlert)? "#FF5555" : "#ADC7FF",
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
