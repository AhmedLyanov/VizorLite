import { create } from "zustand";
import { persist } from "zustand/middleware";
import { aiApi } from "../../shared/api/aiApi";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

interface ApiError {
  response?: {
    data?: {
      error?: string;
    };
  };
  message?: string;
}

interface AiState {
  isOpen: boolean;
  message: string;
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  isServiceAvailable: boolean;

  toggleAi: () => void;
  openAi: () => void;
  closeAi: () => void;
  setMessage: (message: string) => void;
  addMessage: (message: Message) => void;
  clearMessages: () => void;
  sendMessage: () => Promise<void>;
  setError: (error: string | null) => void;
}

/**
 * Type Guard для ошибок API
 */
function isApiError(error: unknown): error is ApiError {
  return typeof error === "object" && error !== null;
}

export const useAiStore = create<AiState>()(
  persist(
    (set, get) => ({
      isOpen: false,
      message: "",
      messages: [],
      isLoading: false,
      error: null,
      isServiceAvailable: false,

      toggleAi: () => set((state) => ({ isOpen: !state.isOpen })),

      openAi: () => {
        set({ isOpen: true });
      },

      closeAi: () => set({ isOpen: false, error: null }),

      setMessage: (message: string) => set({ message, error: null }),

      addMessage: (message: Message) =>
        set((state) => ({
          messages: [...state.messages, message],
        })),

      clearMessages: () => {
        set({
          messages: [],
          error: null,
          message: "",
        });
      },

      setError: (error: string | null) => set({ error }),

      sendMessage: async () => {
        const { message, messages, addMessage, setMessage, setError } = get();

        if (!message.trim()) return;

        set({ isLoading: true, error: null });

        const userMessage: Message = {
          role: "user",
          content: message.trim(),
          timestamp: Date.now(),
        };

        try {
          addMessage(userMessage);
          setMessage("");

          const response = await aiApi.chat(userMessage.content, [
            ...messages,
            userMessage,
          ]);

          if (!response?.reply?.trim()) {
            throw new Error("empty response");
          }

          const assistantMessage: Message = {
            role: "assistant",
            content: response.reply.trim(),
            timestamp: Date.now(),
          };

          addMessage(assistantMessage);
        } catch (error: unknown) {
          console.error("AI chat error:", error);

          let errorMessage = "Failed to get response from AI";

          if (isApiError(error)) {
            if (error.response?.data?.error) {
              errorMessage = error.response.data.error;
            } else if (error.message?.includes("timeout")) {
              errorMessage = "Request timeout. Please try again.";
            } else if (error.message?.includes("empty response")) {
              errorMessage = "AI returned empty response. Please try again.";
            }
          }

          setError(errorMessage);

          set((state) => ({
            messages: state.messages.slice(0, -1),
          }));
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: "ai-storage",
      partialize: (state) => ({
        messages: state.messages.slice(-10),
      }),
    },
  ),
);
