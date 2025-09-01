// src/app/(public)/layout.tsx
import Header from "@/components/layout/public/PublicHeader";
import React from "react";
import Chatbot from "@/components/chatbot/Chatbot";
import PublicFooter from "@/components/layout/public/PublicFooter";

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
