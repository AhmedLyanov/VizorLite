import { Server } from 'socket.io';

class SocketService {
  constructor() {
    this.io = null;
    this.rooms = new Map();
    this.users = new Map();
  }

  initialize(server) {
    this.io = new Server(server, {
      cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:5173",
        credentials: true
      }
    });

    this.setupEventHandlers();
    console.log('Socket.io инициализирован');
  }

  setupEventHandlers() {
    this.io.on('connection', (socket) => {
      console.log('Новое подключение:', socket.id);

      socket.on('join-room', (data) => {
        const { roomId, userId, userName } = data;

        socket.join(roomId);

        this.users.set(socket.id, { userId, userName, roomId });

        if (!this.rooms.has(roomId)) {
          this.rooms.set(roomId, new Set());
        }
        this.rooms.get(roomId).add(socket.id);

        socket.to(roomId).emit('user-connected', {
          userId,
          socketId: socket.id,
          userName
        });

        const participants = Array.from(this.rooms.get(roomId))
          .filter(id => id !== socket.id)
          .map(id => ({
            socketId: id,
            ...this.users.get(id)
          }));

        socket.emit('current-participants', participants);
      });

      socket.on('offer', (data) => {
        const { offer, to } = data;
        socket.to(to).emit('offer', {
          offer,
          from: socket.id
        });
      });

      socket.on('answer', (data) => {
        const { answer, to } = data;
        socket.to(to).emit('answer', {
          answer,
          from: socket.id
        });
      });

      socket.on('ice-candidate', (data) => {
        const { candidate, to } = data;
        socket.to(to).emit('ice-candidate', {
          candidate,
          from: socket.id
        });
      });

      socket.on('toggle-video', (data) => {
        const { roomId, userId, enabled } = data;
        socket.to(roomId).emit('video-toggled', { userId, enabled });
      });

      socket.on('toggle-audio', (data) => {
        const { roomId, userId, enabled } = data;
        socket.to(roomId).emit('audio-toggled', { userId, enabled });
      });

      socket.on('screen-share-start', (data) => {
        const { roomId, userId, streamId } = data;
        socket.to(roomId).emit('screen-share-started', { userId, streamId });
      });

      socket.on('screen-share-stop', (data) => {
        const { roomId, userId } = data;
        socket.to(roomId).emit('screen-share-stopped', { userId });
      });

      socket.on('send-message', (data) => {
        const { roomId, message, userId, userName } = data;
        socket.to(roomId).emit('receive-message', {
          message,
          userId,
          userName,
          timestamp: new Date()
        });
      });

      socket.on('disconnect', () => {
        console.log('Клиент отключился:', socket.id);

        const userInfo = this.users.get(socket.id);
        if (userInfo) {
          const { roomId, userId } = userInfo;

          if (this.rooms.has(roomId)) {
            this.rooms.get(roomId).delete(socket.id);
            socket.to(roomId).emit('user-disconnected', {
              socketId: socket.id,
              userId
            });
            if (this.rooms.get(roomId).size === 0) {
              this.rooms.delete(roomId);
            }
          }

          this.users.delete(socket.id);
        }
      });
    });
  }

  sendSystemMessage(roomId, message) {
    this.io.to(roomId).emit('system-message', {
      message,
      timestamp: new Date()
    });
  }

  kickUser(socketId, reason) {
    const socket = this.io.sockets.sockets.get(socketId);
    if (socket) {
      socket.emit('kicked', { reason });
      socket.disconnect();
    }
  }
}

export default new SocketService();