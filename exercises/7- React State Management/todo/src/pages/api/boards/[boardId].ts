import type { APIRoute } from "astro";
import { deleteBoard, editBoard, getBoard } from "../../../services/todos";

const parseFormData = async (request: Request) => {
    const formData = await request.formData();
    const action = formData.get("action")?.toString();
    const text = formData.get("text")?.toString();
    // const id = formData.get("id")?.toString();
    return { action, text };	
};

const parseJson = async (
  request: Request
  ): Promise<{ action: string | undefined; text: string | undefined; }> => {
    return await request.json();
  };

export const GET: APIRoute = async ({ request, redirect, params }) => {
    const contentType = request.headers.get("content-type");
    
    const id  = params.boardId ? parseInt(params.boardId, 10) : undefined;
    if (!id) {
        return new Response("Board ID is required", { status: 400 });
    }

    const board = getBoard(id);
    if (!board) {
        return new Response("Board not found", { status: 404 });
    }

    try {
        if (contentType === "application/json") {
            return new Response(JSON.stringify(board), {
                status: 200,
                headers: { "Content-Type": "application/json" }
            });
        } else {
            return redirect(`/`); // Redirige a la página de backend
        }
    } catch (error) {
        console.error("Error parsing request:", error);
        return new Response("Error parsing request", { status: 500 });
    }
}

export const DELETE: APIRoute = async ({ request, params, redirect }) => {
    const contentType = request.headers.get("content-type");
    const { id } = params;
    if (!id) {
        return new Response("Id is required", { status: 404 });
    }

    try {
        const { action } =
            contentType === "application/x-www-form-urlencoded"
                ? (await parseFormData(request))
                : (await parseJson(request));

        if (!action) {
            return new Response("Action is required", { status: 400 });
        }

        if (action === "deleteBoard") {
            deleteBoard(Number(id));
        } else {
            return new Response("Invalid action", { status: 400 });
        }

        if (contentType === "application/x-www-form-urlencoded") {
            return redirect(`/`); // Redirige a la página de backend
        }
        if (contentType === "application/json") {
            return new Response(JSON.stringify({ message: "Board deleted successfully" }), {
                status: 200,
                headers: { "Content-Type": "application/json" }
            }); // Devuelve un mensaje de éxito en formato JSON
        }
        // Always return a Response, even if contentType is not recognized
        return new Response("Unsupported content type", { status: 415 });
    } catch (error) {
        console.error("Error processing request:", error);
        return new Response("Error processing request", { status: 500 });
    }
};

export const PATCH: APIRoute = async ({ request, params, redirect }) => {
    const contentType = request.headers.get("content-type");
    const { id } = params;
    if (!id) {
        return new Response("Id is required", { status: 404 });
    }

    try {
        const { action, text} = 
            contentType === "application/x-www-form-urlencoded"
                ? (await parseFormData(request))
                : (await parseJson(await request.json()));

        if (!action) {
            return new Response("Action is required", { status: 400 });
        }
        if (!text) {
            return new Response("Text is required", { status: 400 });
        }

        if (action === "editBoard") {
            editBoard(Number(id), text); // Asume que tienes una función editBoard para editar el nombre del tablero
        } else {
            return new Response("Invalid action", { status: 400 });
        }

        if (contentType === "application/x-www-form-urlencoded") {
            return redirect(`/`); // Redirige a la página de backend
        }
        if (contentType === "application/json") {
            return new Response(JSON.stringify({ message: "Board updated successfully" }), {
                status: 200,
                headers: { "Content-Type": "application/json" }
            }); // Devuelve un mensaje de éxito en formato JSON
        }
        // Always return a Response, even if contentType is not recognized
        return new Response("Unsupported content type", { status: 415 });
    } catch (error) {
        console.error("Error processing request:", error);
        return new Response("Error processing request", { status: 500 });
    }
}