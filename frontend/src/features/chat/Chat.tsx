import { useState, useEffect, useRef } from 'react';
import { useChatStore } from '../../entities/chat/useChatStore';
import type { ChatMessage } from '../../entities/chat/types';
import { message } from 'antd';
import styles from './Chat.module.css';
import sendIcon from '../../shared/assets/send.svg';
import sendBinaryFile from "../../shared/assets/clip.svg";
import downloadIcon from '../../shared/assets/download.svg';
import zoomIcon from '../../shared/assets/zoom.svg';
import ImagePreviewModal from './ImagePreview';

interface ChatProps {
  socket: any;
  roomId: string;
  userId: string | null;
  userName: string;
}

export default function Chat({ socket, roomId, userId, userName }: ChatProps) {
  const [messageText, setMessageText] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatBodyRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    messages,
    isOpen,
    unreadCount,
    isLoading,
    addMessage,
    setMessages,
    toggleChat,
    resetUnreadCount
  } = useChatStore();

  const scrollToBottom = (_behavior = 'smooth') => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' as ScrollBehavior });
    }
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => scrollToBottom('auto'), 200);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && messages.length > 0) {
      setTimeout(() => scrollToBottom('smooth'), 100);
    }
  }, [messages, isOpen]);

  useEffect(() => {
    if (!socket || !roomId) return;

    const handleChatMessage = (message: ChatMessage) => {
      addMessage(message);
    };

    socket.on('chat-message', handleChatMessage);

    socket.emit('get-chat-history', { roomId }, (history: ChatMessage[]) => {
      setMessages(history);
    });

    return () => {
      socket.off('chat-message', handleChatMessage);
    };
  }, [socket, roomId, addMessage, setMessages]);

  const sendMessage = (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!messageText.trim() || !socket || !roomId) return;

    const messageData = {
      roomId,
      userId,
      userName: userName || 'Аноним',
      content: messageText.trim()
    };

    socket.emit('chat-message', messageData);
    setMessageText('');
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !roomId) return;

    if (file.size > 10 * 1024 * 1024) {
      message.error('Файл слишком большой (макс. 10MB)');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'application/pdf', 'text/plain',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (!allowedTypes.includes(file.type)) {
      message.error('Недопустимый тип файла');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setIsUploading(true);

    try {
      const token = localStorage.getItem('token');

      const formData = new FormData();
      formData.append('file', file);
      formData.append('roomId', roomId);
      formData.append('userId', userId || '');
      formData.append('userName', userName || 'Аноним');

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/chat/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const result = await response.json();

      if (result.success) {
        message.success('Файл отправлен');
      } else {
        message.error(result.message || 'Ошибка загрузки файла');
      }
    } catch (error) {
      console.error('File upload error:', error);
      message.error('Ошибка загрузки файла');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleToggleChat = () => {
    toggleChat();
    resetUnreadCount();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleDownload = (url: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = `${import.meta.env.VITE_API_URL}${url}`;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePreviewImage = (url: string) => {
    setPreviewImage(`${import.meta.env.VITE_API_URL}${url}`);
    setIsPreviewOpen(true);
  };

  const handleClosePreview = () => {
    setIsPreviewOpen(false);
    setPreviewImage(null);
  };

  const isImageFile = (file: any) => {
    return file?.fileType === 'image' ||
      file?.mimeType?.startsWith('image/') ||
      /\.(jpg|jpeg|png|gif|webp)$/i.test(file?.name || '');
  };

  const isDocumentFile = (file: any) => {
    return file?.fileType === 'document' ||
      file?.mimeType?.startsWith('application/') ||
      /\.(pdf|doc|docx|txt|xls|xlsx)$/i.test(file?.name || '');
  };

  return (
    <>
      <div className={styles.chatToggleContainer}>
        <button
          className={styles.chatToggleButton}
          onClick={handleToggleChat}
          aria-label={isOpen ? "Закрыть чат" : "Открыть чат"}
        >
          <img src={sendIcon} alt="Чат" />
          {!isOpen && unreadCount > 0 && (
            <span className={styles.chatUnreadBadge}>
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </button>
      </div>

      <div className={`${styles.chatSidebar} ${isOpen ? styles.chatSidebarOpen : ''}`}>
        <div className={styles.chatSidebarInner}>
          <div className={styles.chatHeader}>
            <h3 className={styles.chatTitle}>Чат</h3>
            <button
              className={styles.chatCloseButton}
              onClick={handleToggleChat}
              aria-label="Закрыть чат"
            >
              ✕
            </button>
          </div>

          <div className={styles.chatBody} ref={chatBodyRef}>
            <>
              {messages.map((message, index) => {
                const isUser = message.userId === userId;
                const isSystem = message.type === 'system';
                const isFile = message.type === 'file';
                const file = message.file;

                return (
                  <div
                    key={message._id || index}
                    className={`${styles.message} ${isSystem
                        ? styles.messageSystem
                        : isUser
                          ? styles.messageUser
                          : styles.messageOther
                      }`}
                  >
                    {!isSystem && (
                      <div className={styles.messageHeader}>
                        <span className={styles.messageUserName}>
                          {message.userName}
                        </span>
                        <span className={styles.messageTime}>
                          {formatTime(message.timestamp)}
                        </span>
                      </div>
                    )}
                    <div className={styles.messageContent}>
                      {isFile && file ? (
                        <div className={styles.fileMessage}>
                          {isImageFile(file) ? (
                            <div className={styles.imageContainer}>
                              <img
                                src={`${import.meta.env.VITE_API_URL}${file.url}`}
                                alt={file.name}
                                loading="lazy"
                                className={styles.fileImage}
                                onClick={() => handlePreviewImage(file.url)}
                              />
                              <div className={styles.imageInfo}>
                                <div className={styles.fileInfoText}>
                                  <span className={styles.fileName}>{file.name}</span>
                                  <span className={styles.fileSize}>{formatFileSize(file.size)}</span>
                                </div>
                              </div>
                            </div>
                          ) : isDocumentFile(file) ? (
                            <div className={styles.documentContainer}>
                              <div className={styles.documentWrapper}>
                                <div className={styles.fileIconLarge}>📄</div>
                                <div className={styles.documentInfo}>
                                  <div className={styles.fileName}>{file.name}</div>
                                  <div className={styles.fileSize}>{formatFileSize(file.size)}</div>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className={styles.fileContainer}>
                              <div className={styles.fileWrapper}>
                                <span className={styles.fileIcon}>📎</span>
                                <span className={styles.fileName}>{file.name}</span>
                                <span className={styles.fileSize}>{formatFileSize(file.size)}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className={styles.textMessage}>
                          {message.content}
                        </div>
                      )}
                    </div>

                    {isFile && file && (
                      <div className={styles.messageNavigation}>
                        {isImageFile(file) && (
                          <button
                            className={styles.navigationButton}
                            onClick={() => handlePreviewImage(file.url)}
                            title="Просмотреть"
                          >
                            <img src={zoomIcon} alt="Просмотр" />
                          </button>
                        )}
                        <button
                          className={styles.navigationButton}
                          onClick={() => handleDownload(file.url, file.name)}
                          title="Скачать"
                        >
                          <img src={downloadIcon} alt="Скачать" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </>
          </div>

          <div className={styles.chatFooter}>
            <form className={styles.chatForm} onSubmit={sendMessage}>
              <input
                ref={fileInputRef}
                type="file"
                style={{ display: 'none' }}
                onChange={handleFileSelect}
                accept="image/*,.pdf,.txt,.doc,.docx,.xls,.xlsx"
                disabled={isUploading}
              />

              <button
                type="button"
                className={styles.chatSendFileButton}
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                aria-label="Прикрепить файл"
                title="Прикрепить файл"
              >
                <img src={sendBinaryFile} alt="Прикрепить" />
              </button>

              <textarea
                className={styles.chatInput}
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={isUploading ? "Загрузка файла..." : "Введите сообщение..."}
                rows={1}
                maxLength={1000}
                disabled={isLoading || isUploading}
              />

              <button
                type="submit"
                className={styles.chatSendButton}
                disabled={!messageText.trim() || isLoading || isUploading}
                aria-label="Отправить сообщение"
              >
                <img src={sendIcon} alt="Отправить" />
              </button>
            </form>
          </div>
        </div>
      </div>

      <ImagePreviewModal
        isOpen={isPreviewOpen}
        imageUrl={previewImage}
        onClose={handleClosePreview}
        onDownload={handleDownload}
      />
    </>
  );
}