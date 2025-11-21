'use client';

import { useState } from 'react';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

/**
 * Hook personalizado para manejar la lógica del chat
 * 
 * Características:
 * - Gestión de estado de mensajes
 * - Streaming en tiempo real
 * - Manejo robusto de errores
 * - Validación de inputs
 */
export function useChat(apiUrl: string = '/api/chat') {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
        setError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!input.trim()) {
            setError('Por favor escribe un mensaje');
            return;
        }

        const userMessage: Message = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);
        setError(null);

        try {
            const res = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: [...messages, userMessage] }),
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.error || `Error del servidor: ${res.status}`);
            }

            if (!res.body) {
                throw new Error('No hay cuerpo de respuesta');
            }

            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            let assistantMessage = '';

            // Agregar mensaje vacío del asistente para que se muestre en tiempo real
            setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

            while (true) {
                const { value, done } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);

                // Parsear líneas SSE (Server-Sent Events)
                const lines = chunk.split('\n').filter(line => line.trim());

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        try {
                            const jsonStr = line.substring(6); // Remover "data: "

                            if (jsonStr === '[DONE]') {
                                break;
                            }

                            const json = JSON.parse(jsonStr);
                            const content = json.choices?.[0]?.delta?.content || '';

                            if (content) {
                                assistantMessage += content;

                                // Actualizar el último mensaje del asistente
                                setMessages(prev => {
                                    const updatedMessages = [...prev];
                                    updatedMessages[updatedMessages.length - 1].content = assistantMessage;
                                    return updatedMessages;
                                });
                            }
                        } catch (e) {
                            // Ignorar líneas que no sean JSON válido
                            continue;
                        }
                    }
                }
            }

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al procesar el mensaje';
            setError(errorMessage);
            console.error('Chat error:', err);

            // Remover el mensaje del asistente vacío si hubo error
            setMessages(prev => prev.slice(0, -1));
        } finally {
            setIsLoading(false);
        }
    };

    return {
        messages,
        input,
        handleInputChange,
        handleSubmit,
        isLoading,
        error,
        setError
    };
}
