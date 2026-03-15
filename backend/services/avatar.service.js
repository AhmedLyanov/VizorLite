import sharp from "sharp";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, "../uploads/avatars");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

export const saveAvatar = async (buffer, userId) => {
  const fileName = `avatar_${userId}_${Date.now()}.webp`;
  const filePath = path.join(uploadDir, fileName);

  await sharp(buffer)
    .resize(200, 200, {
      fit: "cover",
      position: "center"
    })
    .webp({ quality: 80 })
    .toFile(filePath);

  return `/uploads/avatars/${fileName}`;
};

export const deleteAvatarFile = (avatarPath) => {
  const fullPath = path.join(__dirname, "..", avatarPath);

  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath);
  }
};