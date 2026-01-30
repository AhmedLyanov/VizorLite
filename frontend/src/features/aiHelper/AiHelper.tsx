import {useState} from "react"
import type { KeyboardEvent } from "react";
import { useIntl } from "react-intl";
import { Popover, Badge } from "antd";
import { useAiStore } from "../../entities/ai/useAi";
import { AI_TEXT } from "../../shared/constants/common/ai";
import styles from "./AiHelper.module.css";

export default function AiHelperAntd() {
  const intl = useIntl();
  const [popoverOpen, setPopoverOpen] = useState(false);
  
  const {
    message,
    messages,
    openAi,
    closeAi,
    setMessage,
    sendMessage,
  } = useAiStore();

  const handleSendMessage = () => {
    sendMessage();
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
    } else {
      closeAi();
    }
  };

  const renderOriginalContent = () => (
    <div className={styles.assistantModal} role="dialog" aria-modal="true">
      <div className={styles.assistantHeader}>
        <h3 className={styles.assistantTitle}>
          {intl.formatMessage({ id: AI_TEXT.TITLE.MAIN })}
        </h3>

        <button
          className={styles.closeBtn}
          onClick={() => setPopoverOpen(false)}
          aria-label={intl.formatMessage({ id: AI_TEXT.BUTTONS.CLOSE })}
        >
          {intl.formatMessage({ id: AI_TEXT.BUTTONS.CLOSE })}
        </button>
      </div>

      <div className={styles.assistantBody}>
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
            messages.map((msg: string, index: number) => (
              <div
                key={index}
                className={`${styles.message} ${styles.userMessage}`}
              >
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
            placeholder={intl.formatMessage({
              id: AI_TEXT.MESSAGES.PLACEHOLDER,
            })}
            rows={2}
            aria-label="message for AI assistant"
          />

          <button
            className={styles.sendButton}
            onClick={handleSendMessage}
            disabled={!message.trim()}
            aria-label={intl.formatMessage({
              id: AI_TEXT.BUTTONS.SEND,
            })}
            title={intl.formatMessage({
              id: AI_TEXT.BUTTONS.SEND,
            })}
          >
            <img
              src="/images/send.svg"
              alt="send message to AI"
              width={30}
              height={30}
            />
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
        placement="topRight"
        overlayClassName={styles.aiPopover}
        arrow={false}
        destroyTooltipOnHide
      >
          <Badge 
            count={messages.length > 0 ? messages.length : null} 
            size="small"
            offset={[-5, 5]}
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