export interface ChatFile {
  url: string;
  name: string;
  size: number;
  mimeType: string;
  fileType: 'image' | 'document' | 'other';  
}

export interface ChatMessage {
  _id: string;
  userId: string | null;
  userName: string;
  content: string;
  type: 'text' | 'system' | 'file';  
  timestamp: string;
  file?: ChatFile;  
}

export interface SendMessageData {
  roomId: string;
  userId: string | null;
  userName: string;
  content: string;
  file?: ChatFile;  
}