import { PrismaClient, Role, Plan } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const password = "password";
  const passwordHash = await bcrypt.hash(password, 10);

  // Upsert tenants
  const acme = await prisma.tenant.upsert({
    where: { slug: "acme" },
    update: {},
    create: { name: "Acme", slug: "acme", plan: Plan.FREE },
  });

  const globex = await prisma.tenant.upsert({
    where: { slug: "globex" },
    update: {},
    create: { name: "Globex", slug: "globex", plan: Plan.FREE },
  });

  // Users for Acme
  await prisma.user.upsert({
    where: { email: "admin@acme.test" },
    update: {},
    create: {
      email: "admin@acme.test",
      passwordHash,
      role: Role.ADMIN,
      tenantId: acme.id,
    },
  });

  await prisma.user.upsert({
    where: { email: "user@acme.test" },
    update: {},
    create: {
      email: "user@acme.test",
      passwordHash,
      role: Role.MEMBER,
      tenantId: acme.id,
    },
  });

  // Users for Globex
  await prisma.user.upsert({
    where: { email: "admin@globex.test" },
    update: {},
    create: {
      email: "admin@globex.test",
      passwordHash,
      role: Role.ADMIN,
      tenantId: globex.id,
    },
  });

  await prisma.user.upsert({
    where: { email: "user@globex.test" },
    update: {},
    create: {
      email: "user@globex.test",
      passwordHash,
      role: Role.MEMBER,
      tenantId: globex.id,
    },
  });

  console.log("Seed completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


