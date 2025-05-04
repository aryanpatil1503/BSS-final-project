import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

interface Params {
  params: Promise<{ threadId: string }>;
}

// GET /api/threads/[threadId]/comments
export async function GET(request: Request, { params }: Params) {
  const { threadId } = await params;
  const comments = await prisma.comment.findMany({
    where: { threadId, parentId: null },
    orderBy: { createdAt: "asc" },
    include: {
      author: { select: { id: true, name: true } },
      votes: true,
      replies: {
        orderBy: { createdAt: "asc" },
        include: {
          author: { select: { id: true, name: true } },
          votes: true,
        },
      },
    },
  });
  return NextResponse.json(comments);
}

// POST /api/threads/[threadId]/comments
export async function POST(request: Request, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const { content, parentId } = await request.json();
    if (!content) {
      return NextResponse.json({ error: "content is required" }, { status: 400 });
    }
    const { threadId } = await params;
    const comment = await prisma.comment.create({
      data: {
        content,
        threadId,
        authorId: session.user.id,
        parentId: parentId ?? null,
      },
      include: {
        author: { select: { id: true, name: true } },
        votes: true,
      },
    });
    return NextResponse.json(comment, { status: 201 });
  } catch (err: any) {
    console.error("Failed to create comment:", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
