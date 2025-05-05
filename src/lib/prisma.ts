// src/lib/prisma.ts
import { PrismaClient } from "@/generated/prisma";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";
import WebSocket from "ws";

// Configure Neon serverless driver
// Use HTTP fetch on Vercel/serverless, else WebSocket for dev
if (process.env.VERCEL) {
  neonConfig.poolQueryViaFetch = true;
} else {
  neonConfig.webSocketConstructor = WebSocket;
}

declare global {
  // allow global prisma variable in development
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Use the unpooled connection string for WebSocket adapter, fallback to pooled
const connectionString = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL!;

const adapter = new PrismaNeon({ connectionString });

// Temporarily cast options to any to satisfy TypeScript for driverAdapters preview
const prismaOptions: any = { adapter, log: ["query"] };

export const prisma =
  global.prisma ||
  new PrismaClient(prismaOptions);

if (process.env.NODE_ENV !== "production") global.prisma = prisma;
