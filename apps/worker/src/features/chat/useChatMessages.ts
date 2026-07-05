import { useState, useEffect, useCallback } from "react";
import {
  collection,
  onSnapshot,
  addDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { firestore } from "../../lib/firestoreClient";

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: "worker" | "customer";
  text: string;
  createdAt: number;
}

export function useChatMessages(orderId: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) return;

    const q = query(
      collection(firestore, "chats", orderId, "messages"),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(q, (snap) => {
      setMessages(
        snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<ChatMessage, "id">),
        }))
      );
      setLoading(false);
    });

    return () => unsubscribe();
  }, [orderId]);

  const sendMessage = useCallback(
    async (
      text: string,
      sender: { uid: string; name: string; role: "worker" | "customer" }
    ) => {
      if (!text.trim()) return;
      await addDoc(collection(firestore, "chats", orderId, "messages"), {
        senderId: sender.uid,
        senderName: sender.name,
        senderRole: sender.role,
        text: text.trim(),
        createdAt: Date.now(),
      });
    },
    [orderId]
  );

  return { messages, loading, sendMessage };
}
