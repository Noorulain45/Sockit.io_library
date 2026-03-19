import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Message {
  id: string;
  roomId: string;
  username: string;
  text: string;
  timestamp: number;
  isMine: boolean;
}

export interface Room {
  id: string;
  name: string;
  emoji: string;
}

export const ROOMS: Room[] = [
  { id: "general", name: "General", emoji: "💬" },
  { id: "tech",    name: "Tech",    emoji: "💻" },
  { id: "random",  name: "Random",  emoji: "🎲" },
];

interface ChatState {
  username: string;
  currentRoom: string;
  messages: Record<string, Message[]>;
  onlineCount: number;
  isConnected: boolean;
  roomUsers: Record<string, string[]>;
}

const initialState: ChatState = {
  username: "",
  currentRoom: "general",
  messages: { general: [], tech: [], random: [] },
  onlineCount: 0,
  isConnected: false,
   roomUsers: {},
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setUsername(state, action: PayloadAction<string>) {
      state.username = action.payload;
    },
    setCurrentRoom(state, action: PayloadAction<string>) {
      state.currentRoom = action.payload;
      if (!state.messages[action.payload]) {
        state.messages[action.payload] = [];
      }
    },
    addMessage(state, action: PayloadAction<Message>) {
      const { roomId, id } = action.payload;
      if (!state.messages[roomId]) state.messages[roomId] = [];
      const exists = state.messages[roomId].some((m) => m.id === id);
      if (!exists) state.messages[roomId].push(action.payload);
    },
    setOnlineCount(state, action: PayloadAction<number>) {
      state.onlineCount = action.payload;
    },
    setConnected(state, action: PayloadAction<boolean>) {
      state.isConnected = action.payload;
    },
    setRoomUsers(state, action: PayloadAction<{ room: string; users: string[] }>) {
  state.roomUsers[action.payload.room] = action.payload.users;
},
  },
});

export default chatSlice.reducer;
export const { setUsername, setCurrentRoom, addMessage, setOnlineCount, setConnected, setRoomUsers } = chatSlice.actions;