import { NextRequest } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { prompt, objective } = body;

        if (!process.env.GEMINI_API_KEY) {
            return new Response(
                'Test run is not available (API key not configured)',
                { status: 500 }
            );
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const testPrompt = `${prompt}\n\n---\n\nNow, following the above prompt instructions, please respond to this:\n${objective}`;

        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

        // Generate content with streaming
        const result = await model.generateContentStream(testPrompt);

        // Create a readable stream
        const encoder = new TextEncoder();
        const stream = new ReadableStream({
            async start(controller) {
                try {
                    for await (const chunk of result.stream) {
                        const text = chunk.text();
                        controller.enqueue(encoder.encode(text));
                    }
                    controller.close();
                } catch (error) {
                    console.error('Streaming error:', error);
                    const errorMsg = '\n\n[Error: Failed to generate response. Please check your API configuration.]';
                    controller.enqueue(encoder.encode(errorMsg));
                    controller.close();
                }
            },
        });

        return new Response(stream, {
            headers: {
                'Content-Type': 'text/plain; charset=utf-8',
                'Transfer-Encoding': 'chunked',
            },
        });

    } catch (error: any) {
        console.error('Test Run Error:', error);
        return new Response(
            `Error: ${error.message || 'Test run failed'}`,
            { status: 500 }
        );
    }
}
