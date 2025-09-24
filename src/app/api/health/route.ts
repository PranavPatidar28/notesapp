import { withCORS, handleOptions } from "@/lib/cors";

export function OPTIONS() {
  return handleOptions();
}

export async function GET() {
  return new Response(JSON.stringify({ status: "ok" }), withCORS({
    headers: { "content-type": "application/json" },
  }));
}


