import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// ── HOST MACHINE IP ──────────────────────────────────────────────────────────
// Detected host Wi-Fi IP: 192.168.190.163
// Android Emulator: use 10.0.2.2 (special alias to host)
// Physical Phone on same Wi-Fi: use 192.168.190.163
// ─────────────────────────────────────────────────────────────────────────────
export const DEFAULT_BASE_URL = Platform.select({
  web: 'http://localhost:5000',          // Web browser on PC
  android: 'http://10.0.2.2:5000',       // Android Emulator → host PC
  ios: 'http://192.168.190.163:5000',    // iOS device on same Wi-Fi
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
      let storedBaseUrl = await AsyncStorage.getItem('@custom_base_url');
      // If running on web in the browser, always ensure localhost is used
      if (Platform.OS === 'web' && storedBaseUrl && (storedBaseUrl.includes('10.0.2.2') || storedBaseUrl.includes('192.168.'))) {
        storedBaseUrl = 'http://localhost:5000';
        await AsyncStorage.setItem('@custom_base_url', 'http://localhost:5000');
      }
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
