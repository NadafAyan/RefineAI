import { OpenAI } from "openai";

// Initialize OpenAI client pointing to Groq's API
export const groq = new OpenAI({
    baseURL: "https://api.groq.com/openai/v1",
    apiKey: process.env.GROQ_API_KEY || "", // Ensure this is set in .env.local
    dangerouslyAllowBrowser: false, // Server-side only
});
