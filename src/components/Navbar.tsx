"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";

type User = { role?: string; tenant?: { name?: string } };

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("user");
      setUser(raw ? JSON.parse(raw) : null);
    } catch {
      setUser(null);
    }
  }, []);

  const tenantName = user?.tenant?.name ?? "Notes";
  const role = user?.role ?? "";

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.replace("/login");
  }

  return (
    <div className="w-full sticky top-0 z-10 border-b border-[#2a2a2a] bg-[#0f0f0f]/90 backdrop-blur">
      <div className="max-w-5xl mx-auto flex items-center justify-between px-4 h-14">
        <div className="font-semibold tracking-tight">{tenantName} <span className="text-[#9a9a9a]">Notes</span></div>
        <div className="flex items-center gap-3">
          {role && <span className="text-xs px-2 py-1 rounded-full bg-[#1a1a1a] border border-[#2a2a2a] text-[#cfcfcf]">{role}</span>}
          <Button variant="outline" size="sm" onClick={logout}>Logout</Button>
        </div>
      </div>
    </div>
  );
}


