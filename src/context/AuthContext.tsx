import { createContext } from "react";

export interface User {
  name: string;
  email: string;
  role: "admin" | "user";
    password?: string;
  avatarUrl?: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (userData: User) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
