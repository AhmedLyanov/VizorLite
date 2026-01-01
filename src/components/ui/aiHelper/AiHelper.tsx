import { useState } from 'react';
import styles from './AiHelper.module.css';
import { AI_TEXT } from '../../../constants/common/ai';

type Props = {}

export default function AssistantModal({}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<string[]>([]);

  const handleSendMessage = () => {
    if (message.trim()) {
      setMessages([...messages, message]);
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className={styles.assistantContainer}>
      <button 
        className={styles.assistantToggleBtn}
        onClick={() => setIsOpen(!isOpen)}
      >
        {AI_TEXT.BUTTONS.TOGGLE}
      </button>
      
      {isOpen && (
        <div className={styles.assistantModal}>
          <div className={styles.assistantHeader}>
            <h3 className={styles.assistantTitle}>{AI_TEXT.TITLE.MAIN}</h3>
            <button 
              className={styles.closeBtn}
              onClick={() => setIsOpen(false)}
            >
              {AI_TEXT.BUTTONS.CLOSE}
            </button>
          </div>

          <div className={styles.assistantBody}>
            <div className={styles.messagesContainer}>
              {messages.length === 0 ? (
                <div className={styles.welcomeMessage}>
                  <p>{AI_TEXT.MESSAGES.WELCOME}</p>
                </div>
              ) : (
                messages.map((msg, index) => (
                  <div key={index} className={`${styles.message} ${styles.userMessage}`}>
                    {msg}
                  </div>
                ))
              )}
            </div>

            <div className={styles.inputContainer}>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={AI_TEXT.MESSAGES.PLACEHOLDER}
                rows={2}
              />
              <button 
                className={styles.sendButton}
                onClick={handleSendMessage}
                disabled={!message.trim()}
              >
                {AI_TEXT.BUTTONS.SEND}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}