import express from 'express';
import { auth } from '../middleware/auth.js';
import { chatFileUpload } from '../middleware/upload.middleware.js';
import { uploadFile, getChatHistory } from '../controllers/chat.controller.js';

const router = express.Router();


router.post('/upload', auth, chatFileUpload, uploadFile);

router.get('/history/:roomId', auth, getChatHistory);

export default router;