import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { email, name, password } = await request.json();
    if (!email || !name || !password) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    await prisma.user.create({ data: { email, name, hashedPassword } });
    return NextResponse.json({ message: 'User created' }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal error' }, { status: 500 });
  }
}
