import { Server } from "socket.io";
import dotenv from "dotenv";
import { saveMessage, getRoomMessages } from "./chat.service.js";

dotenv.config();


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
        origin: process.env.FRONTEND_URL,
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

        this.saveSystemMessage(roomId, `${userName} присоединился к конференции`);
      });
      socket.on("file-message", async ({ roomId, userId, userName, fileData }) => {
        try {
          const savedMessage = await saveMessage(
            roomId,
            userId,
            userName,
            fileData.name,
            'file',
            fileData
          );

          this.io.to(roomId).emit("chat-message", {
            _id: savedMessage._id,
            userId,
            userName,
            content: fileData.name,
            type: 'file',
            timestamp: savedMessage.timestamp,
            file: fileData
          });
        } catch (error) {
          console.error('Error sending file message:', error);
        }
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

      socket.on("chat-message", async ({ roomId, userId, userName, content }) => {
        try {
          const savedMessage = await saveMessage(roomId, userId, userName, content, 'text');

          this.io.to(roomId).emit("chat-message", {
            _id: savedMessage._id,
            userId,
            userName,
            content,
            type: 'text',
            timestamp: savedMessage.timestamp
          });
        } catch (error) {
          console.error('Error sending chat message:', error);
        }
      });

      socket.on("get-chat-history", async ({ roomId }, callback) => {
        try {
          const messages = await getRoomMessages(roomId);
          if (callback) callback(messages);
        } catch (error) {
          console.error('Error getting chat history:', error);
          if (callback) callback([]);
        }
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

          this.saveSystemMessage(roomId, `${userName} покинул конференцию`);
        }

        this.users.delete(socket.id);
      });
    });
  }

  async saveSystemMessage(roomId, content) {
    try {
      await saveMessage(roomId, null, 'System', content, 'system');

      this.io.to(roomId).emit("chat-message", {
        _id: Date.now().toString(),
        userId: null,
        userName: 'System',
        content,
        type: 'system',
        timestamp: new Date()
      });
    } catch (error) {
      console.error('Error saving system message:', error);
    }
  }
}

export default new SocketService();
