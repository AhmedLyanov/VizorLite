import express from 'express';
import aiController from '../controllers/ai.controller.js';
import { auth } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/chat', auth, aiController.chat);
router.get('/status', aiController.status);

export default router;