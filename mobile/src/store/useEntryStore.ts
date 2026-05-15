import create from "zustand";
import { api } from "../lib/api";
import { Entry } from "../types";

export type AutoSaveStatus = "idle" | "saving" | "saved" | "error";

export interface EntryState {
  entries: Entry[];
  currentEntry: Entry | null;
  currentEntryContent: string;
  loading: boolean;
  error: string | null;
  autoSaveStatus: AutoSaveStatus;
  page: number;
  hasMore: boolean;

  createEntry: (data: {
    userId: number;
    promptId?: number;
    content: string;
  }) => Promise<Entry>;
  updateEntry: (
    entryId: number,
    content: string,
    userId: number
  ) => Promise<void>;
  fetchEntries: (userId: number, pageNumber?: number) => Promise<void>;
  setCurrentEntry: (entry: Entry) => void;
  setCurrentEntryContent: (content: string) => void;
  clearCurrent: () => void;
  setAutoSaveStatus: (status: AutoSaveStatus) => void;
}

let debounceTimer: NodeJS.Timeout | null = null;

export const useEntryStore = create<EntryState>((set, get) => ({
  entries: [],
  currentEntry: null,
  currentEntryContent: "",
  loading: false,
  error: null,
  autoSaveStatus: "idle" as AutoSaveStatus,
  page: 0,
  hasMore: true,

  createEntry: async (data: {
    userId: number;
    promptId?: number;
    content: string;
  }) => {
    set({ loading: true, error: null });
    try {
      const entry = await api.post<Entry>("/entries", data);
      set({ currentEntry: entry, error: null });
      return entry;
    } catch (error: any) {
      const errorMessage = error.message || "Failed to create entry";
      console.error("createEntry error:", errorMessage);
      set({ error: errorMessage });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  updateEntry: async (
    entryId: number,
    content: string,
    userId: number
  ) => {
    // Clear previous debounce timer
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    // Update local state immediately
    set({ currentEntryContent: content, autoSaveStatus: "saving" });

    // Debounce API call
    debounceTimer = setTimeout(async () => {
      try {
        const updated = await api.put<Entry>(`/entries/${entryId}`, {
          content,
        });

        set({
          currentEntry: updated,
          autoSaveStatus: "saved",
          error: null,
        });

        // Reset saved status after 2 seconds
        setTimeout(() => {
          set({ autoSaveStatus: "idle" });
        }, 2000);
      } catch (error: any) {
        const errorMessage = error.message || "Failed to save entry";
        console.error("updateEntry error:", errorMessage);
        set({ error: errorMessage, autoSaveStatus: "error" });
      }
    }, 500);
  },

  fetchEntries: async (userId: number, pageNumber: number = 0) => {
    set({ loading: true, error: null });
    try {
      const data = await api.get<{
        entries: Entry[];
        total: number;
        page: number;
      }>(`/entries/user/${userId}?page=${pageNumber}&limit=10`);

      set((state) => ({
        entries:
          pageNumber === 0
            ? data.entries
            : [...state.entries, ...data.entries],
        page: pageNumber,
        hasMore: data.entries.length > 0,
        error: null,
      }));
    } catch (error: any) {
      const errorMessage = error.message || "Failed to fetch entries";
      console.error("fetchEntries error:", errorMessage);
      set({ error: errorMessage });
    } finally {
      set({ loading: false });
    }
  },

  setCurrentEntry: (entry: Entry) => {
    set({ currentEntry: entry, currentEntryContent: entry.content });
  },

  setCurrentEntryContent: (content: string) => {
    set({ currentEntryContent: content });
  },

  clearCurrent: () => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    set({
      currentEntry: null,
      currentEntryContent: "",
      autoSaveStatus: "idle",
    });
  },

  setAutoSaveStatus: (status: AutoSaveStatus) => {
    set({ autoSaveStatus: status });
  },
}));
