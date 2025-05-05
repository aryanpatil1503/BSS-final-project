'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useTheme } from 'next-themes';

export default function Header() {
  const { data: session, status } = useSession()
  const { resolvedTheme, setTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white dark:bg-gray-800 dark:text-gray-100 transition-colors px-4 sm:px-6 lg:px-12 py-4 flex items-center justify-between relative">
      {/* Logo */}
      <div className="flex-shrink-0">
        <Link href="/" className="flex items-center hover:underline">
          <img src="/noun-book-7501477.png" alt="Logo" className="h-8 w-8 mr-2" />
          <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">BSSReviews</span>
        </Link>
      </div>
      {/* Desktop Nav */}
      <nav className="hidden md:flex flex-1 justify-center items-center space-x-8">
        <Link href="/" className="text-lg text-gray-900 dark:text-gray-100 hover:underline">Home</Link>
        <Link href="/threads" className="text-lg text-gray-900 dark:text-gray-100 hover:underline">Reviews</Link>
        <Link href="/top" className="text-lg text-gray-900 dark:text-gray-100 hover:underline">Top Books</Link>
        <Link href="/about" className="text-lg text-gray-900 dark:text-gray-100 hover:underline">About</Link>
        {/* Theme toggle */}
        <button onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')} className="p-2 text-gray-900 dark:text-gray-100" aria-label="Toggle Theme">
          {resolvedTheme === 'dark' ? '☀️' : '🌙'}
        </button>
      </nav>
      {/* Auth + Mobile Menu */}
      <div className="flex items-center space-x-4">
        {status === 'loading' ? (
          <div />
        ) : session ? (
          <button onClick={() => signOut({ callbackUrl: '/' })} className="text-blue-600 hover:underline">
            Sign Out
          </button>
        ) : (
          <>
            <Link href="/signin" className="text-blue-600 dark:text-blue-400 hover:underline">Sign In</Link>
            <Link href="/signup" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Sign Up</Link>
          </>
        )}
        <button onClick={() => setMenuOpen(prev => !prev)} className="md:hidden p-2 text-gray-900 dark:text-gray-100" aria-label="Toggle menu">
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>
      {menuOpen && (
        <div className="absolute z-10 top-full left-0 w-full bg-white dark:bg-gray-800 dark:text-gray-100 shadow-md flex flex-col items-start p-4 space-y-2 md:hidden">
          <Link href="/" className="text-lg hover:underline">Home</Link>
          <Link href="/threads" className="text-lg hover:underline">Reviews</Link>
          <Link href="/top" className="text-lg hover:underline">Top Books</Link>
          <Link href="/about" className="text-lg hover:underline">About</Link>
          {status === 'loading' ? null : session ? (
            <button onClick={() => signOut({ callbackUrl: '/' })} className="text-blue-600 hover:underline">Sign Out</button>
          ) : (
            <>
              <Link href="/signin" className="text-blue-600 dark:text-blue-400 hover:underline">Sign In</Link>
              <Link href="/signup" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Sign Up</Link>
            </>
          )}
          {/* Theme toggle for mobile */}
          <button onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')} className="p-2 text-gray-900 dark:text-gray-100 w-full text-left" aria-label="Toggle Theme">
            {resolvedTheme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
      )}
    </header>
  )
}
