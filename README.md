Notes App (Multi-tenant)

Production-ready multi-tenant Notes application with JWT auth, role-based access, subscription gating (Free vs Pro), and CRUD APIs. Built with Next.js, Prisma (Postgres), TailwindCSS.

# Multi-Tenancy Approach
- Shared database schema with a `tenantId` column on multi-tenant tables (`User`, `Note`).
- All queries are scoped by `tenantId` derived from the JWT payload to ensure strict isolation.
- Tenants are identified by `slug` (e.g., `acme`, `globex`).

# Tech Stack
- Next.js 15 (App Router, TypeScript)
- Prisma ORM
- PostgreSQL (Neon) in production;
- JWT (`jsonwebtoken`), password hashing with `bcrypt`
- TailwindCSS

# Environment Variables
```
DATABASE_URL="postgresql://example.com"
JWT_SECRET="averystrongsecretthatcannotbeguessed"
```

# Install & Run Locally
```
npm install
npx prisma generate
npm run prisma:migrate
npm run db:seed
npm run dev
```
Open `http://localhost:3000`.


What is covered:
- Health check, authentication and JWT payload shape
- Tenant isolation and role-based restrictions (upgrade endpoint)
- Free-plan subscription limits and post-upgrade behavior
- Notes CRUD API and frontend smoke (login, list, create, delete, upgrade CTA)

# Seeded Accounts (password: password)
- admin@acme.test → Admin (tenant Acme)
- user@acme.test → Member (tenant Acme)
- admin@globex.test → Admin (tenant Globex)
- user@globex.test → Member (tenant Globex)

# API Endpoints
- `GET /api/health` → `{ "status":"ok" }`
- Auth: `POST /api/auth/login`
- Notes:
  - `POST /api/notes` → Create note (Free plan: max 3 notes/tenant)
  - `GET /api/notes` → List notes (tenant-scoped)
  - `GET /api/notes/:id` → Get note (tenant-scoped)
  - `PUT /api/notes/:id` → Update note (tenant-scoped)
  - `DELETE /api/notes/:id` → Delete note (tenant-scoped)
- Tenant Upgrade: `POST /api/tenants/:slug/upgrade` (Admin-only) → Upgrades to Pro immediately (removes note cap)

All APIs include permissive CORS for demo purposes.

# Frontend
- `/login` page stores JWT in localStorage on success.
- `/notes` page lists/creates/deletes notes. Shows an Upgrade banner when the Free-plan limit is reached and calls the upgrade endpoint.
- Logout clears localStorage and redirects to `/login`.

# Deployment (Vercel)
1. Create a Postgres database (Neon/Supabase) and set `DATABASE_URL` and `DATABASE_PROVIDER=postgresql` in Vercel Project Environment Variables along with `JWT_SECRET`.
2. In Vercel, set build command to `npm run build` and install command to `npm install` (default is fine).
3. After first deploy, run migrations and seed from your local machine against the same database:
   ```
   # locally
   npm install
   npx prisma generate
   npm run prisma:migrate
   npm run db:seed
   ```
4. Re-deploy if needed; the app is ready.

# Notes
- Tenant isolation is enforced in all API routes by filtering with `tenantId` from the JWT.
- Free vs Pro plan gating is implemented in `POST /api/notes`.
- Admin-only upgrade in `POST /api/tenants/:slug/upgrade` validates both role and tenant ownership.
