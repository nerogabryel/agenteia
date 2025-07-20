"use client";

import { useState, useRef } from 'react';
import { sendMessage } from '@/lib/beezinha/respond';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMessage: Message = { role: 'user', content: input.trim() };
    setMessages((msgs) => [...msgs, userMessage]);
    setInput('');

    const response = await sendMessage(input.trim());
    setMessages((msgs) => [
      ...msgs,
      { role: 'assistant', content: response.message },
    ]);
    inputRef.current?.focus();
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-lg max-w-xs ${
              msg.role === 'user'
                ? 'bg-honey text-neutralBg self-end'
                : 'bg-neutralSurface text-neutralText self-start'
            }`}
          >
            {msg.content}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="p-4 border-t border-neutralSurface flex gap-2">
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 p-2 rounded-md bg-neutralSurface text-neutralText focus:outline-none"
          placeholder="Como você está se sentindo hoje?"
        />
        <button
          type="submit"
          className="bg-honey text-neutralBg px-4 py-2 rounded-md font-medium hover:bg-amber transition-colors disabled:opacity-50"
          disabled={!input.trim()}
        >
          Enviar
        </button>
      </form>
    </div>
  );
}