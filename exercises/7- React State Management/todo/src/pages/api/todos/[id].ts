import type { APIRoute } from "astro";
import { toggleTodo, deleteTodo, editTodo, getFilteredTodos } from "../../../services/todos"; 
import { filter } from "../todos"

type Action = "toggle" | "delete" | "edit";

interface EditData {
  action?: Action;
  text?: string;
}

const parseFormData = async (request: Request) => {
  const formData = await request.formData();
  const action = formData.get("action")?.toString() as Action | undefined;
  const text = formData.get("text")?.toString();
  return { action, text };
};

const parseFromJson = async (data: EditData)  => {
    return data;
};

export const POST: APIRoute = async ({ request, params, redirect }) => {
    const { id } = params;
    const contentType = request.headers.get("content-type");
    
    const data =
        contentType === "application/x-www-form-urlencoded"
            ? (await parseFormData(request))
            : (await parseFromJson(await request.json()));

    if (!data.action) {
        return new Response("Action is required", { status: 400 });
    }

    if (!id) {
        return new Response("Id is required", { status: 404 });
    }

    try {
        if (data.action === "toggle") {
            toggleTodo(Number(id));
        } else if (data.action === "delete") {
            deleteTodo(Number(id));
        } else if (data.action === "edit" && data.text) {
            editTodo(Number(id), data.text);
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