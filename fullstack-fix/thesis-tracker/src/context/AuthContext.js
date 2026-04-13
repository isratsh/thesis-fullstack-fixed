import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { authAPI } from "../services/api";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restore = async () => {
      const token = localStorage.getItem("token");
      if (!token) { setLoading(false); return; }
      try {
        const res = await authAPI.getMe();
        setUser(res.data.user);
        localStorage.setItem("userName", res.data.user.name || "");
      } catch (err) {
        console.warn("Session restore failed:", err.message);
        localStorage.removeItem("token");
        localStorage.removeItem("userName");
      } finally {
        setLoading(false);
      }
    };
    restore();
  }, []);

  const login = useCallback(async (userId, password) => {
    const res = await authAPI.login({ userId, password });
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("userName", res.data.user.name || "");
    setUser(res.data.user);
    return res.data.user;
  }, []);

  const register = useCallback(async (userData) => {
    const res = await authAPI.register(userData);
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("userName", res.data.user.name || "");
    setUser(res.data.user);
    return res.data.user;
  }, []);

  const logout = useCallback(() => {
    localStorage.clear();
    setUser(null);
    window.location.href = "/";
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const res = await authAPI.getMe();
      setUser(res.data.user);
      localStorage.setItem("userName", res.data.user.name || "");
    } catch (err) {
      console.warn("Refresh failed:", err.message);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}
