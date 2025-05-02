import CreateThreadForm from '@/components/CreateThreadForm';
import ThreadList, { Thread } from '@/components/ThreadList';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';

export default async function ThreadsPage() {
  // Protect page: redirect if not authenticated
  const session = await getServerSession(authOptions);
  if (!session) redirect('/signin');

  // Fetch threads and users for the form
  const [threads, users] = await Promise.all([
    prisma.thread.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        author: { select: { id: true, name: true } },
        _count: { select: { votes: true, comments: true } },
      },
    }),
    prisma.user.findMany({ select: { id: true, name: true } }),
  ]);

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Discussion Threads</h1>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Start a New Thread</h2>
        <CreateThreadForm />
      </section>

      <section>
        <ThreadList threads={threads as Thread[]} users={users} />
      </section>
    </main>
  );
}
