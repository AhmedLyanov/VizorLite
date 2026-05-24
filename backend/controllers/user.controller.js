import { User } from "../models/User.model.js";
import { generateToken } from "../utils/jwt.js";
import { generateVerificationCode } from "../services/verification.service.js";
import { sendEmailByType, EmailType } from "../services/email.service.js";

export const register = async (req, res) => {
  try {
    const { email, phone, password, username } = req.body;

    const exists = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (exists) {
      return res.status(400).json({
        error: "Пользователь уже существует",
      });
    }

    const user = await User.create({
      email,
      phone,
      password,
      username,
    });

    const code = await generateVerificationCode(
      user._id,
      "email_verification"
    );



    try {
      await sendEmailByType({
        to: user.email,
        type: EmailType.VERIFICATION,
        data: { code },
      });
    } catch (emailError) {
      console.error("❌ Email sending failed (but user created):", emailError);
    }

    res.status(201).json({
      message: "Код отправлен на email",
      userId: user._id,
    });
  } catch (error) {
    console.error("❌ REGISTER ERROR:", error);
    res.status(500).json({
      error: "Ошибка регистрации",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        error: "Invalid credentials",
      });
    }

    const validPassword = await user.comparePassword(password);

    if (!validPassword) {
      return res.status(401).json({
        error: "Invalid credentials",
      });
    }

    const token = generateToken(user._id);

    res.json({
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        createdAt: user.createdAt,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({
      error: "Login error",
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    res.json({ user });
  } catch (error) {
    res.status(500).json({
      error: "Error get profile",
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { email, username } = req.body;

    if (email || username) {
      const exists = await User.findOne({
        $and: [{ _id: { $ne: req.userId } }, { $or: [] }],
      });

      if (email) exists.$or.push({ email });
      if (username) exists.$or.push({ username });

      if (exists) {
        return res.status(400).json({
          error: "Email or Login exist!",
        });
      }
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      { $set: req.body },
      { new: true, runValidators: true }
    ).select("-password");

    res.json({ user });
  } catch (error) {
    res.status(500).json({
      error: "Ошибка обновления",
    });
  }
};


export const updateSettings = async (req, res) => {
  try {
    const { settings } = req.body;
    const user = await User.findByIdAndUpdate(
      req.userId,
      { $set: { settings } },
      { new: true }
    ).select('-password');

    res.json({
      success: true,
      settings: user.settings
    });
  } catch (error) {
    console.error('❌ Update settings error:', error);
    res.status(500).json({ error: 'Ошибка обновления настроек' });
  }
};


export const updateSettingsSection = async (req, res) => {
  try {
    const { section, data } = req.body; 

    const updatePath = `settings.${section}`;
    const user = await User.findByIdAndUpdate(
      req.userId,
      { $set: { [updatePath]: data } },
      { new: true }
    ).select('-password');

    res.json({
      success: true,
      settings: user.settings
    });
  } catch (error) {
    console.error('❌ Update settings section error:', error);
    res.status(500).json({ error: 'Ошибка обновления настроек' });
  }
};

export const getSettings = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('settings');
    res.json({ settings: user.settings });
  } catch (error) {
    console.error('❌ Get settings error:', error);
    res.status(500).json({ error: 'Ошибка получения настроек' });
  }
};

export const deleteAccount = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.userId);
    res.json({ message: "Аккаунт удален" });
  } catch (error) {
    res.status(500).json({
      error: "Ошибка удаления",
    });
  }
};