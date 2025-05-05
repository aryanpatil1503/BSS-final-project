'use client';

import { SessionProvider } from 'next-auth/react';
import { Toaster } from 'react-hot-toast';
import React from 'react';
import { ThemeProvider } from 'next-themes';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system">
      <SessionProvider>
        {children}
        <Toaster position="bottom-right" />
      </SessionProvider>
    </ThemeProvider>
  );
}
