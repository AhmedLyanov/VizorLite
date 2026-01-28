import Room from '../models/Room.model.js';
import { v4 as uuidv4 } from 'uuid';

export const createRoom = async (req, res) => {
  try {
    const { name, settings } = req.body;
    const userId = req.userId;

    const roomId = uuidv4().split('-')[0];

    const room = new Room({
      roomId,
      name: name || `Комната ${roomId}`,
      host: userId,
      participants: [{
        user: userId,
        socketId: ''
      }],
      settings: settings || {}
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

    if (room.participants.length >= room.settings.maxParticipants) {
      return res.status(400).json({
        success: false,
        message: 'Комната переполнена'
      });
    }

    const isAlreadyParticipant = room.participants.some(
      p => p.user.toString() === userId.toString()
    );

    if (!isAlreadyParticipant) {
      room.participants.push({
        user: userId,
        socketId: ''
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

    room.participants = room.participants.filter(
      p => p.user.toString() !== userId.toString()
    );
    
    await room.save();

    res.status(200).json({
      success: true,
      message: 'Вы покинули комнату'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Ошибка выхода из комнаты',
      error: error.message
    });
  }
};