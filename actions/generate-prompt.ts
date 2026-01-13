"use server";

import { groq } from "@/lib/groq";

export async function generateRefinedPrompt(data: {
    objective: string;
    persona: string;
    category: string;
    constraints: {
        model: string;
        format: string;
        tone: number;
    };
}) {
    try {
        const { objective, persona, category, constraints } = data;

        // Determine Tone Description
        let toneDesc = "balanced and professional";
        if (constraints.tone < 33) toneDesc = "casual and friendly";
        if (constraints.tone > 66) toneDesc = "strict, academic, and technical";

        // 1. Construct the System Prompt (The "Meta-Prompt")
        const systemPrompt = `You are an expert Prompt Engineer specializing in the ${category} domain. 
Your goal is to refine raw user requests into high-quality, engineering-grade prompts for AI models.

**Context:**
- Target Model: ${constraints.model}
- Desired Output Format: ${constraints.format}
- Tone: ${toneDesc}

**Your Task:**
Take the user's objective and persona, and rewrite it into a structured, optimized prompt. 
Do NOT generate the output of the prompt. ONLY generate the optimized prompt itself.
Ensure the prompt includes sections for Role, Context, Constraints, and Output Format.`;

        const userPrompt = `**Objective:** ${objective}
**Persona:** ${persona}

Please refine this into a production-ready prompt.`;

        // 2. Call Groq (Llama 3.3)
        const completion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt },
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.6,
            max_tokens: 1024,
        });

        const refinedOutput = completion.choices[0]?.message?.content || "";

        if (!refinedOutput) {
            throw new Error("No output content received from Groq.");
        }

        return { success: true, refinedOutput };
    } catch (error: any) {
        console.error("Groq Generation Error:", error);
        return { success: false, error: error.message || "Failed to generate prompt." };
    }
}
