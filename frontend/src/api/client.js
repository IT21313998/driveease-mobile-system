import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Default base URL. For Android Emulator: http://10.0.2.2:5000, for physical devices: your machine's LAN IP or hosted URL
export const DEFAULT_BASE_URL = 'http://localhost:5000';

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
