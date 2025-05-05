'use client';

import React, { useState } from 'react';
import VoteSection from '@/components/VoteSection';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import CreateCommentForm from '@/components/CreateCommentForm';
import CommentActions from '@/components/CommentActions';

export interface CommentWithReplies {
  id: string;
  content: string;
  createdAt: Date;
  author: { id: string; name: string };
  votes: { id: string }[];
  replies?: CommentWithReplies[];
}

interface Props {
  comments: CommentWithReplies[];
  users: { id: string; name: string }[];
  threadId: string;
}

export default function CommentList({ comments, users, threadId }: Props) {
  const [openReplies, setOpenReplies] = useState<Record<string, boolean>>({});
  if (!comments || comments.length === 0) return <p>No comments yet.</p>;

  return (
    <ul className="space-y-6">
      {comments.map((comment) => (
        <li key={comment.id} className="border p-4 rounded animate__animated animate__fadeInUp animate__faster transition-colors hover:bg-gray-100 dark:hover:bg-gray-700">
          <div className="mt-2 prose dark:prose-invert">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {comment.content}
            </ReactMarkdown>
          </div>
          <div className="text-sm text-gray-600 mt-2">
            by {comment.author.name}
          </div>
          <VoteSection commentId={comment.id} users={users} />
          <CommentActions commentId={comment.id} initialContent={comment.content} />
          <button
            onClick={() => setOpenReplies(prev => ({ ...prev, [comment.id]: !prev[comment.id] }))}
            className="text-blue-600 text-sm mt-2"
          >
            Reply
          </button>
          {openReplies[comment.id] && (
            <div className="mt-2 ml-4">
              <CreateCommentForm threadId={threadId} parentId={comment.id} />
            </div>
          )}
          {comment.replies && comment.replies.length > 0 && (
            <ul className="mt-4 space-y-4 pl-4 border-l">
              {comment.replies.map((reply) => (
                <li key={reply.id} className="border p-3 rounded animate__animated animate__fadeInUp animate__faster transition-colors hover:bg-gray-100 dark:hover:bg-gray-700">
                  <div className="mt-2 prose dark:prose-invert">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {reply.content}
                    </ReactMarkdown>
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    by {reply.author.name}
                  </div>
                  <VoteSection commentId={reply.id} users={users} />
                  <CommentActions commentId={reply.id} initialContent={reply.content} />
                  <button
                    onClick={() => setOpenReplies(prev => ({ ...prev, [reply.id]: !prev[reply.id] }))}
                    className="text-blue-600 text-sm mt-1"
                  >
                    Reply
                  </button>
                  {openReplies[reply.id] && (
                    <div className="mt-2 ml-6">
                      <CreateCommentForm threadId={threadId} parentId={reply.id} />
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  );
}
