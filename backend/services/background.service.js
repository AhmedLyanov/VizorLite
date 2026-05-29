import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, '../uploads/backgrounds');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

export const saveBackground = async (buffer, userId) => {
  const fileName = `background_${userId}_${Date.now()}.webp`;
  const filePath = path.join(uploadDir, fileName);

  await sharp(buffer)
    .resize(1920, null, { fit: 'inside' })
    .webp({ quality: 80 })
    .toFile(filePath);

  return `/uploads/backgrounds/${fileName}`;
};

export const deleteBackgroundFile = (backgroundPath) => {
  try {
    const fullPath = path.join(__dirname, '..', backgroundPath);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  } catch (error) {
    console.error('Ошибка удаления фонового файла:', error);
  }
};
