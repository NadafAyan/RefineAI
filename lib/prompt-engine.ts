export type PromptContext = {
    category: string;
    objective: string;
    persona: string;
    targetModel: string;
    format: string;
    tone: number;
};

const TONE_MODIFIERS = {
    casual: {
        voice: "friendly, conversational, and accessible",
        instruction: "Use simple language and analogies where appropriate. Avoid jargon.",
    },
    professional: {
        voice: "balanced, objective, and clear",
        instruction: "Maintain a professional standard. Be direct but polite.",
    },
    academic: {
        voice: "rigorous, analytical, and authoritative",
        instruction: "Use precise terminology. Cite principles where applicable. Avoid ambiguity.",
    }
};

const CATEGORY_TEMPLATES: Record<string, string> = {
    coding: "Focus on clean, efficient, and well-documented code. Follow best practices for error handling and edge cases.",
    writing: "Focus on engagement, clarity, and flow. Ensure the narrative structure is compelling.",
    analysis: "Focus on data-driven insights, logical reasoning, and objective verification.",
    marketing: "Focus on persuasion, value proposition, and call-to-action. Address user pain points directly.",
    general: "Focus on clarity, accuracy, and completeness."
};

export function generateAdvancedPrompt(ctx: PromptContext): string {
    // 1. Determine Tone Logic
    let toneKey: keyof typeof TONE_MODIFIERS = 'professional';
    if (ctx.tone < 33) toneKey = 'casual';
    if (ctx.tone > 66) toneKey = 'academic';

    const toneSettings = TONE_MODIFIERS[toneKey];
    const categoryInstruction = CATEGORY_TEMPLATES[ctx.category.toLowerCase()] || CATEGORY_TEMPLATES['general'];

    // 2. Construct the "Meta-Prompt" (The Prompt for the AI)
    // We use a "Chain of Thought" style structure even for the template to make it look professional

    return `# ${ctx.category} Task: ${ctx.objective.substring(0, 50)}...
  
## 1. System Role & Persona
**You are acting as:** ${ctx.persona}
**Your traits:** ${toneSettings.voice}.
**Domain Expertise:** ${ctx.category} Specialist.

## 2. Core Objective
${ctx.objective}

## 3. Context & Constraints
- **Target Audience:** Users of ${ctx.targetModel}
- **Tone Calibration:** ${toneKey.toUpperCase()} (${toneSettings.instruction})
- **Domain Rules:** ${categoryInstruction}

## 4. Output Specification
**Format:** ${ctx.format}
**Structure:**
1. Begin with a clear summary.
2. Provide the main content structured as ${ctx.format}.
3. Conclude with actionable next steps or key takeaways.

## 5. Quality Checklist
[ ] Does this meet the user's core objective?
[ ] Is the tone consistently ${toneKey}?
[ ] Is the formatting strictly ${ctx.format}?

---
*Refined by RefineAI Template Engine*`;
}
