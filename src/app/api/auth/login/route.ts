import { prisma } from "@/lib/prisma";
import { signJwt } from "@/lib/auth";
import { withCORS, handleOptions } from "@/lib/cors";
import bcrypt from "bcrypt";

export function OPTIONS() {
  return handleOptions();
}

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return new Response(JSON.stringify({ error: "Email and password required" }), withCORS({ status: 400, headers: { "content-type": "application/json" } }));
    }

    const user = await prisma.user.findUnique({ where: { email }, include: { tenant: true } });
    if (!user) {
      return new Response(JSON.stringify({ error: "Invalid credentials" }), withCORS({ status: 401, headers: { "content-type": "application/json" } }));
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return new Response(JSON.stringify({ error: "Invalid credentials" }), withCORS({ status: 401, headers: { "content-type": "application/json" } }));
    }

    const token = signJwt({ userId: user.id, tenantId: user.tenantId, role: user.role, email: user.email });

    return new Response(JSON.stringify({ token, user: { email: user.email, role: user.role, tenant: { id: user.tenantId, slug: user.tenant.slug, name: user.tenant.name, plan: user.tenant.plan } } }), withCORS({ headers: { "content-type": "application/json" } }));
  } catch (e) {
    return new Response(JSON.stringify({ error: "Bad Request " + e }), withCORS({ status: 400, headers: { "content-type": "application/json" } }));
  }
}


