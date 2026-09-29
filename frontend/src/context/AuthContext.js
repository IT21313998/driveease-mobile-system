import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginApi, registerApi, getProfileApi } from '../api/authApi';
import { DEFAULT_BASE_URL } from '../api/client';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [baseUrl, setBaseUrlState] = useState(DEFAULT_BASE_URL);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStorageData();
  }, []);

  const loadStorageData = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('@user_token');
      const storedUser = await AsyncStorage.getItem('@user_info');
      const storedUrl = await AsyncStorage.getItem('@custom_base_url');

      if (storedUrl) {
        setBaseUrlState(storedUrl);
      }
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.error('Failed to load session data', e);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password) => {
    const data = await loginApi(email, password);
    setToken(data.token);
    setUser(data);
    await AsyncStorage.setItem('@user_token', data.token);
    await AsyncStorage.setItem('@user_info', JSON.stringify(data));
    return data;
  };

  const register = async (name, email, password, role) => {
    const data = await registerApi(name, email, password, role);
    setToken(data.token);
    setUser(data);
    await AsyncStorage.setItem('@user_token', data.token);
    await AsyncStorage.setItem('@user_info', JSON.stringify(data));
    return data;
  };

  const logout = async () => {
    setToken(null);
    setUser(null);
    await AsyncStorage.removeItem('@user_token');
    await AsyncStorage.removeItem('@user_info');
  };

  const setCustomBaseUrl = async (url) => {
    const formattedUrl = url.trim().replace(/\/+$/, '');
    setBaseUrlState(formattedUrl);
    await AsyncStorage.setItem('@custom_base_url', formattedUrl);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        baseUrl,
        isLoading,
        login,
        register,
        logout,
        setCustomBaseUrl,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
