"use client";

import { useEffect, useCallback } from "react";
import { getSocket } from "@/lib/socket";
import { useAppDispatch, useAppSelector } from "./useAppStore";
import { addMessage, setOnlineCount, setConnected, setCurrentRoom, setRoomUsers, type Message } from "@/store/chatSlice";

export const useSocket = () => {
  const dispatch = useAppDispatch();
  const username = useAppSelector((s) => s.chat.username);
  const currentRoom = useAppSelector((s) => s.chat.currentRoom);

  useEffect(() => {
    if (!username) return;

    const socket = getSocket();
    socket.connect();

    const onConnect = () => {
      dispatch(setConnected(true));
      socket.emit("join_room", { room: currentRoom, username });
    };

    const onDisconnect = () => {
      dispatch(setConnected(false));
    };

    const onRoomUsers = ({ room, users }: { room: string; users: string[] }) => {
  dispatch(setRoomUsers({ room, users }));
};

    const onReceiveMessage = (msg: Omit<Message, "isMine">) => {
      dispatch(addMessage({ ...msg, isMine: msg.username === username }));
    };

    const onOnlineCount = (count: number) => {
      dispatch(setOnlineCount(count));
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("receive_message", onReceiveMessage);
    socket.on("online_count", onOnlineCount);
    socket.on("room_users", onRoomUsers);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("receive_message", onReceiveMessage);
      socket.off("online_count", onOnlineCount);
      socket.off("room_users", onRoomUsers);
      socket.disconnect();
    };
  }, [username]);

  const sendMessage = useCallback(
    (text: string) => {
      if (!text.trim()) return;
      const socket = getSocket();
      const message: Message = {
        id: `${Date.now()}-${Math.random()}`,
        roomId: currentRoom,
        username,
        text: text.trim(),
        timestamp: Date.now(),
        isMine: true,
      };
      dispatch(addMessage(message));
      socket.emit("send_message", message);
    },
    [currentRoom, username, dispatch]
  );

  const changeRoom = useCallback(
    (newRoom: string) => {
      if (newRoom === currentRoom) return;
      const socket = getSocket();
      socket.emit("leave_room", { room: currentRoom, username });
      socket.emit("join_room", { room: newRoom, username });
      dispatch(setCurrentRoom(newRoom));
    },
    [currentRoom, username, dispatch]
  );

  return { sendMessage, changeRoom };
};