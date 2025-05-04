import CreateThreadForm from '@/components/CreateThreadForm';
import ThreadList, { Thread } from '@/components/ThreadList';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function ThreadsPage({ searchParams }: { searchParams: Promise<{ search?: string | string[] }> }) {
  // Protect page: redirect if not authenticated
  const session = await getServerSession(authOptions);
  if (!session) redirect('/signin');

  // Fetch threads (with optional search) and users for the form
  const { search: rawQuery } = await searchParams;
  const searchQuery = Array.isArray(rawQuery) ? rawQuery[0] : rawQuery;
  const where = searchQuery
    ? {
        OR: [
          { title: { contains: searchQuery } },
          { content: { contains: searchQuery } },
        ],
      }
    : undefined;
  const [threads, users] = await Promise.all([
    prisma.thread.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        author: { select: { id: true, name: true } },
        _count: { select: { votes: true, comments: true } },
      },
    }),
    prisma.user.findMany({ select: { id: true, name: true } }),
  ]);

  return (
    <main className="py-12 px-4 sm:px-6 md:px-8 lg:px-12">
      <div className="max-w-full mx-auto sm:max-w-3xl lg:max-w-5xl space-y-6">
        <h1 className="text-2xl font-bold mb-4">
          {searchQuery ? `Search results for "${searchQuery}"` : 'Discussion Threads'}
        </h1>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Start a New Thread</h2>
          <CreateThreadForm />
        </section>

        <section>
          <ThreadList threads={threads as unknown as Thread[]} users={users} />
        </section>
      </div>
    </main>
  );
}
