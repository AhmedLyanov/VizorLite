import { User } from '../models/User.model.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { saveAvatar } from '../services/avatar.service.js';
import { saveBackground, deleteBackgroundFile } from '../services/background.service.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, '../uploads/avatars');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const deleteAvatarFile = (avatarPath) => {
  try {
    const fullPath = path.join(__dirname, '..', avatarPath);

    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  } catch (error) {
    console.error("Ошибка удаления старого аватара:", error);
  }
};

const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Только изображения (jpeg, jpg, png, gif, webp) разрешены!'));
  }
};

export const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: fileFilter
}).single('avatar');

export const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'Файл слишком большой. Максимальный размер 5MB'
      });
    }
    return res.status(400).json({
      success: false,
      message: err.message
    });
  } else if (err) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
  next();
};

export const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded"
      });
    }

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    if (user.avatar) {
      deleteAvatarFile(user.avatar);
    }

    const avatarPath = await saveAvatar(req.file.buffer, req.userId);

    user.avatar = avatarPath;
    await user.save();

    const baseUrl = `${req.protocol}://${req.get("host")}`;

    res.json({
      success: true,
      data: {
        avatarUrl: `${baseUrl}${avatarPath}`
      }
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Avatar upload failed"
    });
  }
};

export const uploadBackground = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (!user.settings) {
      user.settings = {
        background: {
          image: null,
          size: 'cover',
          position: 'center',
          attachment: 'fixed'
        }
      };
    }

    if (user.settings.background && user.settings.background.image) {
      deleteBackgroundFile(user.settings.background.image);
    }

    const backgroundPath = await saveBackground(req.file.buffer, req.userId);

    user.settings.background = {
      ...user.settings.background,
      image: backgroundPath
    };

    await user.save();

    const baseUrl = `${req.protocol}://${req.get('host')}`;

    res.json({ success: true, data: { backgroundUrl: `${baseUrl}${backgroundPath}` } });
  } catch (error) {
    console.error('Background upload error:', error);
    res.status(500).json({ success: false, message: 'Background upload failed' });
  }
};

export const deleteAvatar = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Пользователь не найден'
      });
    }

    if (user.avatar) {
      const avatarPath = path.join(__dirname, '..', user.avatar);
      if (fs.existsSync(avatarPath)) {
        fs.unlinkSync(avatarPath);
      }

      user.avatar = null;
      await user.save();
    }

    res.json({
      success: true,
      message: 'Аватар успешно удален'
    });

  } catch (error) {
    console.error('Ошибка удаления аватара:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при удалении аватара'
    });
  }
};

export const getAvatar = async (req, res) => {
  try {
    const userId = req.params.userId || req.userId;
    const user = await User.findById(userId).select('avatar username');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Пользователь не найден'
      });
    }

    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const avatarUrl = user.avatar ? `${baseUrl}${user.avatar}` : null;

    res.json({
      success: true,
      data: {
        userId: user._id,
        username: user.username,
        avatarUrl: avatarUrl,
        hasAvatar: !!user.avatar
      }
    });

  } catch (error) {
    console.error('Ошибка получения аватара:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при получении аватара'
    });
  }
};