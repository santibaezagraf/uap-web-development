import type { APIRoute } from "astro";
import { toggleTodo, deleteTodo, editTodo, getFilteredTodos } from "../../../../../services/todos"; 
import { filter } from "../todos"

type Action = "toggle" | "edit";

const parseFormData = async (request: Request) => {
  const formData = await request.formData();
  const action = formData.get("action")?.toString() as Action | undefined;
  const text = formData.get('text')?.toString()
  return { action, text };
};

const parseFromJson = async (data: { action?:Action, text?: string })  => {
    return { action: data.action, text: data.text };
};

// const parseFromJson = async (
//   request: Request
//   ): Promise<{ action: string | undefined; text: string | undefined; }> => {
//     return await request.json();
//   };

export const DELETE: APIRoute = async ({ request, params, redirect }) => {
    const contentType = request.headers.get("content-type");
    const { boardId, todoId } = params;

    if (!boardId || !todoId) {
        return new Response("Board ID and Todo ID are required", { status: 400 });
    }

    try {
        deleteTodo(Number(boardId), Number(todoId));
    } catch (error) {
        console.error("Error processing request:", error);
        return new Response("Error processing request", { status: 500 });
    }

    try {
        if (contentType === "application/x-www-form-urlencoded") {
            return redirect(`/?filter=${filter}`); // Redirige a la página de backend
        } else if (contentType === "application/json") {
            return new Response(JSON.stringify({
                success: true,
                message: "Todo deleted successfully",
            }), { 
                status: 200,
                headers: { "Content-Type": "application/json" } }); // Devuelve el array de tareas en formato JSON
        }
        return new Response("Invalid content type", { status: 400 }); // Manejo de errores
    } catch (error) {
        console.error("Error parsing request:", error);
        return new Response("Error parsing request", { status: 500 });
    }
}




export const PATCH: APIRoute = async ({ request, params, redirect }) => {
    const { boardId, todoId } = params;
    console.log("currentBoardId:", boardId)
    console.log("todoId:", todoId)
    if (!boardId || !todoId) {
        return new Response("Board ID and Todo ID are required", { status: 400 });
    }

    const contentType = request.headers.get("content-type");
    
    const { action, text } =
        contentType === "application/x-www-form-urlencoded"
            ? (await parseFormData(request))
            : (await parseFromJson(await request.json()));

    if (!action) { return new Response("Action is required", { status: 400 }); }
    // if (!text) { return new Response("Text is required", {status: 404}) }

    try {
        if (action == "edit" && text) {
            editTodo(Number(boardId), text, Number(todoId))
        } else if (action == "toggle") {
            console.log("calling toggleTodo()")
            toggleTodo(Number(boardId), Number(todoId));
        }

    } catch (error) {
        console.error("Error processing request:", error);
        return new Response("Error processing request", { status: 500 });
    }

    try {
        if (contentType === "application/x-www-form-urlencoded") {
        console.log("REDIRECTING")
        return redirect(`/?filter=${filter}`); // Redirige a la página de backend
    }
        if (contentType === "application/json") {
            console.log("JSON");
            return new Response(JSON.stringify({
                success: true,
                message: "Todo updated successfully"
            }), { 
                status: 200,
                headers: { "Content-Type": "application/json" } 
            }); // Devuelve el array de tareas en formato JSON
        }
    } catch (error) {
        console.error("Error parsing request:", error);
        return new Response("Error parsing request", { status: 500 });
    }

    return redirect("/")
}