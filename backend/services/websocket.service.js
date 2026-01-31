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
    console.log("Socket.io инициализирован");
  }

  setupEventHandlers() {
    this.io.on("connection", (socket) => {
      console.log("Новое подключение:", socket.id);

      socket.on("join-room", ({ roomId, userId, userName }) => {
        socket.join(roomId);

        if (!this.rooms.has(roomId)) {
          this.rooms.set(roomId, new Set());
        }

        this.rooms.get(roomId).add(socket.id);
        this.users.set(socket.id, { userId, userName, roomId });

        const roomSize = this.rooms.get(roomId).size;

        const role = roomSize === 1 ? "initiator" : "receiver";
        socket.emit("room-role", { role });

        console.log(
          `${socket.id} joined room ${roomId} as ${role}`
        );

        socket.to(roomId).emit("user-connected", {
          socketId: socket.id,
          userId,
          userName,
        });
      });

      socket.on("offer", ({ offer, to }) => {
        socket.to(to).emit("offer", {
          offer,
          from: socket.id,
        });
      });

      socket.on("answer", ({ answer, to }) => {
        socket.to(to).emit("answer", {
          answer,
          from: socket.id,
        });
      });

      socket.on("disconnect", () => {
        console.log("Клиент отключился:", socket.id);

        const user = this.users.get(socket.id);
        if (!user) return;

        const { roomId } = user;

        if (this.rooms.has(roomId)) {
          this.rooms.get(roomId).delete(socket.id);

          socket.to(roomId).emit("user-disconnected", {
            socketId: socket.id,
          });

          if (this.rooms.get(roomId).size === 0) {
            this.rooms.delete(roomId);
          }
        }

        this.users.delete(socket.id);
      });
    });
  }
}

export default new SocketService();
