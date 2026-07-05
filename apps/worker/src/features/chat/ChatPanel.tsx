import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, MessageCircle, X, ChevronDown } from "lucide-react";
import { useChatMessages } from "./useChatMessages";
import { useAuth } from "../auth/useAuth";

interface ChatPanelProps {
  orderId: string;
  workerName: string;
  onClose: () => void;
}

function formatTime(ms: number) {
  return new Date(ms).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
}

export function ChatPanel({ orderId, workerName, onClose }: ChatPanelProps) {
  const { user } = useAuth();
  const { messages, loading, sendMessage } = useChatMessages(orderId);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const handleSend = async () => {
    if (!text.trim() || !user || sending) return;
    setSending(true);
    try {
      await sendMessage(text, {
        uid: user.uid,
        name: workerName,
        role: "worker",
      });
      setText("");
    } finally {
      setSending(false);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-[90] flex flex-col"
      style={{ background: "var(--bg)" }}
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", stiffness: 400, damping: 35 }}
    >
      {/* Header */}
      <div className="gradient-hero px-5 pt-12 pb-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full glass flex items-center justify-center">
          <MessageCircle className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <p className="text-[11px] font-bold text-white/60 uppercase tracking-wider">Chat</p>
          <p className="font-black text-white text-sm">Order #{orderId.split("-").slice(-2).join("-").toUpperCase()}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="w-10 h-10 rounded-full glass flex items-center justify-center"
        >
          <ChevronDown className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
        {loading && (
          <div className="flex justify-center py-8">
            <motion.div
              className="w-6 h-6 border-2 rounded-full border-t-transparent"
              style={{ borderColor: "var(--cyan-lighter)", borderTopColor: "var(--cyan)" }}
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          </div>
        )}

        {!loading && messages.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-3xl mb-2">💬</p>
            <p className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>
              Belum ada pesan
            </p>
            <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
              Kirim pesan untuk berkomunikasi dengan customer
            </p>
          </div>
        )}

        <AnimatePresence>
          {messages.map((msg) => {
            const isMe = msg.senderId === user?.uid;
            return (
              <motion.div
                key={msg.id}
                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <div className={`max-w-[75%] ${isMe ? "items-end" : "items-start"} flex flex-col gap-1`}>
                  {!isMe && (
                    <p className="text-[10px] font-bold px-1" style={{ color: "var(--text-muted)" }}>
                      {msg.senderName}
                    </p>
                  )}
                  <div
                    className="px-4 py-2.5 rounded-2xl text-sm font-medium"
                    style={
                      isMe
                        ? { background: "linear-gradient(135deg, #4DD4E0, #2BC5D4)", color: "white", borderBottomRightRadius: 6 }
                        : { background: "var(--bg-card)", color: "var(--text)", border: "1px solid var(--border-light)", borderBottomLeftRadius: 6 }
                    }
                  >
                    {msg.text}
                  </div>
                  <p className="text-[10px] px-1" style={{ color: "var(--text-muted)" }}>
                    {formatTime(msg.createdAt)}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div
        className="px-4 py-3 flex items-center gap-3"
        style={{
          background: "var(--bg-card)",
          borderTop: "1px solid var(--border-light)",
          paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom, 0px))",
        }}
      >
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
          placeholder="Ketik pesan..."
          className="flex-1 px-4 py-3 rounded-2xl text-sm outline-none font-medium"
          style={{
            background: "var(--bg)",
            border: "1.5px solid var(--border)",
            color: "var(--text)",
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "var(--cyan)";
            e.currentTarget.style.boxShadow = "0 0 0 3px var(--cyan-glow)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "var(--border)";
            e.currentTarget.style.boxShadow = "none";
          }}
        />
        <motion.button
          type="button"
          onClick={handleSend}
          disabled={!text.trim() || sending}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 btn-cyan"
          style={{ padding: 0, opacity: !text.trim() || sending ? 0.5 : 1 }}
        >
          <Send className="w-4 h-4" />
        </motion.button>
      </div>
    </motion.div>
  );
}
