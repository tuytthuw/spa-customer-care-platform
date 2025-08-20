// src/components/layout/Header.tsx (phiên bản cập nhật)
"use client"; // Header cần là Client Component để dùng hook

import Link from "next/link";
import { useAuth } from "@/contexts/auth-context"; // 1. Import useAuth
import { Button } from "../ui/button";

export default function Header() {
  const { user, logout } = useAuth(); // 2. Lấy user và hàm logout từ context

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-primary">
          MySpa
        </Link>
        <div className="hidden md:flex items-center space-x-6">
          <Link href="/" className="hover:text-primary transition-colors">
            Trang chủ
          </Link>
          <Link
            href="/services"
            className="hover:text-primary transition-colors"
          >
            Dịch vụ
          </Link>
          {/* Thêm các link khác nếu cần */}
        </div>
        <div className="flex items-center space-x-2">
          {/* 3. Hiển thị có điều kiện */}
          {user ? (
            <>
              <span>Chào, {user.name}!</span>
              <Button variant="outline" onClick={logout}>
                Đăng xuất
              </Button>
            </>
          ) : (
            <Button asChild>
              <Link href="/auth/login">Đăng nhập</Link>
            </Button>
          )}
        </div>
      </nav>
    </header>
  );
}
