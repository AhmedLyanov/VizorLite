import jwt from "jsonwebtoken";

export const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        error: "Нет токена",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = decoded.userId;

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
