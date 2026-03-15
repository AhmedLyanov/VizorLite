import express from 'express';
import { auth } from '../middleware/auth.js';
import { avatarUpload } from "../middleware/upload.middleware.js";
import {
  uploadAvatar,
  deleteAvatar,
  getAvatar
} from '../controllers/profile.controller.js';

const router = express.Router();

router.use(auth);

router.post('/avatar', auth, avatarUpload, uploadAvatar);

router.delete('/avatar', deleteAvatar);

router.get('/avatar', getAvatar);

router.get('/avatar/:userId', getAvatar);

export default router;