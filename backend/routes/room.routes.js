import express from 'express';
import {
  createRoom,
  joinRoom,
  getRoomDetails,
  endRoom,
  getUserRooms,
  leaveRoom
} from '../controllers/room.controller.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();
router.post('/create', auth, createRoom);
router.post('/join/:roomId', auth, joinRoom);
router.get('/:roomId', auth, getRoomDetails);
router.delete('/:roomId/end', auth, endRoom);
router.post('/:roomId/leave', auth, leaveRoom);
router.get('/user/rooms', auth, getUserRooms);

export default router;