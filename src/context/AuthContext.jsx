import { useMemo, useState, useEffect, useCallback } from "react";
import AuthContext from "./auth-context";
import apiClient from "../lib/apiClient";
import {
  clearStoredUser,
  clearToken,
  getStoredUser,
  getToken,
  setStoredUser,
  setToken as setStoredToken,
} from "../utils/storage.utils";

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => getToken());
  const [isInitialized, setIsInitialized] = useState(false);
  const [user, setUser] = useState(() => getStoredUser());

  const logout = useCallback(() => {
    clearToken();
    clearStoredUser();
    setToken(null);
    setUser(null);
  }, []);

  const fetchMe = useCallback(async () => {
    try {
      const { data } = await apiClient.get("users/me");
      setStoredUser(data);
      setUser(data);
      return data;
    } catch (error) {
      if (error.response?.status === 401) {
        logout();
      }
      throw error;
    }
  }, [logout]);

  const applyAuth = (data) => {
    // Handle DummyJSON response format (accessToken) vs backend format (token)
    const token = data.token || data.accessToken;
    const user = data.user || data;
    
    if (!token) return data;
    
    setStoredToken(token);
    setStoredUser(user);
    setToken(token);
    setUser(user);
    return data;
  };

  const login = async (credentials) => {
    const { data } = await apiClient.post("auth/login", credentials);
    applyAuth(data);
    
    // DummyJSON already returns user data, skip fetchMe for now
    // When switching to real backend, uncomment this:
    // await fetchMe();
    
    return data;
  };

  const registerUser = async (payload) => {
    const { data } = await apiClient.post("users/add", payload);
    return data.user;
  };

  // Single bootstrap effect
  useEffect(() => {
    const bootstrap = async () => {
      if (token && !user) {
        try {
          await fetchMe();
        } catch (e) {
          console.error("Bootstrap failed", e);
        }
      }
      setIsInitialized(true);
    };

    bootstrap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo(
    () => ({ token, user, login, registerUser, fetchMe, logout, isInitialized }),
    //eslint-disable-next-line react-hooks/exhaustive-deps
    [token, user, isInitialized, fetchMe, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
