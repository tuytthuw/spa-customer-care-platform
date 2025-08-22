// src/app/(public)/layout.tsx
import Header from "@/components/layout/public/PublicHeader";
import React from "react";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Header />
      <main>{children}</main>
      {/* Bạn cũng có thể thêm Footer chung ở đây nếu muốn */}
    </div>
  );
}
