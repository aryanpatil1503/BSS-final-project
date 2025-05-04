import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

interface Review {
  id: string;
  title: string;
  content: string;
  author: { name: string };
}

// Removed next/image to handle unpredictable remote image endpoints

export default async function Home() {
  const session = await getServerSession(authOptions);
  const reviews: Review[] = await prisma.thread.findMany({
    orderBy: { createdAt: 'desc' },
    take: 6,
    include: { author: { select: { name: true } } },
  });

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors py-12 px-4 sm:px-6 md:px-8 lg:px-12">
      {/* Hero Section */}
      <section className="bg-white dark:bg-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">Discover Your Next Favorite Read</h1>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">Join our community of passionate book reviewers and share your thoughts.</p>
            <div className="space-x-4">
              {session ? (
                <Link href="/threads" className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700">Browse Reviews</Link>
              ) : (
                <>
                  <Link href="/signup" className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700">Get Started</Link>
                  <Link href="/threads" className="px-6 py-3 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 dark:hover:bg-gray-700">Browse Reviews</Link>
                </>
              )}
            </div>
          </div>
          <div className="flex justify-center">
            <img src="/books.jpeg" alt="Books" loading="lazy" className="rounded shadow-lg w-full h-auto" />
          </div>
        </div>
      </section>
      {/* Search & Latest Reviews */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-12">
        <form action="/threads" method="get" className="mb-6 flex">
          <input name="search" type="text" placeholder="Search by title or author..." className="flex-1 border rounded px-4 py-2" />
          <button type="submit" className="ml-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Search</button>
        </form>
        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Latest Reviews</h2>
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review: Review) => (
            <Link key={review.id} href={`/threads/${review.id}`} className="block bg-white dark:bg-gray-800 p-4 rounded shadow hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-2 truncate">{review.title}</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-2 line-clamp-3">{review.content}</p>
              <div className="text-sm text-gray-500 dark:text-gray-400">by {review.author.name}</div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
