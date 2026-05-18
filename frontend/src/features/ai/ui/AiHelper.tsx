import { useState, useEffect, useRef } from "react";
import type { KeyboardEvent } from "react";
import { useIntl } from "react-intl";
import { Popover, Badge, Spin, Alert } from "antd";

import sendIcon from "@/shared/assets/send.svg";
import clearIcon from "@/shared/assets/trashIcon.svg";
import { AI_TEXT } from "@/shared/constants/common/ai";

import { useAiStore } from "../model/useAi";

import styles from "./AiHelper.module.css";

export default function AiHelperAntd() {
  const intl = useIntl();
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const AI_HINT_KEY = "ai-hint-seen";

  const {
    message,
    messages,
    isLoading,
    error,
    openAi,
    closeAi,
    setMessage,
    sendMessage,
    setError,
    clearMessages,
  } = useAiStore();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const hasSeenHint = localStorage.getItem(AI_HINT_KEY);
    if (hasSeenHint) return;
    const timer = setTimeout(() => setShowHint(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    await sendMessage();
  };

  const handleClearChat = () => {
    clearMessages();
    localStorage.removeItem("ai-storage");
    setPopoverOpen(false);
    setTimeout(() => setPopoverOpen(true), 50);
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
      localStorage.setItem(AI_HINT_KEY, "true");
      setShowHint(false);
    } else {
      closeAi();
    }
  };

  const renderOriginalContent = () => (
    <div className={styles.assistantModal}>
      <div className={styles.assistantHeader}>
        <h3 className={styles.assistantTitle}>
          {intl.formatMessage({ id: AI_TEXT.TITLE.MAIN })}
        </h3>
        <button className={styles.closeBtn} onClick={() => setPopoverOpen(false)}>
          ✕
        </button>
      </div>

      <div className={styles.assistantBody}>
        {error && (
          <div className={styles.alertWrapper}>
            <Alert
              type="error"
              showIcon
              closable
              message={intl.formatMessage({ id: "ai.error.title" })}
              description={error}
              onClose={() => setError(null)}
            />
          </div>
        )}

        <div className={styles.messagesContainer}>
          {messages.length === 0 ? (
            <div className={styles.welcomeMessage}>
              <p>{intl.formatMessage({ id: AI_TEXT.MESSAGES.WELCOME })}</p>
            </div>
          ) : (
            <>
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`${styles.message} ${msg.role === "user" ? styles.userMessage : styles.assistantMessage
                    }`}
                >
                  <div className={styles.messageContent}>{msg.content}</div>
                  <span className={styles.messageTime}>
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </>
          )}

          {isLoading && (
            <div className={styles.loadingIndicator}>
              <Spin size="small" />
              <span>{intl.formatMessage({ id: "ai.message.thinking" })}</span>
            </div>
          )}
        </div>
        <div className={styles.snippetsWords}>
          {[
            'ai.snippets.create_meeting',
            'ai.snippets.share_screen',
            'ai.snippets.mic_settings',
            'ai.snippets.invite',
            'ai.snippets.change_language',
            'ai.snippets.record_meeting'
          ].map((snippetId) => (
            <span
              key={snippetId}
              className={styles.snippets}
              onClick={() => setMessage(intl.formatMessage({ id: snippetId }))}
            >
              {intl.formatMessage({ id: snippetId })}
            </span>
          ))}
        </div>

        <div className={styles.inputContainer}>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={intl.formatMessage({ id: AI_TEXT.MESSAGES.PLACEHOLDER })}
            rows={isMobile ? 1 : 2}
            maxLength={500}
            disabled={isLoading}
            className={styles.textarea}
          />

          <button
            className={styles.sendButton}
            onClick={handleSendMessage}
            disabled={!message.trim() || isLoading}
          >
            {isLoading ? <Spin size="small" /> : <img src={sendIcon} alt="send" />}
          </button>

          <button
            className={styles.clearChat}
            onClick={handleClearChat}
            disabled={messages.length === 0}
          >
            <img src={clearIcon} alt="clear" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className={styles.assistantContainer}>
      {showHint && !popoverOpen && (
        <div className={styles.aiHint} onClick={() => setPopoverOpen(true)}>
          {intl.formatMessage({ id: "ai.hint.text" })}
        </div>
      )}

      <Popover
        content={renderOriginalContent}
        trigger="click"
        open={popoverOpen}
        onOpenChange={handleOpenChange}
        placement={isMobile ? "top" : "topRight"}
        overlayClassName={styles.aiPopover}
        arrow={false}
        destroyTooltipOnHide
      >
        <Badge count={messages.filter((m) => m.role === "assistant").length || null}>
          <button className={styles.assistantToggleBtn} onClick={() => setPopoverOpen(!popoverOpen)}>
            AI
          </button>
        </Badge>
      </Popover>
    </div>
  );
}