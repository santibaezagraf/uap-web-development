import { createOpenAI } from "@ai-sdk/openai";
import { streamText, UIMessage, convertToModelMessages } from 'ai';
import { openai } from '@ai-sdk/openai';
import OpenAI from "openai";
// import { openai } from "@ai-sdk/openai";

// const openai = new OpenAI({
//     apiKey: process.env.OPENROUTER_API_KEY || "",
//     baseURL: process.env.OPENROUTER_API_BASE_URL || "https://openrouter.ai/api/v1",
//     defaultHeaders: {
//         "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
//         "HTTP-Referer": process.env.OPENROUTER_REFERRER || "http://localhost:3001",
//         "X-Title": "Mi Chatbot",
//     },
// });

export const maxDuration = 30;


export async function POST(req: Request) {
    try {
        // 1. Validar que la API Key esté configurada
        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) {
            return new Response(
                JSON.stringify({ error: "OpenAI API key is not configured." }),
                { status: 500, headers: { "Content-Type": "application/json" } }
            );
        }

        // const openai = new OpenAI({
        //     apiKey: apiKey,
        //     baseURL: process.env.OPENROUTER_BASE_URL || "https://openrouter.ai/api/v1",
        // })

        // 2. Parsear el body del request
        const { messages }: { messages: UIMessage[] } = await req.json();

        // 3. Validar existencia de mensajes
        if (!messages || !Array.isArray(messages)) {
            return new Response(
                JSON.stringify({ error: "Invalid request body. 'messages' is required." }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        // 4. Sanitizar y validar mensajes
        // const sanitizedMessages = messages.map((msg: any) => ({
        //     role: msg.role === 'user' || msg.role === 'assistant' ? msg.role : 'user',
        //     content: String(msg.content).slice(0, 10000) // Limitar a 10000 caracteres
        // }))

        // const completions = await openai.chat.completions.create({
        //     model: process.env.OPENROUTER_MODEL || "anthropic/claude-3-haiku",
        //     messages: sanitizedMessages,
        //     temperature: 0.7,
        //     stream: true,
        // });


        // 6. Usar streaming para responder en tiempo real
        const result = await streamText({
            model: openai("gpt-3.5-turbo"),
            messages: convertToModelMessages(messages),
        });

        // 7. Retornar la respuesta en streaming
        return result.toUIMessageStreamResponse();


    } catch (error) {
        console.error("Error in /api/chat route:", error);
        return new Response(
            JSON.stringify({
                error: "An error occurred while processing your request."
            }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}