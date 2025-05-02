'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useTheme } from 'next-themes'

export default function Header() {
  const { data: session, status } = useSession()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <header className="bg-white dark:bg-gray-800 dark:text-gray-100 transition-colors p-4 flex justify-between items-center">
      <nav className="flex items-center space-x-6">
        <Link href="/" className="font-semibold text-lg text-gray-900 dark:text-gray-100 hover:underline">
          BSSForum
        </Link>
        <Link href="/threads" className="text-lg text-gray-900 dark:text-gray-100 hover:underline">
          Threads
        </Link>
      </nav>
      {status === 'loading' ? (
        <div />
      ) : session ? (
        <div className="flex items-center space-x-4">
          <span>Hello, {session.user?.name || session.user?.email}</span>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="text-blue-600 hover:underline"
          >
            Sign Out
          </button>
        </div>
      ) : (
        <div className="flex items-center space-x-4">
          <Link href="/signin" className="text-blue-600 dark:text-blue-400 hover:underline">
            Sign In
          </Link>
          <Link href="/signup" className="text-blue-600 dark:text-blue-400 hover:underline">
            Sign Up
          </Link>
        </div>
      )}
      {mounted && (
        <button
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          className="ml-4 p-1 bg-gray-200 dark:bg-gray-700 rounded transition-colors"
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      )}
    </header>
  )
}
