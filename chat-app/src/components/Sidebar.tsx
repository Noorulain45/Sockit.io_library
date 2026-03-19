"use client";

import { useAppSelector } from "@/hooks/useAppStore";
import { useGetUsersQuery } from "@/store/chatApi";
import { ROOMS } from "@/store/chatSlice";
import { useSocket } from "@/hooks/useSocket";

const AVATAR_GRADIENTS = [
  "linear-gradient(135deg, #7c3aed, #3b82f6)",
  "linear-gradient(135deg, #ec4899, #f97316)",
  "linear-gradient(135deg, #10b981, #3b82f6)",
  "linear-gradient(135deg, #f59e0b, #ef4444)",
  "linear-gradient(135deg, #8b5cf6, #ec4899)",
  "linear-gradient(135deg, #06b6d4, #10b981)",
];

export default function Sidebar() {
  const { changeRoom } = useSocket();
  const currentRoom = useAppSelector((s) => s.chat.currentRoom);
  const username = useAppSelector((s) => s.chat.username);
  const isConnected = useAppSelector((s) => s.chat.isConnected);
  const onlineCount = useAppSelector((s) => s.chat.onlineCount);
  const liveUsers = useAppSelector((s) => s.chat.roomUsers[currentRoom] ?? []);
  const { data: users, isLoading, isError } = useGetUsersQuery();

  const sidebarStyle: React.CSSProperties = {
    width: 260,
    minWidth: 260,
    height: "100%",
    display: "flex",
    flexDirection: "column",
    background: "rgba(255,255,255,0.03)",
    borderRight: "1px solid rgba(255,255,255,0.07)",
  };

  return (
    <aside style={sidebarStyle}>
      {/* Header */}
      <div style={{ padding: "20px 16px 16px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <div style={{
          fontSize: 18, fontWeight: 700, marginBottom: 8,
          background: "linear-gradient(135deg, #a78bfa, #60a5fa)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>💬 RTK Chat</div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{
            width: 8, height: 8, borderRadius: "50%",
            background: isConnected ? "#4ade80" : "#6b7280",
            boxShadow: isConnected ? "0 0 8px #4ade80" : "none",
          }} />
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
            {isConnected ? `${onlineCount} online` : "Connecting..."}
          </span>
        </div>
      </div>

      {/* Rooms */}
      <div style={{ padding: "16px 12px 8px" }}>
        <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", color: "rgba(255,255,255,0.25)", textTransform: "uppercase", marginBottom: 8, paddingLeft: 8 }}>
          Rooms
        </div>
        {ROOMS.map((room) => {
          const active = currentRoom === room.id;
          return (
            <button
              key={room.id}
              onClick={() => changeRoom(room.id)}
              style={{
                width: "100%", display: "flex", alignItems: "center", gap: 8,
                padding: "10px 12px", borderRadius: 10, marginBottom: 2,
                border: active ? "1px solid rgba(124,58,237,0.5)" : "1px solid transparent",
                background: active ? "linear-gradient(135deg, rgba(124,58,237,0.25), rgba(59,130,246,0.2))" : "transparent",
                color: active ? "white" : "rgba(255,255,255,0.45)",
                fontSize: 14, fontWeight: active ? 600 : 400,
                cursor: "pointer", transition: "all 0.15s", textAlign: "left",
              }}
            >
              <span style={{ fontSize: 16 }}>{room.emoji}</span>
              <span># {room.name}</span>
            </button>
          );
        })}
      </div>

      <div style={{ height: 1, background: "rgba(255,255,255,0.06)", margin: "4px 12px" }} />

     {/* Members */}
<div style={{ padding: "12px", flex: 1, overflowY: "auto" }}>
  <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", color: "rgba(255,255,255,0.25)", textTransform: "uppercase", marginBottom: 10, paddingLeft: 8 }}>
    Online in room
  </div>
  {liveUsers.length === 0 && (
    <p style={{ fontSize: 12, color: "rgba(255,255,255,0.2)", paddingLeft: 8 }}>No one here yet</p>
  )}
  {liveUsers.map((name, i) => (
    <div key={name} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 8px", borderRadius: 8, marginBottom: 2 }}>
      <div style={{ position: "relative" }}>
        <div style={{
          width: 30, height: 30, borderRadius: "50%",
          background: AVATAR_GRADIENTS[i % AVATAR_GRADIENTS.length],
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 12, fontWeight: 700, color: "white",
        }}>
          {name[0].toUpperCase()}
        </div>
        {/* Green online dot */}
        <div style={{
          position: "absolute", bottom: 0, right: 0,
          width: 9, height: 9, borderRadius: "50%",
          background: "#4ade80",
          border: "2px solid #0d0d1a",
          boxShadow: "0 0 6px #4ade80",
        }} />
      </div>
      <span style={{ fontSize: 13, color: name === username ? "white" : "rgba(255,255,255,0.65)", fontWeight: name === username ? 600 : 400 }}>
        {name} {name === username ? "(you)" : ""}
      </span>
    </div>
  ))}
</div>

      {/* Footer — current user */}
      <div style={{ padding: "12px 16px", borderTop: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{
          width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
          background: "linear-gradient(135deg, #7c3aed, #3b82f6)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 14, fontWeight: 700, color: "white",
          boxShadow: "0 2px 12px rgba(124,58,237,0.4)",
        }}>
          {username[0]?.toUpperCase()}
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: "white" }}>{username}</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>You</div>
        </div>
      </div>
    </aside>
  );
}