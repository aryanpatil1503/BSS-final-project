import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import React from 'react';

export default async function ThreadsLayout({ children }: { children: React.ReactNode }) {
  // Redirect unauthenticated users to sign-in
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect('/signin');
  }
  return <>{children}</>;
}
