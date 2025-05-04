import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface Params {
  params: Promise<{ threadId: string }>;
}

// POST /api/threads/[threadId]/votes
export async function POST(request: Request, { params }: Params) {
  const { threadId } = await params;
  try {
    const { userId, value } = await request.json();
    if (!userId || ![1, -1].includes(value)) {
      return NextResponse.json({ error: "userId and value (1 or -1) required" }, { status: 400 });
    }
    // upsert vote
    const existing = await prisma.vote.findFirst({ where: { userId, threadId } });
    if (existing) {
      await prisma.vote.update({ where: { id: existing.id }, data: { value } });
    } else {
      await prisma.vote.create({ data: { userId, threadId, value } });
    }
    const up = await prisma.vote.count({ where: { threadId, value: 1 } });
    const down = await prisma.vote.count({ where: { threadId, value: -1 } });
    return NextResponse.json({ votes: up - down });
  } catch (err: any) {
    console.error("Thread vote error:", err);
    return NextResponse.json({ error: err.message || "Internal error" }, { status: 500 });
  }
}

// GET /api/threads/[threadId]/votes
export async function GET(request: Request, { params }: Params) {
  const { threadId } = await params;
  try {
    const up = await prisma.vote.count({ where: { threadId, value: 1 } });
    const down = await prisma.vote.count({ where: { threadId, value: -1 } });
    return NextResponse.json({ votes: up - down });
  } catch (err: any) {
    console.error("Thread vote GET error:", err);
    return NextResponse.json({ error: err.message || "Internal error" }, { status: 500 });
  }
}
