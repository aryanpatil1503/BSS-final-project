'use client';

import React, { useState, useTransition, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

interface Props {
  threadId: string;
  title: string;
  content: string;
  authorId: string;
  users: { id: string; name: string }[];
}

export default function ThreadActions({ threadId, title, content, authorId, users }: Props) {
  const [openEdit, setOpenEdit] = useState(false);
  const [titleInput, setTitleInput] = useState(title);
  const [contentInput, setContentInput] = useState(content);
  const [selectedAuthorId, setSelectedAuthorId] = useState(authorId);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    const res = await fetch(`/api/threads/${threadId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: titleInput, content: contentInput, userId: selectedAuthorId }),
    });
    if (res.ok) {
      startTransition(() => {
        router.refresh();
        setOpenEdit(false);
      });
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this thread?')) return;
    const res = await fetch(`/api/threads/${threadId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: selectedAuthorId }),
    });
    if (res.ok) {
      startTransition(() => router.push('/'));
    }
  };

  return (
    <>
      <button onClick={() => setOpenEdit(prev => !prev)} className="text-yellow-600 ml-4">
        Edit
      </button>
      <button onClick={handleDelete} className="text-red-600 ml-4">
        Delete
      </button>
      {openEdit && (
        <form onSubmit={handleSave} className="mt-4 space-y-4 border p-4 rounded">
          <div>
            <label className="block text-sm font-medium">Title</label>
            <input
              className="mt-1 block w-full border rounded px-3 py-2"
              value={titleInput}
              onChange={e => setTitleInput(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Content</label>
            <textarea
              className="mt-1 block w-full border rounded px-3 py-2"
              value={contentInput}
              onChange={e => setContentInput(e.target.value)}
              rows={4}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Author</label>
            <select
              className="mt-1 block w-full border rounded px-3 py-2"
              value={selectedAuthorId}
              onChange={e => setSelectedAuthorId(e.target.value)}
              required
            >
              {users.map(u => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-yellow-500 text-white rounded disabled:opacity-50"
            disabled={isPending}
          >
            Save
          </button>
          <button
            type="button"
            onClick={() => setOpenEdit(false)}
            className="px-4 py-2 bg-gray-300 text-black rounded ml-2"
          >
            Cancel
          </button>
        </form>
      )}
    </>
  );
}
