// src/context/AuthProvider.tsx
import React, { useState, useEffect, type ReactNode } from "react";
import { AuthContext } from "./AuthContext";
import type { User } from "../types/types";

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("auth");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setUser(parsed);
      } catch (e) {
        console.error("Failed to parse auth from localStorage", e);
        localStorage.removeItem("auth");
      }
    }
  }, []);

  const login = (loggedInUser: User) => {
    setUser(loggedInUser);
    localStorage.setItem("auth", JSON.stringify(loggedInUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("auth");
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem("auth", JSON.stringify(updatedUser));
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    if (!user) throw new Error("No user logged in");

    // Get stored password from localStorage
    const stored = localStorage.getItem("auth");
    if (!stored) throw new Error("No stored credentials");

    const storedUser = JSON.parse(stored);
    
    // Verify current password
    if (storedUser.password !== currentPassword) {
      throw new Error("Current password is incorrect");
    }

    // Update password
    const updatedUser = { ...user, password: newPassword };
    setUser(updatedUser);
    localStorage.setItem("auth", JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        updateUser,
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};