const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: 'http://localhost:3000', methods: ['GET', 'POST'] },
});

app.use(cors());
app.use(express.json());

// MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected ✅'))
  .catch((err) => console.error('MongoDB Error:', err));

// Routes
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => res.send('Server running ✅'));

// Room tracking
const rooms = {};

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-room', ({ roomId, username }) => {
    socket.join(roomId);

    if (!rooms[roomId]) rooms[roomId] = [];

    // Check karo ye user already join toh nahi hai
    const alreadyJoined = rooms[roomId].find((u) => u.username === username);
    if (alreadyJoined) {
      // Purana connection remove karo
      rooms[roomId] = rooms[roomId].filter((u) => u.username !== username);
    }

    rooms[roomId].push({ socketId: socket.id, username });

    const others = rooms[roomId].filter((u) => u.socketId !== socket.id);
    socket.emit('room-users', others);
    socket
      .to(roomId)
      .emit('user-joined', { socketId: socket.id, username, roomId });

    console.log(`${username} joined room ${roomId}`);
  });

  // WebRTC Signaling
  socket.on('offer', ({ to, offer, from, username }) => {
    io.to(to).emit('offer', { from, offer, username });
  });
  socket.on('answer', ({ to, answer, from }) => {
    io.to(to).emit('answer', { from, answer });
  });
  socket.on('ice-candidate', ({ to, candidate, from }) => {
    io.to(to).emit('ice-candidate', { from, candidate });
  });

  // Screen sharing
  socket.on('screen-share-started', ({ roomId }) => {
    console.log(`Screen share started in room ${roomId}`);
    socket.to(roomId).emit('screen-share-started', { socketId: socket.id });
  });

  socket.on('screen-share-stopped', ({ roomId }) => {
    console.log(`Screen share stopped in room ${roomId}`);
    socket.to(roomId).emit('screen-share-stopped', { socketId: socket.id });
  });

  // File sharing
  socket.on(
    'file-share',
    ({ roomId, fileData, fileName, fileType, fileSize, sender }) => {
      socket.to(roomId).emit('file-received', {
        fileData,
        fileName,
        fileType,
        fileSize,
        sender,
        timestamp: new Date().toISOString(),
      });
    }
  );

  // Encrypted chat
  socket.on('send-message', ({ roomId, encryptedMsg, sender, timestamp }) => {
    socket
      .to(roomId)
      .emit('message-received', { encryptedMsg, sender, timestamp });
  });

  // Whiteboard
  socket.on('draw', ({ roomId, drawData }) => {
    socket.to(roomId).emit('draw', { drawData });
  });
  socket.on('whiteboard-clear', ({ roomId }) => {
    socket.to(roomId).emit('whiteboard-clear');
  });
  socket.on('whiteboard-undo', ({ roomId }) => {
    socket.to(roomId).emit('whiteboard-undo');
  });

  // Leave & disconnect
  socket.on('leave-room', ({ roomId }) => handleLeave(socket, roomId));
  socket.on('disconnect', () => {
    Object.keys(rooms).forEach((roomId) => {
      if (rooms[roomId]?.some((u) => u.socketId === socket.id)) {
        handleLeave(socket, roomId);
      }
    });
    console.log('User disconnected:', socket.id);
  });
});

function handleLeave(socket, roomId) {
  if (rooms[roomId]) {
    rooms[roomId] = rooms[roomId].filter((u) => u.socketId !== socket.id);
    socket.to(roomId).emit('user-left', { socketId: socket.id, roomId }); // roomId add kiya
    socket.leave(roomId);
  }
}

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
