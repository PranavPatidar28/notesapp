import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { withCORS, handleOptions } from "@/lib/cors";

export function OPTIONS() {
  return handleOptions();
}

export async function GET(req: Request) {
  const auth = requireAuth(req);
  const notes = await prisma.note.findMany({
    where: { tenantId: auth.tenantId },
    orderBy: { createdAt: "desc" },
  });
  return new Response(JSON.stringify({ notes }), withCORS({ headers: { "content-type": "application/json" } }));
}

export async function POST(req: Request) {
  const auth = requireAuth(req);
  const tenant = await prisma.tenant.findUnique({ where: { id: auth.tenantId } });
  if (!tenant) return new Response(JSON.stringify({ error: "Tenant not found" }), withCORS({ status: 404, headers: { "content-type": "application/json" } }));

  const body = await req.json();
  const title = (body?.title ?? "").toString();
  const content = (body?.content ?? "").toString();
  if (!title) return new Response(JSON.stringify({ error: "Title required" }), withCORS({ status: 400, headers: { "content-type": "application/json" } }));

  if (tenant.plan === "FREE") {
    const count = await prisma.note.count({ where: { tenantId: auth.tenantId } });
    if (count >= 3) {
      return new Response(JSON.stringify({ error: "Free plan limit reached", limit: 3 }), withCORS({ status: 402, headers: { "content-type": "application/json" } }));
    }
  }

  const note = await prisma.note.create({
    data: { title, content, tenantId: auth.tenantId, authorId: auth.userId },
  });
  return new Response(JSON.stringify({ note }), withCORS({ status: 201, headers: { "content-type": "application/json" } }));
}


