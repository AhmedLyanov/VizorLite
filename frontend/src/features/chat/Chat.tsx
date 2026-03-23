import { useState, useEffect, useRef } from 'react';
import { useChatStore } from '../../entities/chat/useChatStore';
import type { ChatMessage } from '../../entities/chat/types';
import { message } from 'antd';  
import styles from './Chat.module.css';
import sendIcon from '../../shared/assets/send.svg';
import sendBinaryFile from "../../shared/assets/clip.svg";
import fileIcon from '../../shared/assets/clip.svg';  

interface ChatProps {
  socket: any;
  roomId: string;
  userId: string | null;
  userName: string;
}

export default function Chat({ socket, roomId, userId, userName }: ChatProps) {
  const [messageText, setMessageText] = useState('');
  const [isUploading, setIsUploading] = useState(false);  
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

  return (
    <>
      <div className={styles.chatToggleContainer}>
        <button
          className={styles.chatToggleButton}
          onClick={handleToggleChat}
          aria-label={isOpen ? "Закрыть чат" : "Открыть чат"}
        >
          <img src={sendIcon} alt="💬" />
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
            <button
              className={styles.chatCloseButton}
              onClick={handleToggleChat}
              aria-label="Закрыть чат"
            >
              ✕
            </button>
          </div>

          <div className={styles.chatBody} ref={chatBodyRef}>
            {messages.length === 0 ? (
              <div className={styles.emptyChat}>
                <div className={styles.emptyChatText}>
                  Чат пуст. Напишите первое сообщение!
                </div>
              </div>
            ) : (
              <>
                {messages.map((message, index) => {
                  const isUser = message.userId === userId;
                  const isSystem = message.type === 'system';
                  const isFile = message.type === 'file';

                  return (
                    <div
                      key={message._id || index}
                      className={`${styles.message} ${
                        isSystem
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
                        {isFile && message.file ? (
                          <div className={styles.fileMessage}>
                            {message.file.fileType === 'image' ? (  
                              <div className={styles.fileImage}>
                                <img 
                                  src={`${import.meta.env.VITE_API_URL}${message.file.url}`} 
                                  alt={message.file.name}
                                  loading="lazy"
                                />
                              </div>
                            ) : (
                              <a 
                                href={`${import.meta.env.VITE_API_URL}${message.file.url}`} 
                                download={message.file.name}
                                className={styles.fileLink}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <span className={styles.fileIcon}>📄</span>
                                <span className={styles.fileName}>{message.file.name}</span>
                                <span className={styles.fileSize}>{formatFileSize(message.file.size)}</span>
                              </a>
                            )}
                          </div>
                        ) : (
                          message.content
                        )}
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </>
            )}
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
                <img src={sendBinaryFile} alt="📎" />
              </button>

              <button
                type="submit"
                className={styles.chatSendButton}
                disabled={!messageText.trim() || isLoading || isUploading}
                aria-label="Отправить сообщение"
              >
                <img src={sendIcon} alt="➤" />
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
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
