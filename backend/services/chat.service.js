import Message from '../models/Message.model.js';

export const saveMessage = async (roomId, userId, userName, content, type = 'text') => {
  try {
    const message = new Message({
      roomId,
      userId,
      userName,
      content,
      type
    });
    await message.save();
    return message;
  } catch (error) {
    console.error('Error saving message:', error);
    throw error;
  }
};

export const getRoomMessages = async (roomId, limit = 50) => {
  try {
    const messages = await Message.find({ roomId })
      .sort({ timestamp: -1 })
      .limit(limit)
      .populate('userId', 'username avatar');
    
    return messages.reverse();
  } catch (error) {
    console.error('Error getting messages:', error);
    throw error;
  }
};
