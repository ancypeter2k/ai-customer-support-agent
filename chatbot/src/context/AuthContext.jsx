import React, { createContext, useState } from "react";
import api from "../service/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const fetchMe = async () => {
    try {
      const resp = await api.get("/auth/me");
      if (resp?.data?.user) setUser(resp.data.user);
      else setUser(null);
    } catch (err) {
      setUser(null);
    }
  };

  const signup = async ({ name, email, password }) => {
    const resp = await api.post("/auth/signup", { name, email, password });
    setUser(resp.data);
    return resp.data;
  };

  const login = async ({ email, password }) => {
    const resp = await api.post("/auth/login", { email, password });
    setUser(resp.data);
    return resp.data;
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.error("Logout error:", err.message);
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, fetchMe, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
