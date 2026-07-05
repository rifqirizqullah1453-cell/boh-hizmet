import { useState, useEffect, useCallback } from 'react';
import { collection, onSnapshot, addDoc, orderBy, query } from 'firebase/firestore';
import { db, auth } from '@/firebase/config';

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  content: string;
  timestamp: number;
}

export function useOrderChat(orderId: string | undefined) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) return;
    setLoading(true);

    const q = query(
      collection(db, 'chats', orderId, 'messages'),
      orderBy('createdAt', 'asc')
    );

    const unsub = onSnapshot(q, (snap) => {
      setMessages(
        snap.docs.map((d) => ({
          id: d.id,
          senderId: d.data().senderId as string,
          senderName: d.data().senderName as string,
          senderRole: d.data().senderRole as string,
          content: d.data().text as string,
          timestamp: d.data().createdAt as number,
        }))
      );
      setLoading(false);
    });

    return () => unsub();
  }, [orderId]);

  const sendMessage = useCallback(
    async (content: string, senderName: string, senderRole: string) => {
      if (!content.trim() || !orderId) return;
      const uid = auth.currentUser?.uid;
      if (!uid) return;
      await addDoc(collection(db, 'chats', orderId, 'messages'), {
        senderId: uid,
        senderName,
        senderRole,
        text: content.trim(),
        createdAt: Date.now(),
      });
    },
    [orderId]
  );

  return { messages, loading, sendMessage };
}
