// src/components/layout/public/PublicHeader.tsx

"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContexts";
import { Button } from "@/components/ui/button";
import { Sparkles, Phone, User } from "lucide-react";
import { usePathname } from "next/navigation"; // 1. Import usePathname
import { cn } from "@/lib/utils"; // Import cn utility

// 2. Định nghĩa các link điều hướng
const navLinks = [
  { href: "/", label: "Trang Chủ" },
  { href: "/services", label: "Dịch Vụ" },
  { href: "/treatment-plans", label: "Liệu Trình" },
  { href: "/products", label: "Sản Phẩm" },
  { href: "/about", label: "Giới Thiệu" },
];

export default function Header() {
  const { user, logout } = useAuth();
  const pathname = usePathname(); // 3. Lấy đường dẫn hiện tại

  return (
    <header className="w-full bg-card border-b border-border py-4 px-6 flex items-center justify-between sticky top-0 z-50">
      {/* Logo */}
      <Link href="/" className="flex items-center">
        <Sparkles className="text-foreground text-2xl mr-3" />
        <h1 className="text-xl text-foreground font-semibold">Serenity Spa</h1>
      </Link>

      {/* 4. Thêm Menu Điều Hướng */}
      <nav className="hidden md:flex gap-6">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium text-muted-foreground transition-colors hover:text-primary",
                isActive && "text-primary"
              )}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Các Nút Hành Động */}
      <div className="flex items-center space-x-4">
        <Button variant="outline">
          <Phone className="mr-2 h-4 w-4" />
          Hotline: 1900 9424
        </Button>
        {user ? (
          <>
            <span className="text-muted-foreground">Chào, {user.name}!</span>
            <Button asChild>
              <Link href="/dashboard">Dashboard</Link>
            </Button>
            <Button onClick={logout} variant="secondary">
              Đăng xuất
            </Button>
          </>
        ) : (
          <Button asChild>
            <Link href="/auth/login">
              <User className="mr-2 h-4 w-4" />
              Đăng nhập
            </Link>
          </Button>
        )}
      </div>
    </header>
  );
}
