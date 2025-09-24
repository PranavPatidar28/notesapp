import jwt from "jsonwebtoken";

export type JwtPayload = {
  userId: string;
  tenantId: string;
  role: "ADMIN" | "MEMBER";
  email: string;
};

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-in-prod";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

export function signJwt(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions);
}

export function verifyJwt(token?: string): JwtPayload | null {
  if (!token) return null;
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch (e) {
    return null;
  }
}

export function getAuthFromRequest(req: Request): JwtPayload | null {
  const auth = req.headers.get("authorization");
  if (!auth) return null;
  const [scheme, token] = auth.split(" ");
  if (scheme !== "Bearer") return null;
  return verifyJwt(token);
}

export function requireAuth(req: Request): JwtPayload {
  const payload = getAuthFromRequest(req);
  if (!payload) {
    throw new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "content-type": "application/json" },
    });
  }
  return payload;
}


