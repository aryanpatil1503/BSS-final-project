import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

// PATCH /api/threads/[threadId]
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ threadId: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { threadId } = await params;
  try {
    const { title, content } = await request.json();
    if (!title || !content) {
      return NextResponse.json({ error: 'title and content are required' }, { status: 400 });
    }
    const existing = await prisma.thread.findUnique({ where: { id: threadId } });
    if (!existing) {
      return NextResponse.json({ error: 'Thread not found' }, { status: 404 });
    }
    if (existing.authorId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    const updated = await prisma.thread.update({ where: { id: threadId }, data: { title, content } });
    return NextResponse.json(updated);
  } catch (err: any) {
    console.error('Thread update error:', err);
    return NextResponse.json({ error: err.message || 'Internal error' }, { status: 500 });
  }
}

// DELETE /api/threads/[threadId]
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ threadId: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { threadId } = await params;
  try {
    const existing = await prisma.thread.findUnique({ where: { id: threadId } });
    if (!existing) {
      return NextResponse.json({ error: 'Thread not found' }, { status: 404 });
    }
    if (existing.authorId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    await prisma.thread.delete({ where: { id: threadId } });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Thread delete error:', err);
    return NextResponse.json({ error: err.message || 'Internal error' }, { status: 500 });
  }
}
