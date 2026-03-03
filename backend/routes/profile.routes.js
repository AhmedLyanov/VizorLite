import express from 'express';
import { auth } from '../middleware/auth.js';
import {
  upload,
  handleUploadError,
  uploadAvatar,
  deleteAvatar,
  getAvatar
} from '../controllers/profile.controller.js';

const router = express.Router();

router.use(auth);

router.post('/avatar', 
  (req, res, next) => {
    upload(req, res, (err) => {
      if (err) {
        return handleUploadError(err, req, res, next);
      }
      next();
    });
  },
  uploadAvatar
);

router.delete('/avatar', deleteAvatar);

router.get('/avatar', getAvatar);

router.get('/avatar/:userId', getAvatar);

export default router;