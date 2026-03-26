import { useState, useRef } from 'react';
import { useChatStore } from '../../entities/chat/useChatStore';
import { message } from 'antd';
import styles from './Chat.module.css';
import sendIcon from '../../shared/assets/send.svg';
import sendBinaryFile from '../../shared/assets/clip.svg';
import downloadIcon from '../../shared/assets/download.svg';
import zoomIcon from '../../shared/assets/zoom.svg';
import ImagePreviewModal from './ImagePreview';
import {
  CHAT_CONFIG,
  ALLOWED_FILE_TYPES,
  FILE_ACCEPT_EXTENSIONS,
} from '../../shared/constants/chat';
import {
  formatFileSize,
  isImageFile,
  isDocumentFile,
  formatMessageWithLinks,
} from '../../shared/lib/chat/index.tsx';
import { useChatSocket, useChatScroll, useFileInput } from '../../shared/hooks/chat';

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
    resetUnreadCount,
  } = useChatStore();
  useChatSocket({ socket, roomId, addMessage, setMessages });
  useChatScroll({ isOpen, messages, messagesEndRef });
  const { resetFileInput } = useFileInput({ fileInputRef });

  const sendMessage = (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!messageText.trim() || !socket || !roomId) return;

    const messageData = {
      roomId,
      userId,
      userName: userName || 'Аноним',
      content: messageText.trim(),
    };

    socket.emit('chat-message', messageData);
    setMessageText('');
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !roomId) return;

    if (file.size > CHAT_CONFIG.MAX_FILE_SIZE) {
      message.error('Файл слишком большой (макс. 10MB)');
      resetFileInput();
      return;
    }

    if (!ALLOWED_FILE_TYPES.includes(file.type as (typeof ALLOWED_FILE_TYPES)[number])) {
      message.error('Недопустимый тип файла');
      resetFileInput();
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
          Authorization: `Bearer ${token}`,
        },
        body: formData,
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
      resetFileInput();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleToggleChat = () => {
    toggleChat();
    resetUnreadCount();
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

  return (
    <>
      <div className={styles.chatToggleContainer}>
        <button
          className={styles.chatToggleButton}
          onClick={handleToggleChat}
          aria-label={isOpen ? 'Закрыть чат' : 'Открыть чат'}
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
                          {new Date(message.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
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
                                  <span className={styles.fileSize}>
                                    {formatFileSize(file.size)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ) : isDocumentFile(file) ? (
                            <div className={styles.documentContainer}>
                              <div className={styles.documentWrapper}>
                                <div className={styles.fileIconLarge}>📄</div>
                                <div className={styles.documentInfo}>
                                  <div className={styles.fileName}>{file.name}</div>
                                  <div className={styles.fileSize}>
                                    {formatFileSize(file.size)}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className={styles.fileContainer}>
                              <div className={styles.fileWrapper}>
                                <span className={styles.fileIcon}>📎</span>
                                <span className={styles.fileName}>{file.name}</span>
                                <span className={styles.fileSize}>
                                  {formatFileSize(file.size)}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className={styles.textMessage}>
                          {formatMessageWithLinks(message.content, styles.messageLink)}
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
                accept={FILE_ACCEPT_EXTENSIONS}
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
                placeholder={isUploading ? 'Загрузка файла...' : 'Введите сообщение...'}
                rows={1}
                maxLength={CHAT_CONFIG.MAX_MESSAGE_LENGTH}
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
