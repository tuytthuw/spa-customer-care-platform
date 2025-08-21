// src/components/layout/dashboard/Header.tsx
"use client";

import React from "react";
import { useAuth } from "@/contexts/AuthContexts";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm p-4 flex justify-between items-center">
      <div>
        <h1 className="text-xl font-semibold">Chào mừng trở lại!</h1>
      </div>
      <div className="flex items-center">
        <span className="mr-4">Xin chào, {user?.name || "Guest"}</span>
        <Button variant="outline" size="sm" onClick={logout}>
          <LogOut className="w-4 h-4 mr-2" />
          Đăng xuất
        </Button>
      </div>
    </header>
  );
};

export default Header;
