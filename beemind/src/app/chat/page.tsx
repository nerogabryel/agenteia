import { Suspense } from 'react';
import Chat from '@/components/chat/Chat';

export const metadata = {
  title: 'BeeMind - Chat',
};

export default function ChatPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <Chat />
    </Suspense>
  );
}