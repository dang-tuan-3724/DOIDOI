import axios from 'axios';
import axiosClient from "./apiManager";

const devices = {
    getAllDevice: async (token: string) => {
        try {
          const response = await axiosClient.get('device', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
    
          const devices = response.data;
          
          // Gọi thêm trạng thái từ Adafruit theo loại thiết bị
          const enrichedDevices = await Promise.all(
            devices.map(async (device: any) => {
              try {
                let adafruitState = null;
    
                if (device.type === "led_light") {
                  const res = await axiosClient.get(`light/${device.deviceID}/adafruit/state`, {
                    headers: { Authorization: `Bearer ${token}` },
                  });
                  adafruitState = res.data;
                } else if (device.type === "pump") {
                  const res = await axiosClient.get(`pump/${device.deviceID}/adafruit/state`, {
                    
                    headers: { Authorization: `Bearer ${token}` },
                  });
                  adafruitState = res.data;
                }
                
                return { ...device, adafruitState };
              } catch (err) {
                console.warn(`Không thể lấy trạng thái Adafruit cho thiết bị ${device.id}`);
                return { ...device, adafruitState: null };
              }
            })
          );
          
          return enrichedDevices;
        } catch (error) {
          if (axios.isAxiosError(error)) {
            throw error;
          } else {
            console.error("Unexpected error: ", error);
          }
        }
    },
    changeStatus: async (token: string, deviceID: number, status: string) => {
    try {
      const response = await axiosClient.put(`device/${deviceID}/status`, {
          status: status
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw error;
      } else {
        console.error("Unexpected error: ", error);
    }}
  },
  changeState: async (token: string, lightId: number, state: string, type: string) => {
    try {
      const response = await axiosClient.put(`${type}/${lightId}/adafruit/state`, {
          state: state
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw error;
      } else {
        console.error("Unexpected error: ", error);
    }}
  },
  updateSchedule: async (token: string, pumpId: number, schedule: string) => {
    try {
      const response = await axiosClient.put(`pump/${pumpId}/schedule`, {
        schedule: schedule
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw error;
      } else {
        console.error("Unexpected error: ", error);
    }}
  },
};

export default devices;