export const CHAT_CONFIG = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, 
  MAX_MESSAGE_LENGTH: 1000,
  SCROLL_DELAY_MS: 100,
  SCROLL_DELAY_ON_OPEN_MS: 200,
} as const;

export const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf',
  'text/plain',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
] as const;

export const FILE_ACCEPT_EXTENSIONS = 'image/*,.pdf,.txt,.doc,.docx,.xls,.xlsx';
