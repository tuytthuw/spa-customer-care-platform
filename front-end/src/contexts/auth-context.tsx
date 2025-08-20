// src/contexts/auth-context.tsx
"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

// 1. Thêm 'id' vào interface User
export interface User {
  id: string; // Bắt buộc phải có id
  name: string;
  email: string;
  role: "customer" | "technician" | "receptionist" | "manager";
  phone?: string;
}

// Định nghĩa này đã đúng
interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // Thêm useEffect để lấy thông tin user từ localStorage khi tải lại trang
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse user from localStorage", error);
        localStorage.removeItem("user");
      }
    }
  }, []);

  // 2. Sửa hàm login để nhận vào một đối tượng User đầy đủ
  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // 3. Hoàn thiện hàm logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    // Điều hướng người dùng về trang đăng nhập
    window.location.href = "/auth/login";
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
