"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContexts";
import { Button } from "@/components/ui/button";
import { Sparkles, Phone, User } from "lucide-react";

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="w-full bg-card border-b border-border py-4 px-6 flex items-center justify-between sticky top-0 z-50">
      <Link href="/" className="flex items-center">
        <Sparkles className="text-foreground text-2xl mr-3" />
        <h1 className="text-xl text-foreground font-semibold">Serenity Spa</h1>
      </Link>
      <div className="flex items-center space-x-4">
        <Button variant="outline">
          <Phone className="mr-2 h-4 w-4" />
          Liên hệ
        </Button>
        {user ? (
          <>
            <span className="text-muted-foreground">Chào, {user.name}!</span>
            <Button onClick={logout}>Đăng xuất</Button>
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
