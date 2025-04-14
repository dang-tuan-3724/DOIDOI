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
  getUserInfo: async (token: string) => {
    try {
      const response = await axiosClient.get('auth/userInfor', {
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
  updateUserInfo: async (token: string, firstName: string, lastName: string, phoneNum: string, email: string) => {
    try {
      const response = await axiosClient.put('auth/userInfor', {
          firstName: firstName, 
          lastName: lastName, 
          phoneNum: phoneNum, 
          email: email
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

export default authService;