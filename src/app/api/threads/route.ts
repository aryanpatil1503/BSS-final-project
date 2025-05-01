import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';

// GET /api/threads?cursor=<id>&limit=<number>
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const cursor = searchParams.get("cursor");
  const limit = parseInt(searchParams.get("limit") || "10", 10);

  const items = await prisma.thread.findMany({
    take: limit + 1,
    cursor: cursor ? { id: cursor } : undefined,
    orderBy: { createdAt: "desc" },
    include: {
      author: { select: { id: true, name: true } },
      _count: { select: { votes: true, comments: true } },
    },
  });

  let nextCursor: string | null = null;
  if (items.length > limit) {
    const next = items.pop();
    nextCursor = next?.id ?? null;
  }

  return NextResponse.json({ items, nextCursor });
}

// POST /api/threads
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { title, content } = await request.json();

    if (!title || !content) {
      return NextResponse.json(
        { error: "title and content are required" },
        { status: 400 }
      );
    }

    const thread = await prisma.thread.create({
      data: { title, content, authorId: session.user.id },
    });

    return NextResponse.json(thread, { status: 201 });
  } catch (err: any) {
    console.error("Failed to create thread:", err);
    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
