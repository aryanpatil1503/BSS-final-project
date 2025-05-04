import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST /api/comments/[commentId]/votes
export async function POST(
  request: Request,
  { params }: { params: Promise<{ commentId: string }> }
) {
  try {
    const { commentId } = await params;
    const { userId, value } = await request.json();
    if (!userId || ![1, -1].includes(value)) {
      return NextResponse.json({ error: "userId and value (1 or -1) required" }, { status: 400 });
    }
    // upsert vote
    const existing = await prisma.vote.findFirst({ where: { userId, commentId } });
    if (existing) {
      await prisma.vote.update({ where: { id: existing.id }, data: { value } });
    } else {
      await prisma.vote.create({ data: { userId, commentId, value } });
    }
    const up = await prisma.vote.count({ where: { commentId, value: 1 } });
    const down = await prisma.vote.count({ where: { commentId, value: -1 } });
    return NextResponse.json({ votes: up - down });
  } catch (err: any) {
    console.error("Comment vote error:", err);
    return NextResponse.json({ error: err.message || "Internal error" }, { status: 500 });
  }
}

// GET /api/comments/[commentId]/votes
export async function GET(
  request: Request,
  { params }: { params: Promise<{ commentId: string }> }
) {
  try {
    const { commentId } = await params;
    const up = await prisma.vote.count({ where: { commentId, value: 1 } });
    const down = await prisma.vote.count({ where: { commentId, value: -1 } });
    return NextResponse.json({ votes: up - down });
  } catch (err: any) {
    console.error("Comment vote GET error:", err);
    return NextResponse.json({ error: err.message || "Internal error" }, { status: 500 });
  }
}
