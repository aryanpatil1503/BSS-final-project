"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Card from '@/components/Card';

export default function UserForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email }),
      });
      if (!res.ok) {
        toast.error('Failed to add user');
        throw new Error('Failed to create user');
      }
      setName('');
      setEmail('');
      router.refresh();
      toast.success('User added');
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={e => setName(e.target.value)}
          className="border px-2 py-1 rounded"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="border px-2 py-1 rounded"
          required
        />
        <button
          type="submit"
          disabled={submitting}
          className="mt-2 bg-blue-600 text-white px-3 py-2 rounded disabled:opacity-50"
        >
          {submitting ? 'Adding…' : 'Add User'}
        </button>
      </form>
    </Card>
  );
}
