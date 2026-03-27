import { useMemo, useState, useEffect, useCallback } from "react";
import AuthContext from "./auth-context";
import apiClient from "../lib/apiClient";

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [isInitialized, setIsInitialized] = useState(false);
  const [user, setUser] = useState(() => {
    const u = localStorage.getItem("user");
    if (!u || u === "undefined" || u === "null") {
      localStorage.removeItem("user");
      return null;
    }
    try {
      return JSON.parse(u);
    } catch {
      localStorage.removeItem("user");
      return null;
    }
  });

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  }, []);

  const fetchMe = useCallback(async () => {
    try {
      const { data } = await apiClient.get("users/me");
      localStorage.setItem("user", JSON.stringify(data));
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
    const { token, user } = data;
    if (!token) return data;
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setToken(token);
    setUser(user);
    return data;
  };

  const login = async (credentials) => {
    const { data } = await apiClient.post("auth/login", credentials);
    applyAuth(data);
    await fetchMe();
    return data;
  };

  const registerUser = async (payload) => {
    const { data } = await apiClient.post("auth/register", payload);
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
