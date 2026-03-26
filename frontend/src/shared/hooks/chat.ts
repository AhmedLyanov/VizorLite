import { useEffect } from 'react';
import type { ChatMessage } from '../../entities/chat/types';

interface UseChatSocketOptions {
  socket: any;
  roomId: string;
  addMessage: (message: ChatMessage) => void;
  setMessages: (messages: ChatMessage[]) => void;
}

export function useChatSocket({ socket, roomId, addMessage, setMessages }: UseChatSocketOptions) {
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
}

interface UseChatScrollOptions {
  isOpen: boolean;
  messages: ChatMessage[];
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

export function useChatScroll({ isOpen, messages, messagesEndRef }: UseChatScrollOptions) {
  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior });
    }
  };

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => scrollToBottom('auto'), 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && messages.length > 0) {
      const timer = setTimeout(() => scrollToBottom('smooth'), 100);
      return () => clearTimeout(timer);
    }
  }, [messages, isOpen]);
}

interface UseFileInputOptions {
  fileInputRef: React.RefObject<HTMLInputElement | null>;
}

export function useFileInput({ fileInputRef }: UseFileInputOptions) {
  const resetFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return { resetFileInput };
}
