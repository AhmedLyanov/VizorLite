import { Server } from "socket.io";

class SocketService {
  constructor() {
    this.io = null;
    this.rooms = new Map(); 
    this.users = new Map(); 
  }

  initialize(server) {
    this.io = new Server(server, {
      path: "/ws",
      cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true,
      },
    });

    this.setupEventHandlers();
  }

  setupEventHandlers() {
    this.io.on("connection", (socket) => {
      console.log(`🔌 Client connected: ${socket.id}`);

      socket.on("join-room", ({ roomId, userId, userName }) => {
        socket.join(roomId);

        // Инициализация комнаты
        if (!this.rooms.has(roomId)) {
          this.rooms.set(roomId, new Set());
        }

        const room = this.rooms.get(roomId);
        room.add(socket.id);
        this.users.set(socket.id, { userId, userName, roomId });

        console.log(`🏠 User ${socket.id} (${userName}) joined room ${roomId}, total: ${room.size}`);

        // Отправляем роль пользователю
        const role = room.size === 1 ? "initiator" : "receiver";
        socket.emit("room-role", { role });

        // Отправляем информацию о существующих пользователях новому участнику
        const existingUsers = Array.from(room)
          .filter(id => id !== socket.id)
          .map(id => ({
            socketId: id,
            userName: this.users.get(id)?.userName || 'User'
          }));

        if (existingUsers.length > 0) {
          console.log(`📨 Sending existing users to ${socket.id}:`, existingUsers);
          socket.emit("existing-users", { users: existingUsers });
        }

        // Уведомляем всех остальных о новом участнике
        socket.to(roomId).emit("user-connected", {
          socketId: socket.id,
          userId,
          userName,
        });
      });

      socket.on("offer", ({ offer, to }) => {
        console.log(`📤 Offer from ${socket.id} to ${to}`);
        this.io.to(to).emit("offer", {
          offer,
          from: socket.id,
        });
      });

      socket.on("answer", ({ answer, to }) => {
        console.log(`📤 Answer from ${socket.id} to ${to}`);
        this.io.to(to).emit("answer", {
          answer,
          from: socket.id,
        });
      });

      socket.on("disconnect", () => {
        const user = this.users.get(socket.id);
        if (!user) {
          console.log(`⚠️ Unknown user disconnected: ${socket.id}`);
          return;
        }

        const { roomId, userName } = user;
        console.log(`🔌 User ${socket.id} (${userName}) disconnected from room ${roomId}`);

        if (this.rooms.has(roomId)) {
          const room = this.rooms.get(roomId);
          room.delete(socket.id);

          // Уведомляем остальных участников
          socket.to(roomId).emit("user-disconnected", {
            socketId: socket.id,
          });

          // Удаляем комнату если она пустая
          if (room.size === 0) {
            this.rooms.delete(roomId);
            console.log(`🗑️ Room ${roomId} deleted (empty)`);
          }
        }

        this.users.delete(socket.id);
      });
    });
  }
}

export default new SocketService();