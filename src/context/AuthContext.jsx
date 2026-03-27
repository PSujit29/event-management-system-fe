import { useMemo, useState } from "react";
import AuthContext from "./auth-context";
import apiClient from "../lib/apiClient";

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
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

  const applyAuth = (data) => {
    const { token, user } = data;
    if (!token) return data;
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setToken(token);
    setUser(user);
    return data;
  };

  // api endpoint for dummyjson, remove once backend is ready

  const registerUser = async (payload) => {
    const { data } = await apiClient.post("auth/register", payload);
    return data.user;
  };

  const fetchMe = async () => {
    const { data } = await apiClient.get("users/me");
    localStorage.setItem("user", JSON.stringify(data));
    setUser(data);
    return data;
  };
  const login = async (credentials) => {
    const { data } = await apiClient.post("auth/login", credentials);
    applyAuth(data);
    await fetchMe();
    return data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({ token, user, login, registerUser, fetchMe, logout }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
