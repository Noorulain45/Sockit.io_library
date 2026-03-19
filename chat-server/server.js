const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");

const app = express();
const httpServer = http.createServer(app);

app.use(cors({ origin: "https://sockit-io-library-h9t7.vercel.app" }));
app.use(express.json());

const ROOMS = ["general", "tech", "random"];

const messageStore = {
  general: [
    { id: uuidv4(), roomId: "general", username: "Alice", text: "Hey everyone! 👋", timestamp: Date.now() - 1000 * 60 * 10 },
    { id: uuidv4(), roomId: "general", username: "Bob", text: "Welcome to RTK Chat! Built with RTK Query + Socket.IO 🚀", timestamp: Date.now() - 1000 * 60 * 8 },
    { id: uuidv4(), roomId: "general", username: "Alice", text: "Feel free to switch rooms using the sidebar.", timestamp: Date.now() - 1000 * 60 * 5 },
  ],
  tech: [
    { id: uuidv4(), roomId: "tech", username: "Carol", text: "RTK Query is so much cleaner than fetch + useEffect.", timestamp: Date.now() - 1000 * 60 * 15 },
    { id: uuidv4(), roomId: "tech", username: "Dan", text: "Agreed. Automatic caching alone is worth it 💯", timestamp: Date.now() - 1000 * 60 * 12 },
  ],
  random: [
    { id: uuidv4(), roomId: "random", username: "Eve", text: "This is the random room. Anything goes here 🎲", timestamp: Date.now() - 1000 * 60 * 20 },
  ],
};

const roomUsers = { general: new Set(), tech: new Set(), random: new Set() };

app.get("/api/users", (req, res) => {
  res.json([
    { id: 1, name: "Alice Johnson",  username: "alice",  email: "alice@chat.app" },
    { id: 2, name: "Bob Smith",      username: "bob",    email: "bob@chat.app" },
    { id: 3, name: "Carol White",    username: "carol",  email: "carol@chat.app" },
    { id: 4, name: "Dan Brown",      username: "dan",    email: "dan@chat.app" },
    { id: 5, name: "Eve Davis",      username: "eve",    email: "eve@chat.app" },
    { id: 6, name: "Frank Miller",   username: "frank",  email: "frank@chat.app" },
  ]);
});

app.get("/api/rooms/:roomId/messages", (req, res) => {
  const { roomId } = req.params;
  if (!ROOMS.includes(roomId)) return res.status(404).json({ error: "Room not found" });
  res.json(messageStore[roomId] || []);
});

// ── Socket.IO ─────────────────────────────────────────────────────────────────

const io = new Server(httpServer, {
  cors: { origin: "https://sockit-io-library-h9t7.vercel.app", methods: ["GET", "POST"] },
});

// ✅ Defined AFTER io — no more ReferenceError
const getRoomUsers = (roomId) => {
  const users = [];
  const sockets = io.sockets.adapter.rooms.get(roomId);
  if (sockets) {
    for (const socketId of sockets) {
      const s = io.sockets.sockets.get(socketId);
      if (s?.data?.username) users.push(s.data.username);
    }
  }
  return users;
};

const broadcastOnlineCount = () => io.emit("online_count", io.engine.clientsCount);

io.on("connection", (socket) => {
  console.log(`🔌 Connected: ${socket.id}`);
  broadcastOnlineCount();

  socket.on("join_room", ({ room, username }) => {
    if (!ROOMS.includes(room)) return;
    socket.join(room);
    socket.data.username = username;
    socket.data.room = room;
    roomUsers[room]?.add(username);
    console.log(`👤 ${username} joined #${room}`);

    io.to(room).emit("room_users", { room, users: getRoomUsers(room) });

    socket.to(room).emit("receive_message", {
      id: uuidv4(), roomId: room, username: "System",
      text: `${username} joined the room 👋`, timestamp: Date.now(),
    });
  });

  socket.on("leave_room", ({ room, username }) => {
    socket.leave(room);
    roomUsers[room]?.delete(username);

    io.to(room).emit("room_users", { room, users: getRoomUsers(room) });

    socket.to(room).emit("receive_message", {
      id: uuidv4(), roomId: room, username: "System",
      text: `${username} left the room`, timestamp: Date.now(),
    });
  });

  socket.on("send_message", (msg) => {
    console.log(`💬 [#${msg.roomId}] ${msg.username}: ${msg.text}`);
    if (messageStore[msg.roomId]) {
      messageStore[msg.roomId].push(msg);
      if (messageStore[msg.roomId].length > 100) messageStore[msg.roomId].shift();
    }
    socket.to(msg.roomId).emit("receive_message", msg);
  });

  socket.on("disconnect", () => {
    const { username, room } = socket.data;
    console.log(`❌ Disconnected: ${socket.id}`);
    if (username && room) {
      roomUsers[room]?.delete(username);
      io.to(room).emit("room_users", { room, users: getRoomUsers(room) });
      socket.to(room).emit("receive_message", {
        id: uuidv4(), roomId: room, username: "System",
        text: `${username} disconnected`, timestamp: Date.now(),
      });
    }
    broadcastOnlineCount();
  });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});