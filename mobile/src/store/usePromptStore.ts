import create from "zustand";
import { api } from "../lib/api";
import { Prompt, ChoiceDecision, Choice } from "../types";

export interface PromptState {
  prompts: Prompt[];
  currentIndex: number;
  loading: boolean;
  error: string | null;

  fetchPrompts: (userId: number) => Promise<void>;
  handleDecision: (
    userId: number,
    promptId: number,
    decision: ChoiceDecision
  ) => Promise<void>;
  reset: () => void;
}

export const usePromptStore = create<PromptState>((set, get) => ({
  prompts: [],
  currentIndex: 0,
  loading: false,
  error: null,

  fetchPrompts: async (userId: number) => {
    set({ loading: true, error: null });
    try {
      const data = await api.get<Prompt[]>(`/prompts/available/${userId}`);
      set({ prompts: data, currentIndex: 0, error: null });
    } catch (error: any) {
      const errorMessage = error.message || "Failed to fetch prompts";
      console.error("fetchPrompts error:", errorMessage);
      set({ error: errorMessage, loading: false });
    } finally {
      set({ loading: false });
    }
  },

  handleDecision: async (
    userId: number,
    promptId: number,
    decision: ChoiceDecision
  ) => {
    try {
      // Optimistically update the UI
      set((state) => ({ currentIndex: state.currentIndex + 1 }));

      // Then sync with API
      await api.post("/choices", {
        userId,
        promptId,
        decision,
      });
    } catch (error: any) {
      const errorMessage = error.message || "Failed to save decision";
      console.error("handleDecision error:", errorMessage);
      set({ error: errorMessage });
      // Revert optimistic update on error
      set((state) => ({ currentIndex: Math.max(0, state.currentIndex - 1) }));
    }
  },

  reset: () => {
    set({ prompts: [], currentIndex: 0, loading: false, error: null });
  },
}));
