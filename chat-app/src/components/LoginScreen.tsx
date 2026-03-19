"use client";

import { useState } from "react";
import { useAppDispatch } from "@/hooks/useAppStore";
import { setUsername } from "@/store/chatSlice";

export default function LoginScreen() {
  const dispatch = useAppDispatch();
  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  const handleJoin = () => {
    const trimmed = input.trim();
    if (trimmed.length < 2) { setError("At least 2 characters required."); return; }
    dispatch(setUsername(trimmed));
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0d0d1a 0%, #1a0533 50%, #0d1a33 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "1rem",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Background orbs */}
      <div style={{ position: "absolute", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)", top: "10%", left: "20%", pointerEvents: "none" }} />
      <div style={{ position: "absolute", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)", bottom: "20%", right: "15%", pointerEvents: "none" }} />

      {/* Card */}
      <div style={{
        width: "100%",
        maxWidth: 420,
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 24,
        padding: "2.5rem",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        boxShadow: "0 25px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)",
        zIndex: 1,
      }}>
        {/* Icon */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{
            width: 72, height: 72,
            background: "linear-gradient(135deg, #7c3aed, #3b82f6)",
            borderRadius: 20,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 32, margin: "0 auto 1rem",
            boxShadow: "0 8px 32px rgba(124,58,237,0.4)",
          }}>💬</div>
          <h1 style={{
            fontSize: 28, fontWeight: 700, margin: "0 0 0.25rem",
            background: "linear-gradient(135deg, #a78bfa, #60a5fa)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>RTK Chat</h1>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, margin: 0 }}>
            RTK Query + Socket.IO
          </p>
        </div>

        {/* Form */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <input
            type="text"
            placeholder="Choose a username..."
            value={input}
            onChange={(e) => { setInput(e.target.value); setError(""); }}
            onKeyDown={(e) => e.key === "Enter" && handleJoin()}
            autoFocus
            style={{
              width: "100%", padding: "14px 16px",
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 12, color: "white",
              fontSize: 15, outline: "none",
              boxSizing: "border-box",
              transition: "border-color 0.2s",
            }}
            onFocus={(e) => e.target.style.borderColor = "rgba(139,92,246,0.6)"}
            onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.12)"}
          />

          {error && (
            <p style={{ color: "#f87171", fontSize: 13, margin: 0 }}>⚠️ {error}</p>
          )}

          <button
            onClick={handleJoin}
            style={{
              padding: "14px",
              background: "linear-gradient(135deg, #7c3aed, #3b82f6)",
              border: "none", borderRadius: 12,
              color: "white", fontSize: 15, fontWeight: 600,
              cursor: "pointer",
              boxShadow: "0 4px 20px rgba(124,58,237,0.4)",
              transition: "transform 0.15s, box-shadow 0.15s",
            }}
            onMouseEnter={(e) => { (e.target as HTMLButtonElement).style.transform = "translateY(-1px)"; (e.target as HTMLButtonElement).style.boxShadow = "0 8px 28px rgba(124,58,237,0.5)"; }}
            onMouseLeave={(e) => { (e.target as HTMLButtonElement).style.transform = "translateY(0)"; (e.target as HTMLButtonElement).style.boxShadow = "0 4px 20px rgba(124,58,237,0.4)"; }}
          >
            Enter Chat →
          </button>
        </div>

        {/* Badges */}
        <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: "1.5rem" }}>
          {["RTK Query", "Socket.IO", "Next.js"].map((b) => (
            <span key={b} style={{
              fontSize: 11, padding: "4px 10px",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 999, color: "rgba(255,255,255,0.4)",
            }}>{b}</span>
          ))}
        </div>
      </div>
    </div>
  );
}