import {
    Briefcase,
    GraduationCap,
    Code,
    PenTool,
    Gamepad2,
    HeartHandshake,
    Users,
    Heart,
    Image,
    LucideIcon,
} from "lucide-react";

// Category Type
export interface Category {
    id: string;
    label: string;
    icon: LucideIcon;
    description: string;
}

// All available categories
export const CATEGORIES: Category[] = [
    {
        id: "work",
        label: "Work",
        icon: Briefcase,
        description: "Business tasks, emails, presentations",
    },
    {
        id: "school",
        label: "School/College",
        icon: GraduationCap,
        description: "Homework, research, study guides",
    },
    {
        id: "coding",
        label: "Coding",
        icon: Code,
        description: "Development, debugging, architecture",
    },
    {
        id: "creative",
        label: "Creative Writing",
        icon: PenTool,
        description: "Stories, poems, scripts, novels",
    },
    {
        id: "fun",
        label: "Fun/Casual",
        icon: Gamepad2,
        description: "Games, jokes, entertainment",
    },
    {
        id: "therapy",
        label: "Therapy/Vent",
        icon: HeartHandshake,
        description: "Emotional support, reflection, venting",
    },
    {
        id: "consulting",
        label: "Consulting",
        icon: Users,
        description: "Strategy, advice, business consulting",
    },
    {
        id: "medical",
        label: "Medical/Health",
        icon: Heart,
        description: "Health info, symptoms, wellness",
    },
    {
        id: "art",
        label: "Art/Image Gen",
        icon: Image,
        description: "Image prompts, visual concepts",
    },
];

// Persona suggestions per category
export const PERSONA_SUGGESTIONS: Record<string, string[]> = {
    work: [
        "Executive Assistant",
        "Business Consultant",
        "Project Manager",
        "Marketing Strategist",
    ],
    school: [
        "University Professor",
        "Study Buddy",
        "Strict Examiner",
        "ELI5 Explainer",
    ],
    coding: [
        "Senior Architect",
        "Debug Specialist",
        "Clean Code Mentor",
        "LeetCode Interviewer",
    ],
    creative: [
        "Creative Writing Coach",
        "Story Editor",
        "Worldbuilding Expert",
        "Genre Specialist",
    ],
    fun: [
        "Witty Comedian",
        "Game Master",
        "Pop Culture Expert",
        "Fun Quiz Host",
    ],
    therapy: [
        "Empathetic Listener",
        "CBT Specialist",
        "Life Coach",
        "Stoic Philosopher",
    ],
    consulting: [
        "Strategy Consultant",
        "Business Analyst",
        "Change Management Expert",
        "Innovation Advisor",
    ],
    medical: [
        "Medical Educator",
        "Health Coach",
        "Wellness Advisor",
        "Patient Advocate",
    ],
    art: [
        "Art Director",
        "Visual Concept Artist",
        "Photography Expert",
        "Design Critic",
    ],
};

// Model configuration
export interface Model {
    id: string;
    name: string;
    provider: string;
    type: "text" | "image";
}

export const ALL_MODELS: Model[] = [
    // OpenAI
    { id: "gpt-4o", name: "GPT-4o", provider: "OpenAI", type: "text" },
    { id: "gpt-4-turbo", name: "GPT-4 Turbo", provider: "OpenAI", type: "text" },
    { id: "dall-e-3", name: "DALL-E 3", provider: "OpenAI", type: "image" },

    // Anthropic
    { id: "claude-3.5-sonnet", name: "Claude 3.5 Sonnet", provider: "Anthropic", type: "text" },
    { id: "claude-3-opus", name: "Claude 3 Opus", provider: "Anthropic", type: "text" },

    // Google
    { id: "gemini-1.5-pro", name: "Gemini 1.5 Pro", provider: "Google", type: "text" },

    // Meta
    { id: "llama-3-70b", name: "Llama 3 (70B)", provider: "Meta", type: "text" },

    // Others
    { id: "mistral-large", name: "Mistral Large", provider: "Mistral", type: "text" },
    { id: "midjourney-v6", name: "Midjourney v6", provider: "Midjourney", type: "image" },
    { id: "sdxl", name: "Stable Diffusion XL", provider: "Stability AI", type: "image" },
];

// Output format options
export const FORMAT_OPTIONS = [
    "Bullet Points",
    "Table",
    "JSON",
    "Markdown",
    "Python Script",
    "JavaScript",
    "Java Code",
    "Essay",
    "Email",
    "Documentation",
] as const;

export type OutputFormat = typeof FORMAT_OPTIONS[number];

// Dynamic placeholders based on category
export const PLACEHOLDERS: Record<string, string> = {
    work: "Describe your business task, email draft, or presentation outline...",
    school: "What topic are you struggling with? Paste your assignment or question...",
    coding: "Paste your broken code here or describe the feature you want to build...",
    creative: "Share your story idea, character concept, or scene you want to develop...",
    fun: "What kind of fun content do you want? Games, jokes, trivia...",
    therapy: "Feel free to vent or share what's on your mind. This is a safe space...",
    consulting: "Describe the business challenge or strategic decision you're facing...",
    medical: "Describe the symptoms or the medical concept you need explained...",
    art: "Describe the visual concept, style, mood, and elements you want in the image...",
};

// Helper functions
export function getPersonaSuggestions(categoryId: string): string[] {
    return PERSONA_SUGGESTIONS[categoryId] || [];
}

export function getPlaceholder(categoryId: string): string {
    return PLACEHOLDERS[categoryId] || "Describe what you need help with...";
}

export function getCategoryById(categoryId: string): Category | undefined {
    return CATEGORIES.find((cat) => cat.id === categoryId);
}

export function getModelsByProvider(): Record<string, Model[]> {
    const grouped: Record<string, Model[]> = {};

    ALL_MODELS.forEach((model) => {
        if (!grouped[model.provider]) {
            grouped[model.provider] = [];
        }
        grouped[model.provider].push(model);
    });

    return grouped;
}
