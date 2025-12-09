const express = require('express');
const Room = require('../models/Room');
const auth = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

const router = express.Router();

router.post('/', auth, [
  body('name').trim().isLength({ min: 1 }).withMessage('Room name is required'),
  body('isPublic').optional().isBoolean().withMessage('isPublic must be a boolean')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, description, maxParticipants, isPublic } = req.body;

  try {
    const roomId = Math.random().toString(36).substring(2, 10).toUpperCase();

    const room = new Room({
      roomId,
      owner: req.user.userId,
      name,
      description: description || '',
      maxParticipants: maxParticipants || 10,
      isPublic: isPublic !== undefined ? isPublic : true
    });

    await room.save();

    res.status(201).json({
      room: {
        id: room._id,
        roomId: room.roomId,
        name: room.name,
        description: room.description,
        maxParticipants: room.maxParticipants,
        isPublic: room.isPublic,
        owner: req.user.userId
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ errors: [{ msg: 'Server error' }] });
  }
});

router.get('/:roomId', async (req, res) => {
  try {
    const room = await Room.findOne({ roomId: req.params.roomId })
      .populate('owner', 'username email')
      .populate('participants.userId', 'username email');

    if (!room) {
      return res.status(404).json({ errors: [{ msg: 'Room not found' }] });
    }

    if (!room.isPublic) {
      return res.status(404).json({ errors: [{ msg: 'Room not found' }] });
    }

    res.json({
      room: {
        id: room._id,
        roomId: room.roomId,
        name: room.name,
        description: room.description,
        maxParticipants: room.maxParticipants,
        isPublic: room.isPublic,
        owner: room.owner,
        participants: room.participants,
        createdAt: room.createdAt
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ errors: [{ msg: 'Server error' }] });
  }
});

router.post('/join/:roomId', auth, async (req, res) => {
  try {
    const room = await Room.findOne({ roomId: req.params.roomId });

    if (!room) {
      return res.status(404).json({ errors: [{ msg: 'Room not found' }] });
    }

    if (room.participants.length >= room.maxParticipants) {
      return res.status(400).json({ errors: [{ msg: 'Room is at maximum capacity' }] });
    }

    const isParticipant = room.participants.some(
      p => p.userId.toString() === req.user.userId.toString()
    );

    if (!isParticipant) {
      room.participants.push({ userId: req.user.userId });
      await room.save();
    }

    res.json({
      room: {
        id: room._id,
        roomId: room.roomId,
        name: room.name,
        description: room.description
      },
      joined: true
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ errors: [{ msg: 'Server error' }] });
  }
});

router.get('/', async (req, res) => {
  try {
    const rooms = await Room.find({ isPublic: true })
      .populate('owner', 'username')
      .select('roomId name description maxParticipants createdAt owner')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      rooms: rooms.map(room => ({
        id: room._id,
        roomId: room.roomId,
        name: room.name,
        description: room.description,
        maxParticipants: room.maxParticipants,
        owner: room.owner,
        createdAt: room.createdAt
      }))
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ errors: [{ msg: 'Server error' }] });
  }
});

module.exports = router;