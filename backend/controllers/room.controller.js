import Room from '../models/Room.model.js';
import { nanoid } from 'nanoid';
const generateUniqueRoomId = async () => {
  let roomId;
  let roomExists;
  
  do {
    roomId = nanoid(12); 
    roomExists = await Room.findOne({ roomId });
  } while (roomExists); 
  
  return roomId;
};

export const createRoom = async (req, res) => {
  try {
    const { name, settings } = req.body;
    const userId = req.userId;
    const roomId = await generateUniqueRoomId();

    const room = new Room({
      roomId,
      name: name || `Комната ${roomId}`,
      host: userId,
      participants: [{
        user: userId,
        socketId: ''
      }],
      settings: settings || {
        maxParticipants: 10,
        recordingEnabled: false,
        screenSharingEnabled: true,
        chatEnabled: true
      }
    });

    await room.save();
    
    res.status(201).json({
      success: true,
      data: {
        roomId: room.roomId,
        name: room.name,
        host: room.host,
        settings: room.settings,
        createdAt: room.createdAt
      }
    });
  } catch (error) {
    console.error('Error creating room:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка создания комнаты',
      error: error.message
    });
  }
};

export const joinRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    const userId = req.userId;

    const room = await Room.findOne({ roomId });
    
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Комната не найдена'
      });
    }

    if (!room.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Комната неактивна'
      });
    }

    const maxParticipants = room.settings?.maxParticipants || 10;
    if (room.participants.length >= maxParticipants) {
      return res.status(400).json({
        success: false,
        message: `Комната переполнена (максимум ${maxParticipants} участников)`
      });
    }

    const isAlreadyParticipant = room.participants.some(
      p => p.user.toString() === userId.toString()
    );

    if (!isAlreadyParticipant) {
      room.participants.push({
        user: userId,
        socketId: '',
        joinedAt: new Date()
      });
      await room.save();
    }

    res.status(200).json({
      success: true,
      data: {
        roomId: room.roomId,
        name: room.name,
        host: room.host,
        participants: room.participants,
        settings: room.settings,
        isActive: room.isActive
      }
    });
  } catch (error) {
    console.error('Error joining room:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка входа в комнату',
      error: error.message
    });
  }
};

export const getRoomDetails = async (req, res) => {
  try {
    const { roomId } = req.params;
    
    const room = await Room.findOne({ roomId })
      .populate('host', 'username email avatar')
      .populate('participants.user', 'username email avatar');
    
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Комната не найдена'
      });
    }

    res.status(200).json({
      success: true,
      data: room
    });
  } catch (error) {
    console.error('Error getting room details:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка получения данных комнаты',
      error: error.message
    });
  }
};

export const endRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    const userId = req.userId;

    const room = await Room.findOne({ roomId });
    
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Комната не найдена'
      });
    }

    if (room.host.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Только организатор может завершить комнату'
      });
    }

    room.isActive = false;
    room.endedAt = new Date();
    await room.save();

    res.status(200).json({
      success: true,
      message: 'Комната завершена'
    });
  } catch (error) {
    console.error('Error ending room:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка завершения комнаты',
      error: error.message
    });
  }
};

export const getUserRooms = async (req, res) => {
  try {
    const userId = req.userId;
    
    const rooms = await Room.find({
      $or: [
        { host: userId },
        { 'participants.user': userId }
      ],
      isActive: true
    })
    .populate('host', 'username avatar')
    .sort('-createdAt')
    .limit(20);

    res.status(200).json({
      success: true,
      data: rooms
    });
  } catch (error) {
    console.error('Error getting user rooms:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка получения комнат пользователя',
      error: error.message
    });
  }
};

export const leaveRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    const userId = req.userId;

    const room = await Room.findOne({ roomId });
    
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Комната не найдена'
      });
    }

    const participantIndex = room.participants.findIndex(
      p => p.user.toString() === userId.toString()
    );
    
    if (participantIndex === -1) {
      return res.status(400).json({
        success: false,
        message: 'Вы не являетесь участником этой комнаты'
      });
    }

    room.participants.splice(participantIndex, 1);
    
    if (room.participants.length === 0 && room.host.toString() !== userId.toString()) {
      room.isActive = false;
      room.endedAt = new Date();
    }
    
    await room.save();

    res.status(200).json({
      success: true,
      message: 'Вы покинули комнату'
    });
  } catch (error) {
    console.error('Error leaving room:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка выхода из комнаты',
      error: error.message
    });
  }
};