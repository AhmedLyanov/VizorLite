import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import http from "http";
import cors from "cors";
import path from "path";
import { fileURLToPath } from 'url';

import userRoutes from "./routes/user.routes.js";
import roomRoutes from "./routes/room.routes.js";
import aiRoutes from "./routes/ai.routes.js";
import profileRoutes from "./routes/profile.routes.js"; 
import socketService from "./services/websocket.service.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

app.use("/api/auth", userRoutes);
app.use("/api/room", roomRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/profile', profileRoutes); 

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
      console.log(`🤖 AI Service: ${process.env.OPENROUTER_API_KEY ? '✅ Enabled' : '❌ Disabled'}`);
      console.log(`📁 Uploads directory: ${path.join(__dirname, 'uploads')}`);
    });
  } catch (error) {
    console.error("Connection error:", error.message);
    process.exit(1);
  }
};

startServer();