// src/components/layout/Header.tsx (phiên bản cập nhật)
"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContexts";
import { Button } from "@/components/ui/button";
import { Sparkles, Phone, User } from "lucide-react"; // Import icons

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="w-full bg-white border-b border-neutral-200 py-4 px-6 flex items-center justify-between sticky top-0 z-50">
      <Link href="/" className="flex items-center">
        <Sparkles className="text-neutral-800 text-2xl mr-3" />
        <h1 className="text-xl text-neutral-800 font-semibold">Serenity Spa</h1>
      </Link>
      <div className="flex items-center space-x-4">
        <Button
          variant="outline"
          className="border-neutral-300 text-neutral-700"
        >
          <Phone className="mr-2 h-4 w-4" />
          Liên hệ
        </Button>
        {user ? (
          <>
            <span className="text-neutral-700">Chào, {user.name}!</span>
            <Button
              onClick={logout}
              className="bg-neutral-800 text-white hover:bg-neutral-700"
            >
              Đăng xuất
            </Button>
          </>
        ) : (
          <Button
            asChild
            className="bg-neutral-800 text-white hover:bg-neutral-700"
          >
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
