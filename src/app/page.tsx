import Image from "next/image";
import UserForm from '@/components/UserForm';
import Card from '@/components/Card';
import { prisma } from '@/lib/prisma';

export default async function Home() {
  const users = await prisma.user.findMany({ select: { id: true, name: true, email: true } });

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors py-12 px-4 sm:px-8">
      <div className="max-w-3xl mx-auto space-y-12 font-[family-name:var(--font-geist-sans)]">
        <section>
          <Card>
            <h2 className="text-2xl font-semibold mb-4">Add a Member</h2>
            <UserForm />
          </Card>
        </section>
        <section>
          <Card>
            <h2 className="text-2xl font-semibold mb-4">Members</h2>
            <ul className="list-disc pl-5 space-y-1 dark:text-gray-100">
              {users.map(user => (
                <li key={user.id}>{user.name} ({user.email})</li>
              ))}
            </ul>
          </Card>
        </section>
      </div>
    </main>
  );
}
