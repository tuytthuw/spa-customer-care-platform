"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { navByRole } from "@/config/nav";
import { useAuth } from "@/providers/auth-context";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const items = user ? navByRole[user.role] ?? [] : [];

  return (
    <div className="flex h-dvh">
      <aside className="w-64 border-r">
        <div className="flex items-center justify-between p-4">
          <div className="font-semibold">Spa Admin</div>
        </div>
        <nav className="space-y-1 p-2">
          {items.map((i) => (
            <Link
              key={i.href}
              href={i.href}
              className="block rounded px-3 py-2 hover:bg-accent"
            >
              {i.label}
            </Link>
          ))}
        </nav>
      </aside>

      <main className="flex-1 overflow-auto p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>{user ? `${user.name} • ${user.role}` : "Khách"}</div>
          {user && (
            <button onClick={logout} className="text-sm underline">
              Đăng xuất
            </button>
          )}
        </div>
        {children}
      </main>
    </div>
  );
}
