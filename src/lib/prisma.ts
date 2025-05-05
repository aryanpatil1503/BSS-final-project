// src/lib/prisma.ts
import { PrismaClient } from "@/generated/prisma";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";
import ws from "ws";

// Configure Neon serverless driver
neonConfig.webSocketConstructor = ws;
neonConfig.poolQueryViaFetch = true; // use fetch API for serverless environments

declare global {
  // allow global prisma variable in development
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaNeon({ connectionString });

// Temporarily cast options to any to satisfy TypeScript for driverAdapters preview
const prismaOptions: any = { adapter, log: ["query"] };

export const prisma =
  global.prisma ||
  new PrismaClient(prismaOptions);

if (process.env.NODE_ENV !== "production") global.prisma = prisma;
