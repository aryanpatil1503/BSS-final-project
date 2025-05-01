// src/lib/prisma.ts
import { PrismaClient } from "@/generated/prisma";

declare global {
  // allow global prisma variable in development
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ||
  new PrismaClient({ log: ["query"] });

if (process.env.NODE_ENV !== "production") global.prisma = prisma;
