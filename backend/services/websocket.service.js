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
        origin: process.env.FRONTEND_URL || "https://vaykino.ru",
        methods: ["GET", "POST"],
        credentials: true,
      },
    });

    this.setupEventHandlers();
  }

  setupEventHandlers() {
    this.io.on("connection", (socket) => {

      socket.on("join-room", ({ roomId, userId, userName }) => {
        socket.join(roomId);

        if (!this.rooms.has(roomId)) {
          this.rooms.set(roomId, new Set());
        }

        const room = this.rooms.get(roomId);
        room.add(socket.id);
        this.users.set(socket.id, { userId, userName, roomId });


        const existingUsers = Array.from(room)
          .filter(id => id !== socket.id)
          .map(id => ({
            socketId: id,
            userName: this.users.get(id)?.userName || 'User'
          }));

        if (existingUsers.length > 0) {
          socket.emit("existing-users", { users: existingUsers });
        }

        socket.to(roomId).emit("user-connected", {
          socketId: socket.id,
          userId,
          userName,
        });
      });

      socket.on("offer", ({ offer, to }) => {
        this.io.to(to).emit("offer", {
          offer,
          from: socket.id,
        });
      });

      socket.on("answer", ({ answer, to }) => {
        this.io.to(to).emit("answer", {
          answer,
          from: socket.id,
        });
      });

      socket.on("ice-candidate", ({ candidate, to }) => {
        this.io.to(to).emit("ice-candidate", {
          candidate,
          from: socket.id,
        });
      });

      socket.on("disconnect", () => {
        const user = this.users.get(socket.id);
        if (!user) {
          return;
        }

        const { roomId, userName } = user;

        if (this.rooms.has(roomId)) {
          const room = this.rooms.get(roomId);
          room.delete(socket.id);

          socket.to(roomId).emit("user-disconnected", {
            socketId: socket.id,
          });
        }

        this.users.delete(socket.id);
      });
    });
  }
}

export default new SocketService();