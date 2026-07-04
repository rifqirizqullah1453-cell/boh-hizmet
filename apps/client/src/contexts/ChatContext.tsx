import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

interface Msg {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  content: string;
  timestamp: number;
  isMe: boolean;
}

const SUPPORT_KEY = 'boh_support_chat_v1';
const ORDER_CHAT_KEY = 'boh_order_chat_v1';

function loadMessages(key: string): Msg[] {
  try {
    const s = localStorage.getItem(key);
    return s ? JSON.parse(s) : [];
  } catch { return []; }
}
function saveMessages(key: string, msgs: Msg[]) {
  try { localStorage.setItem(key, JSON.stringify(msgs)); } catch {}
}

const ChatContext = createContext<ReturnType<typeof useChatData> | null>(null);

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChat must be used within ChatProvider');
  return ctx;
}

function useChatData() {
  const { userProfile } = useAuth();
  const { toast } = useToast();
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
  const [supportMessages, setSupportMessages] = useState<Msg[]>(() => loadMessages(SUPPORT_KEY));
  const [orderChats, setOrderChats] = useState<Record<string, Msg[]>>({});

  const orderMessages: Msg[] = activeOrderId ? (orderChats[activeOrderId] || []) : [];

  // Returns messages for a given order (used by NotificationContext)
  const getMessages = useCallback((orderId: string): Msg[] => {
    return orderChats[orderId] || [];
  }, [orderChats]);

  const sendOrderMessage = useCallback(async (orderId: string, content: string) => {
    if (!userProfile) return;
    const msg: Msg = {
      id: 'MSG-' + Date.now().toString(36),
      senderId: userProfile.uid,
      senderName: userProfile.name,
      senderRole: userProfile.role,
      content,
      timestamp: Date.now(),
      isMe: true,
    };
    setOrderChats(prev => {
      const updated = { ...prev, [orderId]: [...(prev[orderId] || []), msg] };
      saveMessages(ORDER_CHAT_KEY + '_' + orderId, updated[orderId]);
      return updated;
    });
  }, [userProfile]);

  const sendSupportMessage = useCallback((content: string) => {
    if (!userProfile) return;
    const msg: Msg = {
      id: 'MSG-' + Date.now().toString(36),
      senderId: userProfile.uid,
      senderName: userProfile.name,
      senderRole: userProfile.role,
      content,
      timestamp: Date.now(),
      isMe: true,
    };
    const updated = [...supportMessages, msg];
    setSupportMessages(updated);
    saveMessages(SUPPORT_KEY, updated);

    // Auto-reply after delay
    setTimeout(() => {
      const replies = [
        'Thank you for reaching out. Our team is reviewing your request.',
        'We have received your message and will get back to you shortly.',
        'Is there anything else I can help you with today?',
        'Please hold on while we check your account details.',
      ];
      const reply: Msg = {
        id: 'MSG-' + Date.now().toString(36),
        senderId: 'admin-support',
        senderName: 'BOH Support',
        senderRole: 'admin',
        content: replies[Math.floor(Math.random() * replies.length)],
        timestamp: Date.now(),
        isMe: false,
      };
      setSupportMessages(prev => {
        const all = [...prev, reply];
        saveMessages(SUPPORT_KEY, all);
        return all;
      });
    }, 3000 + Math.random() * 4000);
  }, [userProfile, supportMessages]);

  return {
    orderMessages,
    supportMessages,
    sendOrderMessage,
    sendSupportMessage,
    getMessages,
    activeOrderId,
    setActiveOrderId,
    isLoading: false,
  };
}

export function ChatProvider({ children }: { children: ReactNode }) {
  const data = useChatData();
  return <ChatContext.Provider value={data}>{children}</ChatContext.Provider>;
}
