// src/context/AuthProvider.tsx
import React, { useState, useEffect, type ReactNode } from "react";
import { AuthContext, type User } from "./AuthContext";

interface Props {
  children: ReactNode;
}

const AuthProvider: React.FC<Props> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("blogUser");
    return saved ? JSON.parse(saved) : null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("blogUser") !== null;
  });

  const login = (userData: User) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem("blogUser", JSON.stringify(userData)); // LƯU
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("blogUser"); // XÓA
  };

  // Đồng bộ nếu mở nhiều tab
  useEffect(() => {
    const handleStorage = () => {
      const saved = localStorage.getItem("blogUser");
      if (saved) {
        setUser(JSON.parse(saved));
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;