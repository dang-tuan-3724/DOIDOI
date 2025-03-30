import axios from 'axios';
import axiosClient from "./apiManager";

const authService = {
  login: async (username: string, password: string) => {
    try {
      const response = await axiosClient.post('auth/login', {
        username: username,
        password: password,
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw error;
      } else {
        console.error("Unexpected error: ", error);
    }}
  },
  signUp: async (username: string, password: string) => {
    try {
      const response = await axiosClient.post('auth/signup', {
        username: username,
        password: password,
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw error;
      } else {
        console.error("Unexpected error: ", error);
    }}
  },
  getUserInfo: async (userID: number, token: string) => {
    try {
      const response = await axiosClient.get('auth/userInfor', {
        params: {
          userID: userID,
        },
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

export default authService;