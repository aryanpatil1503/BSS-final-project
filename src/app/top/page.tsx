import React from 'react';
import Link from 'next/link';

export default function TopBooksPage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">Top Books</h1>
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {/* Real top-rated books */}
          <div className="block bg-white dark:bg-gray-800 p-6 rounded shadow hover:shadow-lg transition">
            <h2 className="text-xl font-semibold mb-2">To Kill a Mockingbird</h2>
            <p className="text-gray-700 dark:text-gray-300">A novel about racial injustice and moral growth in the Deep South.</p>
          </div>
          <div className="block bg-white dark:bg-gray-800 p-6 rounded shadow hover:shadow-lg transition">
            <h2 className="text-xl font-semibold mb-2">1984</h2>
            <p className="text-gray-700 dark:text-gray-300">A dystopian depiction of government surveillance and totalitarianism by George Orwell.</p>
          </div>
          <div className="block bg-white dark:bg-gray-800 p-6 rounded shadow hover:shadow-lg transition">
            <h2 className="text-xl font-semibold mb-2">Pride and Prejudice</h2>
            <p className="text-gray-700 dark:text-gray-300">A romantic comedy of manners by Jane Austen set in early 19th-century England.</p>
          </div>
        </div>
        <div className="mt-8 text-center">
          <Link href="/" className="text-blue-600 hover:underline">← Back to Home</Link>
        </div>
      </div>
    </main>
  );
}
