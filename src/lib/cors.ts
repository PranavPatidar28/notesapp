export function withCORS(init?: ResponseInit): ResponseInit {
  const headers = new Headers(init?.headers || {});
  headers.set("access-control-allow-origin", "*");
  headers.set("access-control-allow-methods", "GET,POST,PUT,DELETE,OPTIONS");
  headers.set("access-control-allow-headers", "content-type,authorization");
  return { ...init, headers };
}

export function handleOptions(): Response {
  return new Response(null, withCORS({ status: 204 }));
}


