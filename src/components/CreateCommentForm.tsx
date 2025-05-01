"use client";

import React, { useState, FormEvent, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Card from '@/components/Card';

interface Props {
  threadId: string;
  parentId?: string;
}

export default function CreateCommentForm({ threadId, parentId }: Props) {
  const [content, setContent] = useState('');
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/threads/${threadId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, parentId }),
      });
      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || 'Error creating comment');
        console.error('Error creating comment:', data.error);
      } else {
        toast.success('Comment posted');
      }
    } catch (err) {
      console.error('Network error:', err);
    }
    setContent('');
    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded shadow-sm">
        <div>
          <label className="block text-sm font-medium">Comment</label>
          <textarea
            className="mt-1 block w-full border rounded px-3 py-2"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
            required
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
          disabled={isPending}
        >
          {isPending ? 'Posting...' : 'Post Comment'}
        </button>
      </form>
    </Card>
  );
}
