'use client';

import React, { useState, FormEvent, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function CreateThreadForm() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/threads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content }),
      });
      if (!res.ok) {
        const data = await res.json();
        console.error('Error creating thread:', data.error);
        toast.error('Error creating thread');
      } else {
        toast.success('Thread created successfully');
      }
    } catch (err) {
      console.error('Network error:', err);
      toast.error('Network error');
    }
    setTitle('');
    setContent('');
    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white dark:bg-gray-800 dark:text-gray-100 p-6 rounded shadow-sm">
      <div>
        <label className="block text-sm font-medium text-gray-900 dark:text-gray-300">Title</label>
        <input
          className="mt-1 block w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded px-3 py-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-900 dark:text-gray-300">Content</label>
        <textarea
          className="mt-1 block w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded px-3 py-2"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          required
        />
      </div>
      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
        disabled={isPending}
      >
        {isPending ? 'Posting...' : 'Post Thread'}
      </button>
    </form>
  );
}
