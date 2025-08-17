"use client";

import { ReactNode, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/providers/auth-context";
import type { Role } from "@/providers/auth-context";

export default function RoleGate({
  require = [],
  children,
}: {
  require?: Role[];
  children: ReactNode;
}) {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!user)
      router.replace(`/auth/login?next=${encodeURIComponent(pathname)}`);
    else if (require.length && !require.includes(user.role))
      router.replace("/403");
  }, [user, require, router, pathname]);

  if (!user) return null;
  if (require.length && !require.includes(user.role)) return null;
  return <>{children}</>;
}
