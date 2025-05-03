import React from 'react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-12">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">About BSSReviews</h1>
        <p className="text-gray-700 dark:text-gray-300">
          BSSReviews is a community-driven platform where readers share their thoughts and recommendations on books across all genres. Whether you love fiction, non-fiction, science fiction, or memoirs, our community is here to help you find your next great read.
        </p>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Our Mission</h2>
        <p className="text-gray-700 dark:text-gray-300">
          Our mission is to create a welcoming space for book enthusiasts to connect, discuss, and discover books. We strive to provide honest, thoughtful reviews that help readers make informed decisions.
        </p>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Join the Community</h2>
        <p className="text-gray-700 dark:text-gray-300">
          Sign up today to start reviewing your favorite books, follow fellow readers, and participate in lively discussions. Your next favorite book is just a click away!
        </p>
        <div className="mt-8">
          <Link href="/" className="text-blue-600 hover:underline">← Back to Home</Link>
        </div>
      </div>
    </main>
  );
}
