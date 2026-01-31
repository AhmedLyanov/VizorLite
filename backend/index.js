import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import http from "http";

import userRoutes from "./routes/user.routes.js";
import roomRoutes from "./routes/room.routes.js";
import socketService from "./services/websocket.service.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

app.use("/api/auth", userRoutes);
app.use("/api/room", roomRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Welcome Universe!" });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Маршрут не найден" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Внутренняя ошибка сервера",
  });
});

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("DB connected successfully");

    const server = http.createServer(app);

    socketService.initialize(server);

    server.listen(PORT, () => {
      console.log(`Server + WebSocket running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Connection error:", error.message);
    process.exit(1);
  }
};

startServer();
