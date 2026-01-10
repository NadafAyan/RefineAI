"use client";

import { useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import {
    Category,
    Model,
    OutputFormat,
    getPersonaSuggestions,
    getPlaceholder,
    ALL_MODELS,
    CATEGORIES,
} from "@/lib/wizard-data";
import { toast } from "sonner";

interface WizardState {
    selectedCategory: Category | null;
    objective: string;
    persona: string;
    targetModel: Model | null;
    format: OutputFormat;
    tone: number; // 0-100
    refinedOutput: string;
    hasGenerated: boolean;
    configChanged: boolean;
    lastConfig: { targetModel: Model | null; format: OutputFormat; tone: number } | null;
}

interface UsePromptWizardReturn {
    currentStep: number;
    state: WizardState;
    isGenerating: boolean;
    nextStep: () => void;
    prevStep: () => void;
    selectCategory: (category: Category) => void;
    updateField: <K extends keyof WizardState>(field: K, value: WizardState[K]) => void;
    getPersonaSuggestions: () => string[];
    getPlaceholderText: () => string;
    generatePrompt: () => Promise<void>;
    loadFromParams: (params: URLSearchParams) => void;
    loadFromId: (id: string) => Promise<void>;
    loadFromTemplate: (templateData: any) => void;
    resetWizard: () => void;
    markConfigChanged: () => void;
    hasConfigChanged: boolean;
}

const initialState: WizardState = {
    selectedCategory: null,
    objective: "",
    persona: "",
    targetModel: ALL_MODELS[0], // Default to GPT-4o
    format: "Markdown",
    tone: 50,
    refinedOutput: "",
    hasGenerated: false,
    configChanged: false,
    lastConfig: null,
};

export function usePromptWizard(): UsePromptWizardReturn {
    const [currentStep, setCurrentStep] = useState(1);
    const [state, setState] = useState<WizardState>(initialState);
    const [isGenerating, setIsGenerating] = useState(false);

    const selectCategory = (category: Category) => {
        setState((prev) => ({ ...prev, selectedCategory: category }));
        // Auto-advance to step 2
        setCurrentStep(2);
    };

    const nextStep = () => {
        if (currentStep < 4) {
            setCurrentStep((prev) => prev + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep((prev) => prev - 1);
        }
    };

    const updateField = <K extends keyof WizardState>(
        field: K,
        value: WizardState[K]
    ) => {
        setState((prev) => {
            const newState = { ...prev, [field]: value };

            // Check if Step 4 config changed after first generation
            if (prev.hasGenerated && (field === 'targetModel' || field === 'format' || field === 'tone')) {
                newState.configChanged = true;
            }

            return newState;
        });
    };

    const getCurrentPersonaSuggestions = (): string[] => {
        if (!state.selectedCategory) return [];
        return getPersonaSuggestions(state.selectedCategory.id);
    };

    const getPlaceholderTextForCategory = (): string => {
        if (!state.selectedCategory) return "Describe what you need help with...";
        return getPlaceholder(state.selectedCategory.id);
    };

    const generatePrompt = async () => {
        setIsGenerating(true);

        try {
            const response = await fetch('/api/generate-prompt', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    category: state.selectedCategory?.label,
                    objective: state.objective,
                    persona: state.persona,
                    targetModel: state.targetModel?.name,
                    format: state.format,
                    tone: state.tone,
                }),
            });

            if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`);
            }

            const data = await response.json();

            if (data.success && data.refinedPrompt) {
                setState((prev) => ({
                    ...prev,
                    refinedOutput: data.refinedPrompt,
                    hasGenerated: true,
                    configChanged: false,
                    lastConfig: {
                        targetModel: state.targetModel,
                        format: state.format,
                        tone: state.tone,
                    },
                }));

                if (data.source === 'fallback') {
                    toast.success("Prompt generated successfully (using template)");
                } else {
                    toast.success("Prompt generated successfully!");
                }
            } else {
                throw new Error(data.error || 'Failed to generate prompt');
            }
        } catch (error: any) {
            console.error("Error generating prompt:", error);
            toast.error("Failed to generate prompt. Please try again.");
        } finally {
            setIsGenerating(false);
        }
    };

    const loadFromParams = (params: URLSearchParams) => {
        const categoryId = params.get('category');
        const objective = params.get('objective');
        const persona = params.get('persona');
        const modelName = params.get('model');
        const format = params.get('format');
        const tone = params.get('tone');

        if (categoryId && objective) {
            // Import CATEGORIES to find the matching category
            const { CATEGORIES } = require('@/lib/wizard-data');
            const category = CATEGORIES.find((c: Category) => c.id === categoryId);

            if (category) {
                setState((prev) => ({
                    ...prev,
                    selectedCategory: category,
                    objective: objective || '',
                    persona: persona || '',
                    targetModel: ALL_MODELS.find(m => m.name === modelName) || ALL_MODELS[0],
                    format: (format as OutputFormat) || 'Markdown',
                    tone: tone ? parseInt(tone) : 50,
                }));
                // Start at step 2 since category is already selected
                setCurrentStep(2);
            }
        }
    };

    const loadFromId = async (id: string) => {
        if (!id) return;

        const { user } = require('@/context/AuthContext').useAuth();
        if (!user) {
            toast.error("Please sign in to load prompts");
            return;
        }

        setIsGenerating(true);
        try {
            const docRef = doc(db, "users", user.uid, "prompts", id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                const category = CATEGORIES.find(c => c.id === data.category);
                const model = ALL_MODELS.find(m => m.name === data.targetModel);

                setState((prev) => ({
                    ...prev,
                    selectedCategory: category || null,
                    objective: data.objective || '',
                    persona: data.persona || '',
                    targetModel: model || ALL_MODELS[0],
                    format: (data.format as OutputFormat) || 'Markdown',
                    tone: data.tone || 50,
                    refinedOutput: '', // Clear output so user generates a NEW one
                }));

                // Auto-navigate to Step 2 (Brain Dump) for editing
                setCurrentStep(2);
                toast.success("Prompt loaded! Edit and regenerate.");
            } else {
                toast.error("Prompt not found");
            }
        } catch (error) {
            console.error("Error loading prompt:", error);
            toast.error("Failed to load prompt");
        } finally {
            setIsGenerating(false);
        }
    };

    const loadFromTemplate = (templateData: any) => {
        if (!templateData) return;

        const category = CATEGORIES.find(c => c.id === templateData.category);
        if (!category) return;

        const model = ALL_MODELS.find(m => m.name === templateData.constraints.model);

        setState((prev) => ({
            ...prev,
            selectedCategory: category,
            persona: templateData.persona || '',
            targetModel: model || ALL_MODELS[0],
            format: (templateData.constraints.format as OutputFormat) || 'Markdown',
            tone: templateData.constraints.tone || 50,
            objective: '', // IMPORTANT: Leave empty for fresh input
            refinedOutput: '',
        }));

        // Auto-navigate to Step 2 (Brain Dump) so user can type new objective
        setCurrentStep(2);
    };

    const resetWizard = () => {
        setCurrentStep(1);
        setState(initialState);
    };

    return {
        currentStep,
        state,
        isGenerating,
        nextStep,
        prevStep,
        selectCategory,
        updateField,
        getPersonaSuggestions: getCurrentPersonaSuggestions,
        getPlaceholderText: getPlaceholderTextForCategory,
        generatePrompt,
        loadFromParams,
        loadFromId,
        loadFromTemplate,
        resetWizard,
        markConfigChanged: () => setState((prev) => ({ ...prev, configChanged: true })),
        hasConfigChanged: state.configChanged,
    };
}
