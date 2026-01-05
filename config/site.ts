type TabWithContent = {
    id: string;
    label: string;
    title: string;
    content: string[];
    features?: never;
};

type TabWithFeatures = {
    id: string;
    label: string;
    title: string;
    content?: never;
    features: {
        name: string;
        description: string;
    }[];
};

type Tab = TabWithContent | TabWithFeatures;

export const siteConfig = {
    name: "RefineAI",
    description: "A SaaS platform that helps you refine your AI prompts using a step-by-step wizard.",

    hero: {
        title: "Stop Talking to AI Like a Noob.",
        subtitle: "RefineAI turns your raw thoughts into engineering-grade prompts.",
        cta: "Get Started",
        ctaLink: "/login",
    },

    howItWorks: {
        title: "How It Works",
        tabs: [
            {
                id: "problem",
                label: "The Problem",
                title: "Why Vague Prompts Fail",
                content: [
                    "Most users treat AI like a search engine, typing short, ambiguous requests.",
                    "Without context, AI models guess your intent and often miss the mark.",
                    "You waste time refining outputs manually instead of getting it right the first time.",
                    "Poor prompts lead to generic, unhelpful responses that don't solve your problem.",
                ],
            },
            {
                id: "solution",
                label: "The Solution",
                title: "How RefineAI Adds Structure",
                content: [
                    "Our wizard guides you through three critical steps: Objective, Persona, and Constraints.",
                    "We automatically inject best practices like role assignment and output formatting.",
                    "RefineAI builds a multi-layered prompt that gives AI models the context they need.",
                    "Get professional-grade results without becoming a prompt engineering expert.",
                ],
            },
            {
                id: "features",
                label: "Features",
                title: "What Makes RefineAI Different",
                features: [
                    {
                        name: "Model Targeting",
                        description: "Optimize prompts for specific AI models (GPT-4, Claude, Gemini, etc.)",
                    },
                    {
                        name: "Tone Calibration",
                        description: "Fine-tune the voice and style to match your brand or use case",
                    },
                    {
                        name: "History",
                        description: "Access your refined prompts anytime and iterate on past successes",
                    },
                ],
            },
        ] as Tab[],
    },
} as const;
