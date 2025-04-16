import axios from 'axios';
import axiosClient from "./apiManager";

const sensors = {
  getAllSensor: async (token: string) => {
      try {
        const response = await axiosClient.get('sensor', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
                  
        return response.data.sensors;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          throw error;
        } else {
          console.error("Unexpected error: ", error);
        }
      }
  },
  changeStatus: async (token: string, sensorId: number, status: string) => {
    try {
      const response = await axiosClient.put(`sensor/${sensorId}/status`, {
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
  updateAlertThreshold: async (token: string, sensorId: number, value: number) => {    
    try {
      const response = await axiosClient.put(`sensor/${sensorId}/alertThreshold`, {
          alertThreshold: value
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
  deleteSensor: async (token: string, sensorId: number) => {
    try {
      const response = await axiosClient.delete(`sensor/${sensorId}`, {
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
};

export default sensors;