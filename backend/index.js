import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userRoutes from "./routes/user.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});
app.use("/api/auth", userRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Welcome Universe!",
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Маршрут не найден",
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Внутренняя ошибка сервера",
    error: process.env.NODE_ENV === "development" ? err.message : {},
  });
});

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("DB connected successfully");
    app.listen(PORT, () => {
      console.log(`Active, port:${PORT}`);
    });
  } catch (error) {
    console.error("Connection error:", error.message);
    process.exit(1);
  }
};

startServer();
