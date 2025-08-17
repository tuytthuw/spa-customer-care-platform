"use client";
import { useAuth } from "@/providers/auth-context";
import { useRouter, useSearchParams } from "next/navigation";
import type { Role } from "@/providers/auth-context";

export default function LoginPage() {
  const { loginAs } = useAuth();
  const router = useRouter();
  const next = useSearchParams().get("next") ?? "/";

  const go = (role: Role, href: string) => () => {
    loginAs(role);
    router.push(href || next);
  };

  return (
    <div className="mx-auto max-w-md p-6 space-y-3">
      <h1 className="mb-4 text-2xl font-semibold">Đăng nhập (demo)</h1>
      <button className="underline" onClick={go("CLIENT", "/client")}>
        Vào CLIENT
      </button>
      <br />
      <button className="underline" onClick={go("RECEPTION", "/reception")}>
        Vào RECEPTION
      </button>
      <br />
      <button className="underline" onClick={go("TECH", "/tech")}>
        Vào TECH
      </button>
      <br />
      <button className="underline" onClick={go("ADMIN", "/admin")}>
        Vào ADMIN
      </button>
      <p className="text-xs text-muted-foreground mt-2">
        Sau login sẽ chuyển đến: {next}
      </p>
    </div>
  );
}
