import type { APIRoute } from "astro";
import { toggleTodo, deleteTodo, editTodo, getFilteredTodos } from "../../../services/todos"; 
import { filter } from "../todos"

type Action = "toggle" | "delete" | "edit";

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

export const POST: APIRoute = async ({ request, params, redirect }) => {
    const { id } = params;
    const contentType = request.headers.get("content-type");
    
    const { action } =
        contentType === "application/x-www-form-urlencoded"
            ? (await parseFormData(request))
            : (await parseFromJson(await request.json()));

    if (!action) {
        return new Response("Action is required", { status: 400 });
    }

    if (!id) {
        return new Response("Id is required", { status: 404 });
    }

    try {
        if (action === "toggle") {
            toggleTodo(Number(id));
        } else if (action === "delete") {
            deleteTodo(Number(id));
        }
    } catch (error) {
        console.error("Error processing request:", error);
        return new Response("Error processing request", { status: 500 });
    }

    if (contentType === "application/x-www-form-urlencoded") {
        console.log("REDIRECTING")
        return redirect(`/?filter=${filter}`); // Redirige a la página de backend
    }
    if (contentType === "application/json") {
        console.log("JSON");
        return new Response(JSON.stringify(getFilteredTodos(filter)), { 
            status: 200,
            headers: { "Content-Type": "application/json" } }); // Devuelve el array de tareas en formato JSON
    }

    return redirect("/")
};

export const PATCH: APIRoute = async ({ request, params, redirect }) => {
    const { id } = params;
    const contentType = request.headers.get("content-type");
    
    const { action, text } =
        contentType === "application/x-www-form-urlencoded"
            ? (await parseFormData(request))
            : (await parseFromJson(await request.json()));

    if (!action) { return new Response("Action is required", { status: 400 }); }
    if (!id) { return new Response("Id is required", { status: 404 }); }
    if (!text) { return new Response("Text is required", {status: 404}) }

    try {
        if (action == "edit") {
            editTodo(text, Number(id))
        }
    } catch (error) {
        console.error("Error processing request:", error);
        return new Response("Error processing request", { status: 500 });
    }

    if (contentType === "application/x-www-form-urlencoded") {
        console.log("REDIRECTING")
        return redirect(`/?filter=${filter}`); // Redirige a la página de backend
    }
    if (contentType === "application/json") {
        console.log("JSON");
        return new Response(JSON.stringify(getFilteredTodos(filter)), { 
            status: 200,
            headers: { "Content-Type": "application/json" } }); // Devuelve el array de tareas en formato JSON
    }

    return redirect("/")
}