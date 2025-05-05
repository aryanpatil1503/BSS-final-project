'use client';

import React from 'react';
import Link from 'next/link';
import VoteSection from '@/components/VoteSection';
import { useSession, signIn } from 'next-auth/react';

export interface Thread {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  author: { id: string; name: string };
  _count: { votes: number; comments: number };
}

interface Props {
  threads: Thread[];
  users: { id: string; name: string }[];
}

export default function ThreadList({ threads, users }: Props) {
  const { data: session } = useSession();
  if (!session) {
    return (
      <div className="text-center py-8">
        <p className="mb-4 text-gray-500 dark:text-gray-400">Please sign in to view reviews.</p>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded"
          onClick={() => signIn(undefined, { callbackUrl: '/threads' })}
        >
          Sign In
        </button>
      </div>
    );
  }
  if (threads.length === 0) {
    return <p className="text-center text-gray-500">No threads yet.</p>;
  }
  return (
    <ul className="space-y-4">
      {threads.map((thread) => (
        <li
          key={thread.id}
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 rounded hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          <Link href={`/threads/${thread.id}`} className="text-lg font-semibold text-blue-600">
            {thread.title}
          </Link>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            by {thread.author.name} • {thread._count.comments} comments • {thread._count.votes} votes
          </div>
          <VoteSection threadId={thread.id} users={users} />
        </li>
      ))}
    </ul>
  );
}
