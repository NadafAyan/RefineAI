import { NextRequest, NextResponse } from 'next/server';
import { generateAdvancedPrompt, PromptContext } from '@/lib/prompt-engine';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Construct context from request body
        const context: PromptContext = {
            category: body.category || 'General',
            objective: body.objective || '',
            persona: body.persona || 'AI Assistant',
            targetModel: body.targetModel || 'Generic LLM',
            format: body.format || 'Markdown',
            tone: Number(body.tone) || 50
        };

        // Generate prompt locally using advanced engine
        const refinedPrompt = generateAdvancedPrompt(context);

        // Simulate a short processing delay for better UX
        await new Promise(resolve => setTimeout(resolve, 800));

        return NextResponse.json({
            refinedPrompt,
            success: true,
            source: 'smart-template'
        });

    } catch (error: any) {
        console.error('Prompt Generation Error:', error);

        return NextResponse.json(
            {
                error: 'Failed to generate prompt',
                details: error.message,
                success: false
            },
            { status: 500 }
        );
    }
}
