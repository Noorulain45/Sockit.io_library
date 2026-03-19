"use client";

import { useEffect, useRef, useMemo } from "react";
import { useAppSelector } from "@/hooks/useAppStore";
import { useGetRoomMessagesQuery } from "@/store/chatApi";
import type { Message } from "@/store/chatSlice";

function formatTime(ts: number) {
  return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

const AVATAR_GRADIENTS = [
  "linear-gradient(135deg, #7c3aed, #3b82f6)",
  "linear-gradient(135deg, #ec4899, #f97316)",
  "linear-gradient(135deg, #10b981, #3b82f6)",
  "linear-gradient(135deg, #f59e0b, #ef4444)",
  "linear-gradient(135deg, #8b5cf6, #ec4899)",
  "linear-gradient(135deg, #06b6d4, #10b981)",
];

function getAvatarGradient(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_GRADIENTS[Math.abs(hash) % AVATAR_GRADIENTS.length];
}

export default function ChatWindow() {
  const currentRoom = useAppSelector((s) => s.chat.currentRoom);
  const { data: historicalMessages = [], isFetching } = useGetRoomMessagesQuery(currentRoom);
  const liveMessages = useAppSelector((s) => s.chat.messages[currentRoom] ?? []);

  const allMessages: Message[] = useMemo(
    () => [
      ...historicalMessages.map((m) => ({ ...m, isMine: false })),
      ...liveMessages,
    ].sort((a, b) => a.timestamp - b.timestamp),
    [historicalMessages, liveMessages]
  );

  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [allMessages.length]);

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "24px 20px", display: "flex", flexDirection: "column", gap: 16 }}>
      {isFetching && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, color: "rgba(255,255,255,0.3)", fontSize: 13 }}>
          <div style={{ width: 14, height: 14, border: "2px solid rgba(139,92,246,0.4)", borderTop: "2px solid #7c3aed", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
          Loading messages...
        </div>
      )}

      {!isFetching && allMessages.length === 0 && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.2)" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>👋</div>
          <div style={{ fontSize: 16, fontWeight: 500 }}>No messages yet</div>
          <div style={{ fontSize: 13, marginTop: 4 }}>Be the first to say hello!</div>
        </div>
      )}

      {allMessages.map((msg) => {
        if (msg.username === "System") return (
          <div key={msg.id} style={{ display: "flex", justifyContent: "center" }}>
            <span style={{
              fontSize: 12, padding: "4px 14px", borderRadius: 999,
              background: "rgba(255,255,255,0.05)",
              color: "rgba(255,255,255,0.3)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}>{msg.text}</span>
          </div>
        );

        return (
          <div key={msg.id} style={{ display: "flex", flexDirection: "column", alignItems: msg.isMine ? "flex-end" : "flex-start", gap: 4 }}>
            {!msg.isMine && (
              <div style={{ display: "flex", alignItems: "center", gap: 6, paddingLeft: 4 }}>
                <div style={{
                  width: 22, height: 22, borderRadius: "50%",
                  background: getAvatarGradient(msg.username),
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 10, fontWeight: 700, color: "white",
                }}>
                  {msg.username[0]?.toUpperCase()}
                </div>
                <span style={{ fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,0.4)" }}>
                  {msg.username}
                </span>
              </div>
            )}

            <div style={{
              maxWidth: "65%",
              padding: "10px 16px",
              borderRadius: msg.isMine ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
              fontSize: 14, lineHeight: 1.6,
              ...(msg.isMine
                ? { background: "linear-gradient(135deg, #7c3aed, #3b82f6)", color: "white", boxShadow: "0 4px 16px rgba(124,58,237,0.35)" }
                : { background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.9)", border: "1px solid rgba(255,255,255,0.08)" }
              ),
            }}>
              {msg.text}
            </div>

            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", paddingLeft: msg.isMine ? 0 : 4, paddingRight: msg.isMine ? 4 : 0 }}>
              {formatTime(msg.timestamp)}
            </span>
          </div>
        );
      })}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
      <div ref={bottomRef} />
    </div>
  );
}