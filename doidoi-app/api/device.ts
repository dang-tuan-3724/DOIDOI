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
          
          return response.data;
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
  deleteDevice: async (token: string, deviceId: number) => {
    try {
      const response = await axiosClient.delete(`device/${deviceId}`, {
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
      }
    }
  },
  changePumpAutoLevel: async (token: string, pumpId: number, value: string) => {
    try {
      const response = await axiosClient.put(`pump/${pumpId}/autoLevel`, {
        autoLevel: value === "auto"
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
  }
};

export default devices;