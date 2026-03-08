import { useState, useEffect, useRef } from 'react';
import { useIntl } from 'react-intl';
import { useChatStore } from '../../entities/chat/useChatStore';
import type { ChatMessage } from '../../entities/chat/types';
import styles from './Chat.module.css';
import sendIcon from '../../shared/assets/send.svg';

interface ChatProps {
  socket: any;
  roomId: string;
  userId: string | null;
  userName: string;
}

export default function Chat({ socket, roomId, userId, userName }: ChatProps) {
  const _intl = useIntl();
  const [messageText, setMessageText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatBodyRef = useRef<HTMLDivElement>(null);
  
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
                        {message.content}
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
              
              <button
                type="submit"
                className={styles.chatSendButton}
                disabled={!messageText.trim() || isLoading}
                aria-label="Отправить сообщение"
              >
                <img src={sendIcon} alt="➤" />
              </button>
              <textarea
                className={styles.chatInput}
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Введите сообщение..."
                rows={1}
                maxLength={1000}
                disabled={isLoading}
              />
            </form>
          </div>
        </div>
      </div>
    </>
  );
}