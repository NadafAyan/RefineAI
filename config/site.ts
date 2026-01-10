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

export type SiteConfig = typeof siteConfig;

export const siteConfig = {
    name: "RefineAI",
    description: "The enterprise-grade prompt engineering platform that turns vague ideas into precise AI instructions.",

    hero: {
        title: "Stop Talking to AI Like a Noob.",
        subtitle: "RefineAI transforms your raw, unstructured thoughts into engineering-grade prompts optimized for GPT-4, Claude, and Gemini.",
        cta: "Start Refining Now",
        ctaLink: "/login",
    },

    problemSolution: {
        problem: {
            title: " The 'Garbage In, Garbage Out' Trap",
            description: "90% of AI failures aren't model failures—they're prompt failures. Vague inputs lead to generic, hallucinated, or unhelpful outputs.",
            points: [
                "Ambiguous requests yield random results",
                "Wasted tokens on clarifications",
                "Endless 'regenerate' loops",
                "Inconsistent outputs across teams"
            ]
        },
        solution: {
            title: "Engineered Precision",
            description: "RefineAI forces structure onto your ideas. We inject the context, constraints, and formatting that LLMs crave but humans forget.",
            points: [
                "Structured Context Injection",
                "Model-Specific Validations",
                "Persona & Role Calibration",
                "Output Format Enforcement"
            ]
        }
    },

    process: [
        {
            title: "1. Define Intent",
            description: "Start with a raw idea. We allow you to dump your thoughts quickly without worrying about structure."
        },
        {
            title: "2. Configure Context",
            description: "Select your target model, define a specific persona, and choose the exact output format you need."
        },
        {
            title: "3. Generate & Refine",
            description: "Our engine constructs a multi-layered prompt. You get production-ready instructions instantly."
        }
    ],

    features: [
        {
            title: "Model Targeting",
            description: "Prompts aren't one-size-fits-all. We optimize syntax for GPT-4's reasoning vs Claude's creativity.",
            icon: "Target"
        },
        {
            title: "History & Versions",
            description: "Never lose a 'perfect' prompt again. Auto-save every iteration and fork successful templates.",
            icon: "History"
        },
        {
            title: "Smart Templates",
            description: "Don't start from scratch. Use battle-tested patterns for coding, marketing, and analysis.",
            icon: "Sparkles"
        },
        {
            title: "Tone Calibration",
            description: "Dial in the exact voice—from 'Academic Strict' to 'Casual Friendly'—with a single slider.",
            icon: "Sliders"
        },
        {
            title: "Test Run",
            description: "Verify your prompt instantly with a real-time simulation before copying it to your workflow.",
            icon: "Play"
        }
    ],

    faq: [
        {
            question: "Why do I need this platform?",
            answer: "Most people drastically underestimate the complexity of a 'perfect' prompt. RefineAI bridges the gap between human intent and machine understanding by systematically enforcing best practices that are hard to remember manually."
        },
        {
            question: "Does it work with any AI model?",
            answer: "Yes. While we optimize specifically for major LLMs like GPT-4, Claude 3.5, and Gemini, the structural principles we enforce improve performance on any large language model, including local ones like Llama 3."
        },
        {
            question: "Is my data private?",
            answer: "Absolutely. Your prompts are stored securely in your private history. We do not use your data to train our own models."
        },
        {
            question: "What is 'Model Targeting'?",
            answer: "Different models respond better to different instruction styles. For example, Claude prefers XML tags for structure, while GPT models handle markdown sections well. RefineAI adjusts the output syntax based on your selected target."
        }
    ]
} as const;
