// src/context/AuthContext.tsx
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
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [unseenCount, setUnseenCount] = useState(0);

  const fetchUnseenCount = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/messages`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const unseen = res.data.filter((m: any) => !m.hasViewed).length;
      setUnseenCount(unseen);
    } catch (err) {
      console.error("Failed to fetch unseen messages");
    }
  };

  const login = (token: string) => {
    localStorage.setItem("token", token);
    setIsLoggedIn(true);
    fetchUnseenCount(); // Fetch inbox count after login
  };

  const logout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setUnseenCount(0);
  };

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
