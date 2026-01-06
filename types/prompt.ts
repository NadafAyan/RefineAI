import { Timestamp } from "firebase/firestore";

export interface SavedPrompt {
    id: string;
    userId: string;
    createdAt: Timestamp;
    category: string;      // e.g., 'Coding', 'Writing'
    objective: string;     // Original user input
    persona: string;
    targetModel: string;
    format: string;
    tone: number;
    refinedOutput: string; // Final AI-generated prompt
    tags?: string[];
}

export interface PromptHistoryHook {
    prompts: SavedPrompt[];
    loading: boolean;
    error: string | null;
    deletePrompt: (promptId: string) => Promise<void>;
    savePrompt: (prompt: Omit<SavedPrompt, 'id' | 'userId' | 'createdAt'>) => Promise<void>;
}
