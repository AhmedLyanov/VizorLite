import Message from '../models/Message.model.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, '../uploads/chat');


if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}


export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Файл не загружен'
      });
    }

    const { roomId, userId, userName } = req.body;
    
    if (!roomId || !userName) {
      return res.status(400).json({
        success: false,
        message: 'Необходимы roomId и userName'
      });
    }
    

    const fileName = `${Date.now()}-${req.file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
    const filePath = path.join(uploadDir, fileName);
    
    fs.writeFileSync(filePath, req.file.buffer);
    
    const relativePath = `/uploads/chat/${fileName}`;
    

    let fileType = 'other';
    if (req.file.mimetype.startsWith('image/')) {
      fileType = 'image';
    } else if (req.file.mimetype === 'application/pdf') {
      fileType = 'document';
    } else if (req.file.mimetype.includes('word') || req.file.mimetype.includes('excel')) {
      fileType = 'document';
    }
    

    const message = new Message({
      roomId,
      userId: userId || null,
      userName,
      content: req.file.originalname,  
      type: 'file',
      file: {
        url: relativePath,
        name: req.file.originalname,
        size: req.file.size,
        mimeType: req.file.mimetype,
        fileType: fileType  
      }
    });
    
    await message.save();


    const io = req.app.get('io');

  

    if (io) {
      io.to(roomId).emit('chat-message', {
        _id: message._id.toString(),
        userId: message.userId,
        userName: message.userName,
        content: message.content,
        type: 'file',
        timestamp: message.timestamp,
        file: message.file
      });
    } else {
      console.error('IO instance not found!');
    }

    res.json({
      success: true,
      data: message
    });
    
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка загрузки файла',
      error: error.message
    });
  }
};

export const getChatHistory = async (req, res) => {
  try {
    const { roomId } = req.params;
    const limit = parseInt(req.query.limit) || 50;
    
    const messages = await Message.find({ roomId })
      .sort({ timestamp: -1 })
      .limit(limit)
      .populate('userId', 'username avatar');
    
    res.json({
      success: true,
      data: messages.reverse()
    });
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка получения истории чата',
      error: error.message
    });
  }
};
