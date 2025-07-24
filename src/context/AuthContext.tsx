// src/context/AuthContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

interface AuthContextType {
  isLoggedIn: boolean;
  unseenCount: number;
  login: (token: string) => void;
  logout: () => void;
  fetchUnseenCount: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [unseenCount, setUnseenCount] = useState(0);

  const fetchUnseenCount = async () => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (!token) return;
      const res = await axios.get(`/api/messages`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const unseen = res.data.filter((m: any) => !m.hasViewed).length;
      setUnseenCount(unseen);
    } catch (err) {
      console.error("Failed to fetch unseen messages");
    }
  };

  const login = (token: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("token", token);
      setIsLoggedIn(true);
      fetchUnseenCount(); // Fetch inbox count after login
    }
  };

  const logout = () => {
    if (typeof window !== "undefined") {
      localStorage.clear();
      setIsLoggedIn(false);
      setUnseenCount(0);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsLoggedIn(!!localStorage.getItem("token"));
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn) fetchUnseenCount();
  }, [isLoggedIn]);

  return (
    <AuthContext.Provider value={{ isLoggedIn, unseenCount, login, logout, fetchUnseenCount }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside an AuthProvider");
  return context;
};
