import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        // const { prompt } = body; // Unused

        // Create a simulated response stream
        const encoder = new TextEncoder();
        const stream = new ReadableStream({
            async start(controller) {
                const simulatedResponse = `[SYSTEM NOTE: API QUOTA EXCEEDED - RUNNING SIMULATION]

Based on your prompt, here is a simulated response structure using your formatting rules:

# Response

This is a placeholder response because the external AI API is currently unavailable due to quota limits. 

However, your prompt structure appears valid!
- Context is set
- Objective is clear
- Format is correct

You can copy the generated prompt and run it in ChatGPT or Claude manually to get the real result.`;

                const chunks = simulatedResponse.split(' ');

                for (const chunk of chunks) {
                    // Simulate typing speed
                    await new Promise(resolve => setTimeout(resolve, 50));
                    controller.enqueue(encoder.encode(chunk + ' '));
                }
                controller.close();
            },
        });

        return new Response(stream, {
            headers: {
                'Content-Type': 'text/plain; charset=utf-8',
                'Transfer-Encoding': 'chunked',
            },
        });

    } catch (error: unknown) {
        console.error('Test Run Error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Test run failed';
        return new Response(
            `Error: ${errorMessage}`,
            { status: 500 }
        );
    }
}
