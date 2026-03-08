import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  roomId: {
    type: String,
    required: true,
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  userName: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  type: {
    type: String,
    enum: ['text', 'system'],
    default: 'text'
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

messageSchema.index({ roomId: 1, timestamp: -1 });

export default mongoose.model('Message', messageSchema);
