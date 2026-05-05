import { create } from 'zustand';

import type { ChatMessage } from './types';

interface ChatStore {
  messages: ChatMessage[];
  isOpen: boolean;
  unreadCount: number;
  isLoading: boolean;
  
  addMessage: (message: ChatMessage) => void;
  setMessages: (messages: ChatMessage[]) => void;
  clearMessages: () => void;
  toggleChat: () => void;
  openChat: () => void;
  closeChat: () => void;
  resetUnreadCount: () => void;
  incrementUnreadCount: () => void;
  setLoading: (loading: boolean) => void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  messages: [],
  isOpen: false,
  unreadCount: 0,
  isLoading: false,
  
  addMessage: (message) => {
    const { isOpen } = get();
    set((state) => ({
      messages: [...state.messages, message],
      unreadCount: !isOpen ? state.unreadCount + 1 : 0
    }));
  },
  
  setMessages: (messages) => {
    set({ messages });
  },
  
  clearMessages: () => {
    set({ messages: [] });
  },
  
  toggleChat: () => {
    const isOpen = !get().isOpen;
    set({ 
      isOpen,
      unreadCount: isOpen ? 0 : get().unreadCount
    });
  },
  
  openChat: () => {
    set({ isOpen: true, unreadCount: 0 });
  },
  
  closeChat: () => {
    set({ isOpen: false });
  },
  
  resetUnreadCount: () => {
    set({ unreadCount: 0 });
  },
  
  incrementUnreadCount: () => {
    const { isOpen } = get();
    if (!isOpen) {
      set((state) => ({ unreadCount: state.unreadCount + 1 }));
    }
  },
  
  setLoading: (loading) => {
    set({ isLoading: loading });
  }
}));
