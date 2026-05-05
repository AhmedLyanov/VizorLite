import { useState, useRef } from "react";
import { useIntl } from "react-intl";
import { message } from "antd";

import { useChatStore } from "@/entities/chat/useChatStore";

import {
  useChatSocket,
  useChatScroll,
  useFileInput,
} from "@/shared/hooks/chat";

import {
  CHAT_CONFIG,
  ALLOWED_FILE_TYPES,
  FILE_ACCEPT_EXTENSIONS,
} from "@/shared/constants/chat";

import {
  formatFileSize,
  isImageFile,
  isDocumentFile,
  formatMessageWithLinks,
} from "@/shared/lib/chat";

import sendIcon from "@/shared/assets/send.svg";
import sendBinaryFile from "@/shared/assets/clip.svg";
import downloadIcon from "@/shared/assets/download.svg";
import zoomIcon from "@/shared/assets/zoom.svg";

import ImagePreviewModal from "./ImagePreview";
import styles from "./Chat.module.css";

interface ChatProps {
  socket: any;
  roomId: string;
  userId: string | null;
  userName: string;
}

export default function Chat({ socket, roomId, userId, userName }: ChatProps) {
  const intl = useIntl();
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
      userName: userName || intl.formatMessage({ id: "chat.anonymous" }),
      content: messageText.trim(),
    };

    socket.emit('chat-message', messageData);
    setMessageText('');
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !roomId) return;

    if (file.size > CHAT_CONFIG.MAX_FILE_SIZE) {
      message.error(intl.formatMessage({ id: "chat.file.tooLarge" }));
      resetFileInput();
      return;
    }

    if (!ALLOWED_FILE_TYPES.includes(file.type as (typeof ALLOWED_FILE_TYPES)[number])) {
      message.error(intl.formatMessage({ id: "chat.file.invalidType" }));
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
      formData.append('userName', userName || intl.formatMessage({ id: "chat.anonymous" }));

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/chat/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        message.success(intl.formatMessage({ id: "chat.file.sent" }));
      } else {
        message.error(result.message || intl.formatMessage({ id: "chat.file.uploadError" }));
      }
    } catch (error) {
      console.error('File upload error:', error);
      message.error(intl.formatMessage({ id: "chat.file.uploadError" }));
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

  const handleToggleChat = () => {
    toggleChat();
    resetUnreadCount();
  };

  return (
    <>
      <div className={`${styles.chatSidebar} ${isOpen ? styles.chatSidebarOpen : ''}`}>
        <div className={styles.chatSidebarInner}>
          <div className={styles.chatHeader}>
            <h3 className={styles.chatTitle}>{intl.formatMessage({ id: "chat.title" })}</h3>
            <button
              className={styles.chatCloseButton}
              onClick={handleToggleChat}
              aria-label={intl.formatMessage({ id: "chat.close" })}
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
                            title={intl.formatMessage({ id: "chat.file.preview" })}
                          >
                            <img src={zoomIcon} alt={intl.formatMessage({ id: "chat.file.preview" })} />
                          </button>
                        )}
                        <button
                          className={styles.navigationButton}
                          onClick={() => handleDownload(file.url, file.name)}
                          title={intl.formatMessage({ id: "chat.file.download" })}
                        >
                          <img src={downloadIcon} alt={intl.formatMessage({ id: "chat.file.download" })} />
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
                aria-label={intl.formatMessage({ id: "chat.file.attach" })}
                title={intl.formatMessage({ id: "chat.file.attach" })}
              >
                <img src={sendBinaryFile} alt={intl.formatMessage({ id: "chat.file.attach" })} />
              </button>

              <textarea
                className={styles.chatInput}
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={isUploading ? intl.formatMessage({ id: "chat.file.uploading" }) : intl.formatMessage({ id: "chat.message.placeholder" })}
                rows={1}
                maxLength={CHAT_CONFIG.MAX_MESSAGE_LENGTH}
                disabled={isLoading || isUploading}
              />

              <button
                type="submit"
                className={styles.chatSendButton}
                disabled={!messageText.trim() || isLoading || isUploading}
                aria-label={intl.formatMessage({ id: "chat.message.send" })}
              >
                <img src={sendIcon} alt={intl.formatMessage({ id: "chat.message.send" })} />
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
