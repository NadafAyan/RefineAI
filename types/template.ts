import { Timestamp } from "firebase/firestore";

export interface PromptTemplate {
    id: string;
    userId: string;
    createdAt: Timestamp;
    name: string;              // e.g., "Strict Java Examiner"
    description?: string;      // Optional user note
    // Configuration payload
    category: string;
    persona: string;
    constraints: {
        model: string;
        format: string;
        tone: number;
    };
    // Note: NO objective field - users type fresh each time
}

export interface TemplatesHook {
    templates: PromptTemplate[];
    loading: boolean;
    error: string | null;
    saveTemplate: (template: Omit<PromptTemplate, 'id' | 'userId' | 'createdAt'>) => Promise<void>;
    deleteTemplate: (templateId: string) => Promise<void>;
    fetchTemplateById: (templateId: string) => Promise<PromptTemplate | null>;
}
