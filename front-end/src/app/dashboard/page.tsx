// src/app/dashboard/page.tsx
"use client";

import { useAuth } from "@/contexts/auth-context";

export default function DashboardPage() {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Đang tải thông tin người dùng...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-3xl font-bold">
        🎉 Chào mừng trở lại, {user.name}! 🎉
      </h1>
      <p>Email của bạn: {user.email}</p>
      <p>Vai trò của bạn: {user.role}</p>
      <button
        onClick={logout}
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Đăng xuất
      </button>
    </div>
  );
}
