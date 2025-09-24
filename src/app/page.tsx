"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) router.replace("/notes");
    else router.replace("/login");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center p-8" style={{ background: "linear-gradient(180deg, #0b0b0b 0%, #121212 100%)" }}>
      <div className="h-4 w-32 rounded bg-[#1a1a1a] animate-pulse" />
    </div>
  );
}
