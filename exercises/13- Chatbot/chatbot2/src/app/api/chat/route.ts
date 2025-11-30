export const maxDuration = 30;

/**
 * POST /api/chat
 * 
 * Endpoint seguro para procesar mensajes del chatbot usando OpenRouter.
 * 
 * ⚠️ SEGURIDAD:
 * - La API key de OpenRouter se maneja solo en el servidor
 * - Nunca se expone al cliente
 * - Todos los inputs se validan y sanitizan
 */
export async function POST(req: Request) {
    try {
        // 1. Validar que la API Key esté configurada
        const apiKey = process.env.OPENROUTER_API_KEY;
        if (!apiKey) {
            return new Response(
                JSON.stringify({ error: "OpenRouter API key is not configured." }),
                { status: 500, headers: { "Content-Type": "application/json" } }
            );
        }

        // 2. Parsear el body del request
        const { messages } = await req.json();

        // 3. Validar existencia de mensajes
        if (!messages || !Array.isArray(messages)) {
            return new Response(
                JSON.stringify({ error: "Invalid request body. 'messages' is required." }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        // 4. Sanitizar y validar mensajes
        const sanitizedMessages = messages
            .filter((msg: any) => msg && typeof msg === 'object' && msg.content && msg.role)
            .map((msg: any) => ({
                role: (msg.role === 'user' || msg.role === 'assistant') ? msg.role : 'user' as const,
                content: String(msg.content || '').trim().slice(0, 10000)
            }))
            .filter((msg: any) => msg.content.length > 0);

        if (sanitizedMessages.length === 0) {
            return new Response(
                JSON.stringify({ error: "No valid messages provided." }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        // 5. Hacer request a OpenRouter con streaming
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': 'http://localhost:3001',
                'X-Title': 'Chatbot Inteligente',
            },
            body: JSON.stringify({
                model: process.env.OPENROUTER_MODEL || 'gpt-3.5-turbo',
                messages: sanitizedMessages,
                stream: true,
                temperature: 0.7,
                max_tokens: 1000,
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            console.error('OpenRouter error:', error);
            return new Response(
                JSON.stringify({
                    error: error.error?.message || 'Error calling OpenRouter API'
                }),
                { status: response.status, headers: { "Content-Type": "application/json" } }
            );
        }

        // 6. Retornar el stream directamente
        return new Response(response.body, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
            },
        });

    } catch (error) {
        console.error("Error in /api/chat route:", error);

        return new Response(
            JSON.stringify({
                error: "An error occurred while processing your request. Please try again."
            }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}