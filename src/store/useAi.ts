import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AiState {
  isOpen: boolean;
  message: string;
  messages: string[];
  toggleAi: () => void;
  openAi: () => void;
  closeAi: () => void;
  setMessage: (message: string) => void;
  addMessage: (message: string) => void;
  clearMessages: () => void;
  sendMessage: () => void;
}

export const useAiStore = create<AiState>()(
  persist(
    (set, get) => ({
      isOpen: false,
      message: '',
      messages: [],

      toggleAi: () => set((state) => ({ isOpen: !state.isOpen })),
      
      openAi: () => set({ isOpen: true }),
      
      closeAi: () => set({ isOpen: false }),
      
      setMessage: (message: string) => set({ message }),
      
      addMessage: (message: string) => 
        set((state) => ({ 
          messages: [...state.messages, message] 
        })),
      
      clearMessages: () => set({ messages: [] }),
      
      sendMessage: () => {
        const { message, messages } = get();
        if (message.trim()) {
          set({ 
            messages: [...messages, message],
            message: '' 
          });
        }
      },
    }),
    {
      name: 'ai-markus',
    }
  )
);