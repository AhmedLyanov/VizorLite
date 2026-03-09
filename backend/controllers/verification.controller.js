import { verifyCode } from "../services/verification.service.js";
import { User } from "../models/User.model.js";
import { generateToken } from "../utils/jwt.js";

export const verifyEmail = async (req, res) => {
  try {
    const { userId, code } = req.body;

    const valid = await verifyCode(userId, code, "email_verification");

    if (!valid) {
      return res.status(400).json({
        error: "Неверный код",
      });
    }
    const user = await User.findByIdAndUpdate(
      userId,
      { emailVerified: true },
      { new: true }
    );

    const token = generateToken(user._id);

    res.json({
      message: "Email подтвержден",
      token,
      user,
    });
  } catch (err) {
    res.status(500).json({ error: "Ошибка подтверждения" });
  }
};