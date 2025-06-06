import type { APIRoute } from "astro";
import { addBoard, getBoards } from "../../services/todos";

const parseFormData = async (request: Request) => {
    const formData = await request.formData();
    const action = formData.get("action")?.toString();
    const text = formData.get("text")?.toString();
    return { action, text };	
};

const parseJson = async (
  request: Request
  ): Promise<{ action: string | undefined; text: string | undefined; }> => {
    return await request.json();
  };

  export const GET: APIRoute = async ({ request, redirect }) => {
    const contentType = request.headers.get("content-type");

    try {

        if (contentType === "application/json") {
            return new Response(JSON.stringify(getBoards()), {
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

export const POST: APIRoute = async ({ request, redirect }) => {
    const contentType = request.headers.get("content-type");

    const { action, text} =
        contentType === "application/x-www-form-urlencoded"
            ? (await parseFormData(request))
            : (await parseJson(await request.json()));

    if (!action) {
        return new Response("Action is required", { status: 400 });
    }

    try {
        if (action === 'createBoard' && text) {
            addBoard(text)
        }

    } catch (error) {
        console.error("Error processing request:", error);
        return new Response("Error processing request", { status: 500 });
    }

    if (contentType === "application/x-www-form-urlencoded") {
        return redirect(`/`); // Redirige a la página de backend
    }
    else if (contentType === "application/json") {
        return new Response(JSON.stringify(getBoards()), { 
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    }
    else {
        return new Response("Invalid content type", { status: 400 }); // Manejo de errores
    }
}