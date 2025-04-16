import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  RefreshControl,
  Platform,
} from "react-native";
import CustomText from "@/components/CustomText";
import CustomTextMedium from "@/components/CustomTextMedium";
import CustomTextBold from "@/components/CustomTextBold";
import { Modal } from "@/components/Modal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

// Define interface for log item
interface LogItem {
  id: string;
  date: string;
  activity: string;
  category: string;
  originalDate: Date; // Store original date for filtering
}

const LogScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState({ title: "", message: "" });
  // Specify the type for the logs state
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<LogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [toggleOffFilters, setToggleOffFilters] = useState(false);
  // Date filter states
  const [startDate, setStartDate] = useState(
    new Date(new Date().setMonth(new Date().getMonth() - 1))
  ); // Default to 1 month ago
  const [endDate, setEndDate] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchLogs();
    setRefreshing(false);
  };

  const handleClickOffFilters = () => {
    setToggleOffFilters(true);
    onRefresh();
  };
  const handleClickOnFilters = () => {
    setToggleOffFilters(false);
    onRefresh();
  };
  const fetchLogs = async () => {
    try {
      const token = await AsyncStorage.getItem("AccessToken");
      if (!token) {
        console.error("No access token found");
        return;
      }

      const response = await axios.get(`http://10.0.2.2:3000/api/history`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data && response.data.controlsHistory) {
        const formattedLogs = response.data.controlsHistory.map((log) => {
          // Format date (YYYY-MM-DD)
          const date = new Date(log.timeSwitch);
          const formattedDate = `${date
            .getDate()
            .toString()
            .padStart(2, "0")}.${(date.getMonth() + 1)
            .toString()
            .padStart(2, "0")}.${date.getFullYear().toString().substring(2)}`;

          // Determine category based on action content
          const category = log.action.includes("Thêm")
            ? "Hệ thống"
            : "Người dùng";

          return {
            id: log.controlID.toString(),
            date: formattedDate,
            activity: log.action,
            category: category,
            originalDate: date, // Store original date for filtering
          };
        });

        setLogs(formattedLogs);
        applyDateFilter(formattedLogs, startDate, endDate);
      }
    } catch (error) {
      console.error("Error fetching logs:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyDateFilter = (
    logsToFilter = logs,
    start = startDate,
    end = endDate
  ) => {
    // Make sure end date is at the end of the day for inclusive filtering
    const endOfDay = new Date(end);
    endOfDay.setHours(23, 59, 59, 999);

    const filtered = logsToFilter.filter((log) => {
      return log.originalDate >= start && log.originalDate <= endOfDay;
    });
    if (toggleOffFilters) {
      setFilteredLogs(logsToFilter);
    } else {
      setFilteredLogs(filtered);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  // Date picker handlers
  const onStartDateChange = (event: any, selectedDate: Date | undefined) => {
    const currentDate = selectedDate || startDate;
    setShowStartPicker(Platform.OS === "ios");
    setStartDate(currentDate);
    applyDateFilter(logs, currentDate, endDate);
  };

  const onEndDateChange = (event: any, selectedDate: Date | undefined) => {
    const currentDate = selectedDate || endDate;
    setShowEndPicker(Platform.OS === "ios");
    setEndDate(currentDate);
    applyDateFilter(logs, startDate, currentDate);
  };

  const handleDownload = async () => {
    try {
      // Create a JSON object with the filtered logs
      const dataToDownload = filteredLogs.map((log) => ({
        id: log.id,
        date: log.date,
        activity: log.activity,
        category: log.category,
      }));

      // Convert to JSON string
      const jsonString = JSON.stringify(dataToDownload, null, 2);

      // Create a timestamp for the filename
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const fileName = `logs_${timestamp}.json`;

      if (Platform.OS === "android") {
        try {
          // Get permissions and save with StorageAccessFramework
          const permissions =
            await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();

          if (permissions.granted) {
            // Get the directory uri that was approved
            const directoryUri = permissions.directoryUri;

            // Create the file in the selected directory
            const fileUri =
              await FileSystem.StorageAccessFramework.createFileAsync(
                directoryUri,
                fileName,
                "application/json"
              );

            // Write the file content
            await FileSystem.writeAsStringAsync(fileUri, jsonString, {
              encoding: FileSystem.EncodingType.UTF8,
            });

            setModalMessage({
              title: "Đã lưu lịch sử hoạt động",
              message: "Tệp đã được lưu vào thư mục bạn chọn",
            });
          } else {
            throw new Error("User did not grant permissions");
          }
        } catch (error) {
          console.error("SAF error:", error);
          // Fallback to sharing
          const tempFileUri = `${FileSystem.cacheDirectory}${fileName}`;
          await FileSystem.writeAsStringAsync(tempFileUri, jsonString);

          if (await Sharing.isAvailableAsync()) {
            await Sharing.shareAsync(tempFileUri);
            setModalMessage({
              title: "Chia sẻ lịch sử hoạt động",
              message: "Bạn có thể lưu tệp từ menu chia sẻ",
            });
          }
        }
      } else {
        // For iOS, use sharing as iOS doesn't have direct storage access
        const tempFileUri = `${FileSystem.cacheDirectory}${fileName}`;
        await FileSystem.writeAsStringAsync(tempFileUri, jsonString);

        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(tempFileUri);
          setModalMessage({
            title: "Chia sẻ lịch sử hoạt động",
            message: "Bạn có thể lưu tệp từ menu chia sẻ",
          });
        }
      }

      setModalVisible(true);
      const timer = setTimeout(() => {
        setModalVisible(false);
      }, 2000);
      return () => clearTimeout(timer);
    } catch (error) {
      console.error("Error downloading logs:", error);
      setModalMessage({
        title: "Lỗi tải xuống",
        message: "Không thể tải xuống dữ liệu",
      });
      setModalVisible(true);
      setTimeout(() => setModalVisible(false), 2000);
    }
  };

  const toggleFilters = () => {
    setIsFiltering(!isFiltering);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerActions}>
        <TouchableOpacity onPress={toggleFilters} style={[styles.filterButton, toggleOffFilters ? {backgroundColor: "#F0F0F0"} : {backgroundColor: "#00ddff"}]}>
          <Image
            source={require("@/assets/icons/filter_icon.png")}
            className="w-8 h-8"
          />
          <CustomText>Bộ lọc</CustomText>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleDownload} style={styles.iconButton}>
          <Image
            source={require("@/assets/icons/download_icon.png")}
            className="w-10 h-10"
          />
        </TouchableOpacity>
      </View>

      {/* Date Filter Section */}
      {isFiltering && (
        <View style={styles.filterContainer}>
          <View style={styles.dateFilterRow}>
            <View style={styles.datePickerContainer}>
              <CustomText>Từ ngày:</CustomText>
              <TouchableOpacity
                onPress={() => setShowStartPicker(true)}
                style={styles.dateButton}
              >
                <CustomTextMedium>
                  {startDate.getDate().toString().padStart(2, "0")}/
                  {(startDate.getMonth() + 1).toString().padStart(2, "0")}/
                  {startDate.getFullYear()}
                </CustomTextMedium>
              </TouchableOpacity>
            </View>

            <View style={styles.datePickerContainer}>
              <CustomText>Đến ngày:</CustomText>
              <TouchableOpacity
                onPress={() => setShowEndPicker(true)}
                style={styles.dateButton}
              >
                <CustomTextMedium>
                  {endDate.getDate().toString().padStart(2, "0")}/
                  {(endDate.getMonth() + 1).toString().padStart(2, "0")}/
                  {endDate.getFullYear()}
                </CustomTextMedium>
              </TouchableOpacity>
            </View>
            {
              toggleOffFilters ? (
                <TouchableOpacity
                onPress={handleClickOnFilters}
                style={styles.offFilterButton}
              >
                <Image
                  source={require("@/assets/icons/filter_icon.png")}
                  className="w-8 h-8"
                />
                <CustomText>Bật bộ lọc</CustomText>
              </TouchableOpacity>
              ) : (
                <TouchableOpacity
                onPress={handleClickOffFilters}
                style={styles.onFilterButton}
              >
                <Image
                  source={require("@/assets/icons/filter_icon.png")}
                  className="w-8 h-8"
                />
                <CustomText>Tắt bộ lọc</CustomText>
              </TouchableOpacity>
              )
            }
          </View>

          {showStartPicker && (
            <DateTimePicker
              value={startDate}
              mode="date"
              display="default"
              onChange={onStartDateChange}
              maximumDate={endDate}
            />
          )}

          {showEndPicker && (
            <DateTimePicker
              value={endDate}
              mode="date"
              display="default"
              onChange={onEndDateChange}
              minimumDate={startDate}
              maximumDate={new Date()}
            />
          )}
        </View>
      )}

      {/* Header */}
      <View style={styles.header}>
        <CustomTextBold style={styles.headerText}>Ngày</CustomTextBold>
        <CustomTextBold style={styles.headerText}>Hoạt động</CustomTextBold>
        <CustomTextBold style={styles.headerText}>Phân loại</CustomTextBold>
      </View>

      {/* Danh sách hoạt động */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <CustomText>Đang tải dữ liệu...</CustomText>
        </View>
      ) : (
        <FlatList
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          data={filteredLogs}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View
              style={[
                styles.logItem,
                {
                  backgroundColor:
                    item.category === "Người dùng" ? "#E3FFDE" : "#C4FFB8",
                },
              ]}
            >
              <CustomTextMedium style={styles.logText}>
                {item.date}
              </CustomTextMedium>
              <CustomTextMedium style={styles.logText}>
                {item.activity}
              </CustomTextMedium>
              <CustomTextMedium style={styles.logText}>
                {item.category}
              </CustomTextMedium>
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <CustomText>Không có dữ liệu nhật ký</CustomText>
            </View>
          }
        />
      )}
      <Modal isOpen={modalVisible} withInput={false}>
        <View className="bg-[#FFFFFF] w-full p-4 gap-4 rounded-[30px] shadow-[0_0_10px_10px_rgba(124,245,255,0.25)] ml-5 mr-5 items-center justify-center border-solid border-[1px] border-[#448AFD] ">
          <Image source={require("@/assets/icons/success_icon.png")} />
          <CustomTextBold>
            {modalMessage.title || "Đã tải xuống lịch sử hoạt động"}
          </CustomTextBold>
          <CustomTextMedium>
            {modalMessage.message ||
              "Kiểm tra trong phần quản lí tệp của thiết bị"}
          </CustomTextMedium>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#FFFFFF",
    marginBottom: 70,
  },
  headerActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F0F0",
    padding: 8,
    borderRadius: 20,
  },
  onFilterButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#00ddff",
    padding: 8,
    borderRadius: 20,
  },
  offFilterButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F0F0",
    padding: 8,
    borderRadius: 20,
  },
  filterContainer: {
    marginBottom: 15,
    backgroundColor: "#F8F8F8",
    padding: 10,
    borderRadius: 10,
  },
  dateFilterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  datePickerContainer: {
    flex: 1,
    alignItems: "center",
  },
  dateButton: {
    backgroundColor: "#E0E0E0",
    padding: 8,
    borderRadius: 8,
    marginTop: 5,
    minWidth: 120,
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    borderBottomWidth: 2,
    paddingBottom: 5,
  },
  headerText: {
    fontSize: 20,
    flex: 1,
    textAlign: "center",
  },
  iconButton: {
    marginLeft: "auto",
  },
  logItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    marginBottom: 8,
    borderRadius: 30,
  },
  logText: {
    flex: 1,
    textAlign: "center",
    fontSize: 14,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
});

export default LogScreen;
