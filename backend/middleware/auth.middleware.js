import jwt from "jsonwebtoken";
import { User } from "../models/User.model.js";

export const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        error: "Нет токена",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ error: "Пользователь не найден" });
    }

    req.user = user;    
    req.userId = user._id;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        error: "Неверный токен",
      });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        error: "Токен истек",
      });
    }

    return res.status(401).json({
      error: "Ошибка аутентификации",
    });
  }
};