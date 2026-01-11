import express from "express";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});




app.get("/", (req, res) => {
  res.json({
    message: "Добро пожаловать на мой сервер!",
    status: "success",
  });
});



app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Маршрут не найден"
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Внутренняя ошибка сервера",
    error: process.env.NODE_ENV === "development" ? err.message : {}
  });
});

app.listen(PORT, () => {
  console.log(`Active ${PORT}`);
});