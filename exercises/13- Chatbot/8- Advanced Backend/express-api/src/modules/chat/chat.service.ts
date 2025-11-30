import fetch from 'node-fetch';
import { TodoRepository } from '../todo/todo.repository';
import { BoardRepository } from '../board/board.repository';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

interface Tool {
    type: 'function';
    function: {
        name: string;
        description: string;
        parameters: {
            type: string;
            properties: Record<string, any>;
            required: string[];
        };
    };
}

export class ChatService {
    private todoRepository = new TodoRepository();
    private boardRepository = new BoardRepository();
    private openrouterApiKey = process.env.OPENROUTER_API_KEY;
    private openrouterBaseUrl = 'https://openrouter.ai/api/v1';

    // Definir las herramientas disponibles
    private tools: Tool[] = [
        {
            type: 'function',
            function: {
                name: 'createTask',
                description: 'Crear una nueva tarea en un tablero',
                parameters: {
                    type: 'object',
                    properties: {
                        text: {
                            type: 'string',
                            description: 'Texto/título de la tarea'
                        },
                        boardId: {
                            type: 'number',
                            description: 'ID del tablero donde crear la tarea'
                        }
                    },
                    required: ['text', 'boardId']
                }
            }
        },
        {
            type: 'function',
            function: {
                name: 'updateTask',
                description: 'Actualizar el texto de una tarea existente',
                parameters: {
                    type: 'object',
                    properties: {
                        todoId: {
                            type: 'number',
                            description: 'ID de la tarea a actualizar'
                        },
                        boardId: {
                            type: 'number',
                            description: 'ID del tablero que contiene la tarea'
                        },
                        text: {
                            type: 'string',
                            description: 'Nuevo texto de la tarea'
                        }
                    },
                    required: ['todoId', 'boardId', 'text']
                }
            }
        },
        {
            type: 'function',
            function: {
                name: 'toggleTask',
                description: 'Marcar una tarea como completada o incompleta',
                parameters: {
                    type: 'object',
                    properties: {
                        todoId: {
                            type: 'number',
                            description: 'ID de la tarea a marcar'
                        },
                        boardId: {
                            type: 'number',
                            description: 'ID del tablero que contiene la tarea'
                        }
                    },
                    required: ['todoId', 'boardId']
                }
            }
        },
        {
            type: 'function',
            function: {
                name: 'deleteTask',
                description: 'Eliminar una tarea',
                parameters: {
                    type: 'object',
                    properties: {
                        todoId: {
                            type: 'number',
                            description: 'ID de la tarea a eliminar'
                        },
                        boardId: {
                            type: 'number',
                            description: 'ID del tablero que contiene la tarea'
                        }
                    },
                    required: ['todoId', 'boardId']
                }
            }
        },
        {
            type: 'function',
            function: {
                name: 'searchTasks',
                description: 'Buscar y filtrar tareas en un tablero',
                parameters: {
                    type: 'object',
                    properties: {
                        boardId: {
                            type: 'number',
                            description: 'ID del tablero'
                        },
                        search: {
                            type: 'string',
                            description: 'Texto de búsqueda'
                        },
                        filter: {
                            type: 'string',
                            enum: ['completed', 'uncompleted', 'all'],
                            description: 'Filtrar por estado'
                        }
                    },
                    required: ['boardId']
                }
            }
        },
        {
            type: 'function',
            function: {
                name: 'getTaskStats',
                description: 'Obtener estadísticas de tareas en un tablero',
                parameters: {
                    type: 'object',
                    properties: {
                        boardId: {
                            type: 'number',
                            description: 'ID del tablero'
                        }
                    },
                    required: ['boardId']
                }
            }
        },
        {
            type: 'function',
            function: {
                name: 'clearCompletedTasks',
                description: 'Eliminar todas las tareas completadas en un tablero',
                parameters: {
                    type: 'object',
                    properties: {
                        boardId: {
                            type: 'number',
                            description: 'ID del tablero'
                        }
                    },
                    required: ['boardId']
                }
            }
        }
    ];

    async processMessage(userId: string, messages: Message[], boardId?: number, conversationId?: string) {
        try {
            // Validar API key
            if (!this.openrouterApiKey) {
                throw new Error('OpenRouter API key not configured');
            }

            // Agregar contexto del boardId al sistema
            const systemMessage = boardId 
                ? `Eres un asistente inteligente para gestionar tareas. El usuario está trabajando en el tablero ${boardId}. Cuando ejecutes herramientas, siempre usa boardId: ${boardId}.`
                : 'Eres un asistente inteligente para gestionar tareas.';

            const messagesWithSystem = [
                { role: 'system' as const, content: systemMessage },
                ...messages
            ];

            // Llamar a OpenRouter con tool calling
            const response = await fetch(`${this.openrouterBaseUrl}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.openrouterApiKey}`,
                    'Content-Type': 'application/json',
                    'HTTP-Referer': process.env.OPENROUTER_REFERRER || 'http://localhost:5173',
                    'X-Title': 'AI Todo Manager'
                },
                body: JSON.stringify({
                    model: process.env.OPENROUTER_MODEL || 'gpt-3.5-turbo',
                    messages: messagesWithSystem,
                    tools: this.tools,
                    tool_choice: 'auto',
                    temperature: 0.7,
                    max_tokens: 1000
                })
            });

            if (!response.ok) {
                const errorData = await response.json() as any;
                throw new Error(`OpenRouter error: ${errorData.error?.message || 'Unknown error'}`);
            }

            const data = await response.json() as any;
            const assistantMessage = data.choices?.[0]?.message;

            if (!assistantMessage) {
                throw new Error('No response from OpenRouter');
            }

            // Si el LLM quiere ejecutar tools
            if (assistantMessage.tool_calls && assistantMessage.tool_calls.length > 0) {
                const toolResults = [];

                for (const toolCall of assistantMessage.tool_calls) {
                    try {
                        const result = await this.executeTool(
                            userId,
                            toolCall.function.name,
                            JSON.parse(toolCall.function.arguments)
                        );

                        toolResults.push({
                            toolCallId: toolCall.id,
                            toolName: toolCall.function.name,
                            result
                        });
                    } catch (toolError) {
                        toolResults.push({
                            toolCallId: toolCall.id,
                            toolName: toolCall.function.name,
                            result: {
                                success: false,
                                error: toolError instanceof Error ? toolError.message : 'Unknown error'
                            }
                        });
                    }
                }

                return {
                    conversationId,
                    message: assistantMessage.content || 'Ejecutando acciones...',
                    toolResults,
                    role: 'assistant'
                };
            }

            // Respuesta normal sin tools
            return {
                conversationId,
                message: assistantMessage.content || 'Sin respuesta',
                role: 'assistant'
            };

        } catch (error) {
            console.error('Error processing message:', error);
            throw error;
        }
    }

    async executeTool(userId: string, toolName: string, params: any) {
        switch (toolName) {
            case 'createTask':
                return await this.createTask(params);
            case 'updateTask':
                return await this.updateTask(params);
            case 'toggleTask':
                return await this.toggleTask(params);
            case 'deleteTask':
                return await this.deleteTask(params);
            case 'searchTasks':
                return await this.searchTasks(params);
            case 'getTaskStats':
                return await this.getTaskStats(params);
            case 'clearCompletedTasks':
                return await this.clearCompletedTasks(params);
            default:
                throw new Error(`Unknown tool: ${toolName}`);
        }
    }

    private async createTask(params: any) {
        try {
            const { text, boardId } = params;

            if (!text || !boardId) {
                return {
                    success: false,
                    error: 'text y boardId son requeridos'
                };
            }

            const todo = await this.todoRepository.createTodo(boardId, { text });

            return {
                success: true,
                task: todo,
                message: `✅ Tarea creada: "${text}"`
            };
        } catch (error) {
            console.error('Error creating task:', error);
            return {
                success: false,
                error: 'Error al crear la tarea',
                details: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }

    private async updateTask(params: any) {
        try {
            const { todoId, boardId, text } = params;

            if (!todoId || !boardId || !text) {
                return {
                    success: false,
                    error: 'todoId, boardId y text son requeridos'
                };
            }

            const existingTodo = await this.todoRepository.getTodoById(boardId, todoId);
            
            if (!existingTodo) {
                return {
                    success: false,
                    error: 'Tarea no encontrada'
                };
            }

            const updated = await this.todoRepository.updateTodo(boardId, todoId, { text });

            return {
                success: true,
                task: updated,
                message: `✏️ Tarea actualizada: "${text}"`
            };
        } catch (error) {
            console.error('Error updating task:', error);
            return {
                success: false,
                error: 'Error al actualizar la tarea',
                details: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }

    private async toggleTask(params: any) {
        try {
            const { todoId, boardId } = params;

            if (!todoId || !boardId) {
                return {
                    success: false,
                    error: 'todoId y boardId son requeridos'
                };
            }

            const existingTodo = await this.todoRepository.getTodoById(boardId, todoId);
            
            if (!existingTodo) {
                return {
                    success: false,
                    error: 'Tarea no encontrada'
                };
            }

            const updated = await this.todoRepository.toggleTodo(boardId, todoId);

            const status = updated?.completed ? '✅ Completada' : '⏳ Pendiente';

            return {
                success: true,
                task: updated,
                message: `${status}: "${updated?.text}"`
            };
        } catch (error) {
            console.error('Error toggling task:', error);
            return {
                success: false,
                error: 'Error al marcar la tarea',
                details: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }

    private async deleteTask(params: any) {
        try {
            const { todoId, boardId } = params;

            if (!todoId || !boardId) {
                return {
                    success: false,
                    error: 'todoId y boardId son requeridos'
                };
            }

            const existingTodo = await this.todoRepository.getTodoById(boardId, todoId);
            
            if (!existingTodo) {
                return {
                    success: false,
                    error: 'Tarea no encontrada'
                };
            }

            await this.todoRepository.deleteTodo(boardId, todoId);

            return {
                success: true,
                message: `🗑️ Tarea eliminada: "${existingTodo.text}"`
            };
        } catch (error) {
            console.error('Error deleting task:', error);
            return {
                success: false,
                error: 'Error al eliminar la tarea',
                details: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }

    private async searchTasks(params: any) {
        try {
            const { boardId, search, filter = 'all' } = params;

            if (!boardId) {
                return {
                    success: false,
                    error: 'boardId es requerido'
                };
            }

            const result = await this.todoRepository.getAllTodos(boardId, {
                search: search || '',
                filter: filter !== 'all' ? filter : undefined,
                page: 1,
                limit: 50
            });

            return {
                success: true,
                tasks: result.todos,
                count: result.total,
                message: `📋 Encontradas ${result.total} tareas`
            };
        } catch (error) {
            console.error('Error searching tasks:', error);
            return {
                success: false,
                error: 'Error al buscar tareas',
                details: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }

    private async getTaskStats(params: any) {
        try {
            const { boardId } = params;

            if (!boardId) {
                return {
                    success: false,
                    error: 'boardId es requerido'
                };
            }

            const result = await this.todoRepository.getAllTodos(boardId, {
                page: 1,
                limit: 1000
            });

            const todos = result.todos;
            const stats = {
                totalTasks: todos.length,
                completedTasks: todos.filter(t => t.completed).length,
                pendingTasks: todos.filter(t => !t.completed).length,
                completionRate: todos.length > 0 
                    ? Math.round((todos.filter(t => t.completed).length / todos.length) * 100)
                    : 0
            };

            return {
                success: true,
                stats,
                message: `📊 Estadísticas: ${stats.completedTasks}/${stats.totalTasks} tareas completadas (${stats.completionRate}%)`
            };
        } catch (error) {
            console.error('Error getting stats:', error);
            return {
                success: false,
                error: 'Error al calcular estadísticas',
                details: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }

    private async clearCompletedTasks(params: any) {
        try {
            const { boardId } = params;

            if (!boardId) {
                return {
                    success: false,
                    error: 'boardId es requerido'
                };
            }

            const count = await this.todoRepository.clearCompletedTodos(boardId);

            return {
                success: true,
                deletedCount: count,
                message: `🧹 Se eliminaron ${count} tareas completadas`
            };
        } catch (error) {
            console.error('Error clearing completed tasks:', error);
            return {
                success: false,
                error: 'Error al limpiar tareas completadas',
                details: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }
}