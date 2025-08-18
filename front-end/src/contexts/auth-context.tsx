// src/contexts/auth-context.tsx
"use client";

import { createContext, useContext, useState, ReactNode } from "react";

// Định nghĩa kiểu dữ liệu cho người dùng
interface User {
  name: string;
  email: string;
  // Thêm các thuộc tính khác nếu cần, ví dụ: role
}

// Định nghĩa những gì Context sẽ cung cấp
interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
}

// Tạo Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Tạo Provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (userData: User) => {
    setUser(userData);
    // Ở đây có thể thêm logic lưu vào localStorage để duy trì đăng nhập
  };

  const logout = () => {
    setUser(null);
    // Xóa thông tin trong localStorage
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Tạo custom hook để dễ dàng sử dụng Context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
