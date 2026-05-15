// Shared types between frontend and backend

export enum ChoiceDecision {
  REJECT = "REJECT",
  ACCEPT = "ACCEPT",
  DELAY = "DELAY",
}

export interface User {
  id: number;
  name: string;
}

export interface Prompt {
  id: number;
  content: string;
  category?: string;
}

export interface Choice {
  userId: number;
  promptId: number;
  decision: ChoiceDecision;
  createdAt: string;
}

export interface Entry {
  id: number;
  userId: number;
  promptId?: number;
  content: string;
  createdAt: string;
  updatedAt: string;
}

// API Response types
export interface GetPromptsResponse {
  data: Prompt[];
}

export interface CreateChoiceRequest {
  userId: number;
  promptId: number;
  decision: ChoiceDecision;
}

export interface CreateEntryRequest {
  userId: number;
  promptId?: number;
  content: string;
}

export interface UpdateEntryRequest {
  content: string;
}

export interface GetEntriesResponse {
  entries: Entry[];
  total: number;
  page: number;
}
