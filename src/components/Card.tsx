'use client'

import React, { ReactNode } from 'react'

export default function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={`bg-white dark:bg-gray-800 dark:text-gray-100 p-6 rounded-lg shadow-md transition-colors ${className || ''}`}>
      {children}
    </div>
  )
}
