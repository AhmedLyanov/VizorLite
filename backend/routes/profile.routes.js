import express from 'express';
import { auth } from '../middleware/auth.middleware.js';
import { avatarUpload, backgroundUpload } from '../middleware/upload.middleware.js';
import {
  uploadAvatar,
  uploadBackground,
  deleteAvatar,
  getAvatar,
  handleUploadError
} from '../controllers/profile.controller.js';

const router = express.Router();

router.use(auth);

router.post('/avatar', auth, avatarUpload, handleUploadError, uploadAvatar);
router.post('/background', auth, backgroundUpload, handleUploadError, uploadBackground);

router.delete('/avatar', auth, deleteAvatar);

router.get('/avatar', auth, getAvatar);

router.get('/avatar/:userId', auth, getAvatar);

export default router;