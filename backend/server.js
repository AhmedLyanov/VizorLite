const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const socketIo = require('socket.io');

dotenv.config();

const app = express();
const server = http.createServer(app);

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/', {

})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log('MongoDB connection error:', err));

const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

const authRoutes = require('./routes/auth');
const roomRoutes = require('./routes/rooms');

app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    console.log(`Socket ${socket.id} joined room ${roomId}`);

    socket.broadcast.to(roomId).emit('user-connected', {
      userId: socket.id,
      roomId: roomId
    });
  });

  socket.on('offer', (payload) => {
    io.to(payload.target).emit('offer', {
      sender: socket.id,
      sdp: payload.sdp
    });
  });

  socket.on('answer', (payload) => {
    io.to(payload.target).emit('answer', {
      sender: socket.id,
      sdp: payload.sdp
    });
  });

  socket.on('ice-candidate', (payload) => {
    io.to(payload.target).emit('ice-candidate', {
      sender: socket.id,
      candidate: payload.candidate
    });
  });

  socket.on('screen-share-started', (roomId) => {
    socket.broadcast.to(roomId).emit('screen-share-started', socket.id);
  });

  socket.on('screen-share-stopped', (roomId) => {
    socket.broadcast.to(roomId).emit('screen-share-stopped', socket.id);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    for (let room in socket.rooms) {
      if (room !== socket.id) {
        socket.broadcast.to(room).emit('user-disconnected', socket.id);
      }
    }
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});