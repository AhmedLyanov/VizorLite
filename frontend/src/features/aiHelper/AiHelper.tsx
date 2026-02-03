import { useState, useEffect } from "react";
import type { KeyboardEvent } from "react";
import { useIntl } from "react-intl";
import { Popover, Badge, Spin, Alert } from "antd";
import { useAiStore } from "../../entities/ai/useAi";
import sendIcon from "../../shared/assets/send.svg";
import { AI_TEXT } from "../../shared/constants/common/ai";
import styles from "./AiHelper.module.css";

export default function AiHelperAntd() {
  const intl = useIntl();
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const {
    message,
    messages,
    isLoading,
    error,
    isServiceAvailable,
    openAi,
    closeAi,
    setMessage,
    sendMessage,
    checkServiceStatus,
    setError,
  } = useAiStore();

  useEffect(() => {
    checkServiceStatus();
  }, [checkServiceStatus]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    await sendMessage();
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleOpenChange = (open: boolean) => {
    setPopoverOpen(open);
    if (open) {
      openAi();
      checkServiceStatus();
    } else {
      closeAi();
    }
  };

  const renderOriginalContent = () => (
    <div
      className={styles.assistantModal}
      role="dialog"
      aria-modal="true"
      aria-label={intl.formatMessage({ id: AI_TEXT.TITLE.MAIN })}
    >
      <div className={styles.assistantHeader}>
        <h3 className={styles.assistantTitle}>
          {intl.formatMessage({ id: AI_TEXT.TITLE.MAIN })}
        </h3>

        <button
          className={styles.closeBtn}
          onClick={() => setPopoverOpen(false)}
          aria-label={intl.formatMessage({ id: AI_TEXT.BUTTONS.CLOSE })}
        >
          ✕
        </button>
      </div>

      <div className={styles.assistantBody}>
        {!isServiceAvailable && (
          <div className={styles.alertWrapper}>
            <Alert
              type="warning"
              showIcon
              closable
              message="AI Service Unavailable"
              description="The AI assistant service is currently unavailable. Please try again later."
              onClose={() => { }}
            />
          </div>
        )}

        {error && (
          <div className={styles.alertWrapper}>
            <Alert
              type="error"
              showIcon
              closable
              message="Error"
              description={error}
              onClose={() => setError(null)}
            />
          </div>
        )}

        <div className={styles.messagesContainer}>
          {messages.length === 0 ? (
            <div className={styles.welcomeMessage}>
              <p>
                {intl.formatMessage({
                  id: AI_TEXT.MESSAGES.WELCOME,
                })}
              </p>
            </div>
          ) : (
            messages.map((msg, index) => (
              <div
                key={index}
                className={`${styles.message} ${msg.role === 'user' ? styles.userMessage : styles.assistantMessage
                  }`}
              >
                <div className={styles.messageContent}>
                  {msg.content}
                </div>
                <span className={styles.messageTime}>
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            ))
          )}

          {isLoading && (
            <div className={styles.loadingIndicator}>
              <Spin size="small" />
              <span>Thinking...</span>
            </div>
          )}
        </div>

        <div className={styles.inputContainer}>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={intl.formatMessage({
              id: AI_TEXT.MESSAGES.PLACEHOLDER,
            })}
            rows={isMobile ? 1 : 2}
            maxLength={500}
            aria-label="message for AI assistant"
            disabled={isLoading || !isServiceAvailable}
            className={styles.textarea}
          />

          <button
            className={styles.sendButton}
            onClick={handleSendMessage}
            disabled={!message.trim() || isLoading || !isServiceAvailable}
            aria-label={intl.formatMessage({
              id: AI_TEXT.BUTTONS.SEND,
            })}
            title={intl.formatMessage({
              id: AI_TEXT.BUTTONS.SEND,
            })}
          >
            {isLoading ? (
              <Spin size="small" />
            ) : (
              <img
                src={sendIcon}
                alt="send message"
                className={styles.sendIcon}
              />
            )}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className={styles.assistantContainer}>
      <Popover
        content={renderOriginalContent}
        trigger="click"
        open={popoverOpen}
        onOpenChange={handleOpenChange}
        placement={isMobile ? "top" : "topRight"}
        overlayClassName={styles.aiPopover}
        arrow={false}
        destroyTooltipOnHide
        overlayStyle={{
          width: isMobile ? 'calc(100vw - 32px)' : 'auto',
          maxWidth: isMobile ? '100%' : '500px'
        }}
      >
        <Badge
          count={messages.filter(m => m.role === 'assistant').length > 0
            ? messages.filter(m => m.role === 'assistant').length
            : null}
          size="small"
          offset={isMobile ? [-3, 3] : [-5, 5]}
          color="#108ee9"
          className={styles.badge}
        >
          <button
            className={styles.assistantToggleBtn}
            onClick={() => setPopoverOpen(!popoverOpen)}
            aria-label={intl.formatMessage({ id: AI_TEXT.BUTTONS.TOGGLE })}
            aria-expanded={popoverOpen}
          >
            {intl.formatMessage({ id: AI_TEXT.BUTTONS.TOGGLE })}
          </button>
        </Badge>
      </Popover>
    </div>
  );
}