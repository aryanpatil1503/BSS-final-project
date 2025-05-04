import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface Params { params: Promise<{ threadId: string }> }

// GET /api/threads/[threadId]/sentiment
export async function GET(request: Request, { params }: Params) {
  const { threadId } = await params;

  // Fetch thread
  const thread = await prisma.thread.findUnique({ where: { id: threadId } });
  console.log("[sentiment] thread.content:", thread?.content);
  if (!thread) {
    return NextResponse.json({ error: 'Thread not found' }, { status: 404 });
  }

  // Ensure OpenAI API key
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error('Missing OPENAI_API_KEY');
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
  }

  try {
    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'Classify the sentiment as Positive, Negative, or Neutral. Respond with one word.' },
          { role: 'user', content: thread.content },
        ],
        temperature: 0,
        max_tokens: 1,
      }),
    });

    const data = await openaiRes.json();
    console.log("[sentiment] OpenAI raw response:", data);
    const sentiment = data.choices?.[0]?.message?.content?.trim() || 'Unknown';
    return NextResponse.json({ sentiment });
  } catch (err: any) {
    console.error('OpenAI error:', err);
    return NextResponse.json({ error: 'Failed to analyze sentiment' }, { status: 500 });
  }
}
