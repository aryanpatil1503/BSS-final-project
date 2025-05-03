'use client';

import React, { useState, useTransition, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

interface Props {
  commentId: string;
  initialContent: string;
}

export default function CommentActions({ commentId, initialContent }: Props) {
  const [openEdit, setOpenEdit] = useState(false);
  const [contentInput, setContentInput] = useState(initialContent);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    const res = await fetch(`/api/comments/${commentId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: contentInput }),
    });
    console.log(`[CommentActions] PATCH commentId=${commentId} status=${res.status} ok=${res.ok}`);
    if (res.ok) {
      startTransition(() => {
        router.refresh();
        setOpenEdit(false);
      });
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this comment?')) return;
    const res = await fetch(`/api/comments/${commentId}`, { method: 'DELETE' });
    console.log(`[CommentActions] DELETE commentId=${commentId} status=${res.status} ok=${res.ok}`);
    if (res.ok) {
      startTransition(() => router.refresh());
    }
  };

  return (
    <>
      <button onClick={() => setOpenEdit(prev => !prev)} className="text-yellow-600 ml-4 text-sm">
        Edit
      </button>
      <button onClick={handleDelete} className="text-red-600 ml-2 text-sm">
        Delete
      </button>
      {openEdit && (
        <form onSubmit={handleSave} className="mt-2 space-y-2 border p-2 rounded">
          <textarea
            className="block w-full border rounded px-2 py-1"
            value={contentInput}
            onChange={e => setContentInput(e.target.value)}
            rows={3}
            required
          />
          <button
            type="submit"
            className="px-3 py-1 bg-yellow-500 text-white rounded disabled:opacity-50"
            disabled={isPending}
          >
            Save
          </button>
          <button
            type="button"
            onClick={() => setOpenEdit(false)}
            className="px-3 py-1 bg-gray-300 text-black rounded ml-2"
          >
            Cancel
          </button>
        </form>
      )}
    </>
  );
}
