import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { withCORS, handleOptions } from "@/lib/cors";

export function OPTIONS() {
  return handleOptions();
}

export async function GET(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const auth = requireAuth(req);
  const { id } = await ctx.params;
  const note = await prisma.note.findFirst({ where: { id, tenantId: auth.tenantId } });
  if (!note) return new Response(JSON.stringify({ error: "Not found" }), withCORS({ status: 404, headers: { "content-type": "application/json" } }));
  return new Response(JSON.stringify({ note }), withCORS({ headers: { "content-type": "application/json" } }));
}

export async function PUT(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const auth = requireAuth(req);
  const { id } = await ctx.params;
  const existing = await prisma.note.findFirst({ where: { id, tenantId: auth.tenantId } });
  if (!existing) return new Response(JSON.stringify({ error: "Not found" }), withCORS({ status: 404, headers: { "content-type": "application/json" } }));
  const body = await req.json();
  const title = body?.title ?? existing.title;
  const content = body?.content ?? existing.content;
  const note = await prisma.note.update({ where: { id: existing.id }, data: { title, content } });
  return new Response(JSON.stringify({ note }), withCORS({ headers: { "content-type": "application/json" } }));
}

export async function DELETE(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const auth = requireAuth(req);
  const { id } = await ctx.params;
  const existing = await prisma.note.findFirst({ where: { id, tenantId: auth.tenantId } });
  if (!existing) return new Response(JSON.stringify({ error: "Not found" }), withCORS({ status: 404, headers: { "content-type": "application/json" } }));
  await prisma.note.delete({ where: { id: existing.id } });
  return new Response(null, withCORS({ status: 204 }));
}


