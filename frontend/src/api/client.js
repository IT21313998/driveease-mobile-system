import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// For Android Emulator: http://10.0.2.2:5000 points to host PC
// For iOS/Web: http://localhost:5000
// For Physical Device via Wi-Fi: use your computer's Wi-Fi IP (e.g. http://192.168.8.185:5000)
export const DEFAULT_BASE_URL = Platform.select({
  android: 'http://10.0.2.2:5000',
  ios: 'http://localhost:5000',
  default: 'http://localhost:5000',
});

const client = axios.create({
  baseURL: DEFAULT_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach dynamic Base URL and JWT Token
client.interceptors.request.use(
  async (config) => {
    try {
      const storedBaseUrl = await AsyncStorage.getItem('@custom_base_url');
      if (storedBaseUrl) {
        config.baseURL = storedBaseUrl;
      }
      const token = await AsyncStorage.getItem('@user_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      console.warn('Error fetching token or baseUrl from storage', e);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Format error messages
client.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message || error.message || 'An unexpected error occurred';
    return Promise.reject(new Error(message));
  }
);

export default client;
