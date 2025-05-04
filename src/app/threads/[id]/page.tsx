import React from 'react';
import CreateCommentForm from '@/components/CreateCommentForm';
import CommentList from '@/components/CommentList';
import ThreadActions from '@/components/ThreadActions';
import { prisma } from '@/lib/prisma';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default async function ThreadPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const thread = await prisma.thread.findUnique({
    where: { id },
    include: {
      author: { select: { id: true, name: true } },
      _count: { select: { comments: true, votes: true } },
    },
  });
  if (!thread) {
    return <div>Thread not found.</div>;
  }

  const comments = await prisma.comment.findMany({
    where: { threadId: id, parentId: null },
    orderBy: { createdAt: 'asc' },
    include: {
      author: { select: { id: true, name: true } },
      votes: { select: { id: true } },
      replies: {
        orderBy: { createdAt: 'asc' },
        include: {
          author: { select: { id: true, name: true } },
          votes: { select: { id: true } },
        },
      },
    },
  });

  const users = await prisma.user.findMany({ select: { id: true, name: true } });

  // Fetch sentiment classification
  const baseUrl = process.env.NEXTAUTH_URL!;
  const sentimentRes = await fetch(`${baseUrl}/api/threads/${id}/sentiment`, { cache: 'no-store' });
  const { sentiment } = await sentimentRes.json();

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6">
      <div className="border-b pb-4">
        <h1 className="text-2xl font-bold">{thread.title}</h1>
        <p className="text-sm text-gray-600">
          by {thread.author.name} • {thread._count.comments} comments • {thread._count.votes} votes
        </p>
        <div className="mt-4">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {thread.content}
          </ReactMarkdown>
          <ThreadActions threadId={id} title={thread.title} content={thread.content} authorId={thread.author.id} users={users} />
          <p className="mt-2 text-sm font-medium">Sentiment: {sentiment}</p>
        </div>
      </div>

      <section>
        <h2 className="text-xl font-semibold mb-2">Add a Comment</h2>
        <CreateCommentForm threadId={id} />
      </section>

      <section>
        <h2 className="text-xl mb-2">Comments</h2>
        <CommentList comments={comments} users={users} threadId={id} />
      </section>
    </main>
  );
}
