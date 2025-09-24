"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { loginRequest, ApiError } from "@/lib/api";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await loginRequest(email, password);
      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));
      router.push("/notes");
    } catch (err: unknown) {
      const e = err as ApiError;
      setError(e?.error || (e.status === 401 ? "Invalid email or password" : "Login failed"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: "linear-gradient(180deg, #0b0b0b 0%, #121212 100%)" }}>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <h1 className="text-2xl font-semibold">Sign in</h1>
          <p className="text-sm text-[#9a9a9a]">Use one of the seeded accounts</p>
        </CardHeader>
        <CardContent>
          {error && <p className="text-rose-500 text-sm mb-3">{error}</p>}
          <form onSubmit={onSubmit} className="space-y-4">
            <Input label="Email" value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
            <Input label="Password" value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
            <Button type="submit" className="w-full" isLoading={loading}>Sign In</Button>
          </form>
          <div className="text-xs text-[var(--muted)] mt-4 space-y-1">
            <div>admin@acme.test / password</div>
            <div>user@acme.test / password</div>
            <div>admin@globex.test / password</div>
            <div>user@globex.test / password</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


