import express from 'express';
import { auth } from '../middleware/auth.middleware.js';
import { avatarUpload } from "../middleware/upload.middleware.js";
import {
  uploadAvatar,
  deleteAvatar,
  getAvatar
} from '../controllers/profile.controller.js';

const router = express.Router();

router.use(auth);

router.post('/avatar', auth, avatarUpload, uploadAvatar);

router.delete('/avatar', auth, deleteAvatar);

router.get('/avatar', auth, getAvatar);

router.get('/avatar/:userId', auth, getAvatar);

export default router;