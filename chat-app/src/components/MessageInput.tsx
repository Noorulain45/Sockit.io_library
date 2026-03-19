"use client";

import { useState } from "react";
import { useSocket } from "@/hooks/useSocket";
import { useAppSelector } from "@/hooks/useAppStore";
import { ROOMS } from "@/store/chatSlice";

export default function MessageInput() {
  const [text, setText] = useState("");
  const { sendMessage } = useSocket();
  const currentRoom = useAppSelector((s) => s.chat.currentRoom);
  const isConnected = useAppSelector((s) => s.chat.isConnected);
  const room = ROOMS.find((r) => r.id === currentRoom);

  const handleSend = () => {
    if (!text.trim() || !isConnected) return;
    sendMessage(text);
    setText("");
  };

  return (
    <div style={{ padding: "16px 20px", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 12,
        background: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 16, padding: "10px 14px",
        transition: "border-color 0.2s",
      }}>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
          placeholder={isConnected ? `Message #${room?.name.toLowerCase() ?? currentRoom}...` : "Connecting..."}
          disabled={!isConnected}
          autoFocus
          style={{
            flex: 1, background: "transparent",
            border: "none", outline: "none",
            color: "white", fontSize: 14,
            opacity: isConnected ? 1 : 0.4,
          }}
        />
        <button
          onClick={handleSend}
          disabled={!text.trim() || !isConnected}
          style={{
            padding: "8px 18px",
            background: text.trim() && isConnected ? "linear-gradient(135deg, #7c3aed, #3b82f6)" : "rgba(255,255,255,0.08)",
            border: "none", borderRadius: 10,
            color: text.trim() && isConnected ? "white" : "rgba(255,255,255,0.3)",
            fontSize: 13, fontWeight: 600,
            cursor: text.trim() && isConnected ? "pointer" : "not-allowed",
            transition: "all 0.2s",
            boxShadow: text.trim() && isConnected ? "0 2px 12px rgba(124,58,237,0.4)" : "none",
          }}
        >
          Send ↑
        </button>
      </div>
      <p style={{ textAlign: "center", fontSize: 11, color: "rgba(255,255,255,0.15)", marginTop: 8, marginBottom: 0 }}>
        Press Enter to send
      </p>
    </div>
  );
}