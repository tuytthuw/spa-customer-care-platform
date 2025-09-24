// src/app/(public)/layout.tsx
import Header from "@/features/shared/layout/public/PublicHeader";
import React from "react";
import Chatbot from "@/features/chatbot/components/Chatbot";
import PublicFooter from "@/features/shared/layout/public/PublicFooter";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main>{children}</main>
      <Chatbot />
      <PublicFooter />
    </div>
  );
}
