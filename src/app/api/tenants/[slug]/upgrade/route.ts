import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { withCORS, handleOptions } from "@/lib/cors";

export function OPTIONS() {
  return handleOptions();
}

export async function POST(req: Request, ctx: { params: Promise<{ slug: string }> }) {
  const auth = requireAuth(req);
  if (auth.role !== "ADMIN") {
    return new Response(JSON.stringify({ error: "Forbidden" }), withCORS({ status: 403, headers: { "content-type": "application/json" } }));
  }

  const { slug } = await ctx.params;
  const tenant = await prisma.tenant.findFirst({ where: { slug } });
  if (!tenant || tenant.id !== auth.tenantId) {
    return new Response(JSON.stringify({ error: "Tenant not found" }), withCORS({ status: 404, headers: { "content-type": "application/json" } }));
  }

  const updated = await prisma.tenant.update({ where: { id: tenant.id }, data: { plan: "PRO" } });
  return new Response(JSON.stringify({ tenant: updated }), withCORS({ headers: { "content-type": "application/json" } }));
}


