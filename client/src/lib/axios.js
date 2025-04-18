import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: "https://chat-app-xzm4.onrender.com",
  withCredentials: true,
});