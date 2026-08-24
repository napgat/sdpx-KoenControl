import { PrismaClient } from "@prisma/client";

// ป้องกัน Prisma Client instance หลาย instance ในโหมด development
// (Next.js hot-reload จะสร้าง module ซ้ำ ถ้าไม่ทำแบบนี้จะเกิด connection leak)
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
