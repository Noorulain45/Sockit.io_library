"use client";

import { useAppSelector } from "@/hooks/useAppStore";
import LoginScreen from "@/components/LoginScreen";
import Sidebar from "@/components/Sidebar";
import ChatWindow from "@/components/ChatWindow";
import MessageInput from "@/components/MessageInput";
import { useSocket } from "@/hooks/useSocket";
import { ROOMS } from "@/store/chatSlice";

function ChatLayout() {
  useSocket();
  const currentRoom = useAppSelector((s) => s.chat.currentRoom);
  const isConnected = useAppSelector((s) => s.chat.isConnected);
  const onlineCount = useAppSelector((s) => s.chat.onlineCount);
  const room = ROOMS.find((r) => r.id === currentRoom);

  return (
    <div style={{ display: "flex", height: "100vh", background: "linear-gradient(135deg, #0d0d1a 0%, #1a0533 50%, #0d1a33 100%)", overflow: "hidden" }}>
      <Sidebar />
      <div style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 0 }}>
        {/* Header */}
        <div style={{
          height: 56, padding: "0 20px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          background: "rgba(255,255,255,0.03)",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          flexShrink: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 18 }}>{room?.emoji}</span>
            <span style={{ fontWeight: 600, color: "white", fontSize: 15 }}># {room?.name ?? currentRoom}</span>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <span style={{
              fontSize: 11, padding: "4px 12px", borderRadius: 999,
              background: "rgba(96,165,250,0.1)",
              border: "1px solid rgba(96,165,250,0.25)",
              color: "#60a5fa",
            }}>● RTK Query</span>
            <span style={{
              fontSize: 11, padding: "4px 12px", borderRadius: 999,
              background: isConnected ? "rgba(74,222,128,0.1)" : "rgba(255,255,255,0.05)",
              border: isConnected ? "1px solid rgba(74,222,128,0.25)" : "1px solid rgba(255,255,255,0.1)",
              color: isConnected ? "#4ade80" : "rgba(255,255,255,0.3)",
            }}>
              {isConnected ? `● Socket.IO · ${onlineCount} online` : "○ Socket.IO · offline"}
            </span>
          </div>
        </div>
        <ChatWindow />
        <MessageInput />
      </div>
    </div>
  );
}

export default function Page() {
  const username = useAppSelector((s) => s.chat.username);
  if (!username) return <LoginScreen />;
  return <ChatLayout />;
}