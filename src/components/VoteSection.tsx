'use client';

import React, { useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
}
interface Props {
  threadId?: string;
  commentId?: string;
  users: User[];
}

export default function VoteSection({ threadId, commentId, users }: Props) {
  const [count, setCount] = useState(0);
  const [userId, setUserId] = useState(users[0]?.id || '');
  const endpoint = threadId
    ? `/api/threads/${threadId}/votes`
    : `/api/comments/${commentId}/votes`;

  // fetch initial votes
  useEffect(() => {
    fetch(endpoint)
      .then((res) => res.json())
      .then((data) => setCount(data.votes));
  }, [endpoint]);

  const handleVote = async (value: number) => {
    await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, value }),
    });
    const res = await fetch(endpoint);
    const data = await res.json();
    setCount(data.votes);
  };

  return (
    <div className="flex items-center space-x-2 mt-2">
      <select
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        className="border px-2 py-1 rounded"
      >
        {users.map((u) => (
          <option key={u.id} value={u.id}>
            {u.name}
          </option>
        ))}
      </select>
      <button
        onClick={() => handleVote(1)}
        className="px-2 text-green-600 hover:bg-green-100 rounded"
      >
        👍
      </button>
      <span className="font-medium">{count}</span>
      <button
        onClick={() => handleVote(-1)}
        className="px-2 text-red-600 hover:bg-red-100 rounded"
      >
        👎
      </button>
    </div>
  );
}
