export interface ChatMessage {
  _id: string;
  userId: string | null;
  userName: string;
  content: string;
  type: 'text' | 'system';
  timestamp: string;
}

export interface SendMessageData {
  roomId: string;
  userId: string | null;
  userName: string;
  content: string;
}
