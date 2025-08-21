// src/components/providers/ReactQueryProvider.tsx
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export default function ReactQueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Tạo một instance của QueryClient.
  // Chúng ta dùng useState để đảm bảo client này chỉ được tạo một lần duy nhất
  // trong suốt vòng đời của component.
  const [queryClient] = useState(() => new QueryClient());

  return (
    // Cung cấp client cho tất cả các component con
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
