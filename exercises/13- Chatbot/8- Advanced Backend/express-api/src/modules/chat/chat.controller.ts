import { Request, Response } from 'express';
import { ChatService } from './chat.service';
import { toString } from 'express-validator/lib/utils';

export class ChatController {
    private chatService = new ChatService();

    async chat(req: Request, res: Response) {
        try {
            const { messages, conversationId, boardId } = req.body;
            const user_id = req.user?.id;

            const userId = toString(user_id);

            if (!userId) {
                return res.status(401).json({ error: 'Unauthorized' });
            }

            // Validar mensajes
            if (!Array.isArray(messages) || messages.length === 0) {
                return res.status(400).json({ error: 'Invalid messages' });
            }

            // Obtener respuesta del LLM con tools
            const response = await this.chatService.processMessage(
                userId,
                messages,
                boardId,
                conversationId
            );

            res.json(response);
        } catch (error) {
            console.error('Chat error:', error);
            res.status(500).json({ error: 'Error processing message' });
        }
    }

    async executeTool(req: Request, res: Response) {
        try {
            const { toolName } = req.params;
            const { params } = req.body;
            const user_id = req.user?.id;

            const userId = toString(user_id);

            if (!userId) {
                return res.status(401).json({ error: 'Unauthorized' });
            }

            const result = await this.chatService.executeTool(
                userId,
                toolName,
                params
            );

            res.json(result);
        } catch (error) {
            console.error('Tool execution error:', error);
            res.status(500).json({ error: 'Error executing tool' });
        }
    }
}