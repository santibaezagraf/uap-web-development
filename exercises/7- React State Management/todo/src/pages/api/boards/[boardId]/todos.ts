import type { APIRoute } from "astro"; 
import { addTodo, clearCompletedTodos, getPaginatedTodos, getFilteredTodos, addBoard } from '../../../../services/todos'; // Importa las funciones de servicio para manejar las tareas

export let filter = "all";

const parseFormData = async (request: Request) => {
    const formData = await request.formData();
    const action = formData.get("action")?.toString();
    const text = formData.get("text")?.toString();
    const filter = formData.get("filter")?.toString();
    return { action, text, filter };	
};

const parseJson = async (
  request: Request
  ): Promise<{ action: string | undefined; text: string | undefined; filter: string | undefined }> => {
    return await request.json();
  };

export const GET: APIRoute = async ({ request, redirect, params }) => {
  console.log("GET TODOS")
  const contentType = request.headers.get("content-type");
  const url = new URL(request.url);

  const boardId = params.boardId ? parseInt(params.boardId, 10) : undefined;
  const filter = url.searchParams.get('filter')?.toString() || "all";
  const page = parseInt(url.searchParams.get('page') || '1', 10);
  const limit = parseInt(url.searchParams.get('limit') || '5', 10);
  // console.log("boardId: ", typeof boardId)
  console.log("GET: APIRoute filter: ", filter)
  // console.log("page: ", page)
  // console.log("limit: ", limit)

  if (!boardId) {
    return new Response("Board ID is required", { status: 400 });
  }

  try {

    const validPage = page > 0 ? page : 1;
    const validLimit = limit > 0 && limit <= 100 ? limit : 10;

    const paginatedTodos = getPaginatedTodos(boardId, filter, validPage, validLimit); // Se obtienen las tareas filtradas según el estado actual del filtro

    if (contentType === "application/json") {
      console.log("DEVOLVIENDO JSON")
      return new Response(JSON.stringify(paginatedTodos), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    } else {
      console.log("FETCHING JSON");
      return redirect(`/?filter=${filter}&page=${validPage}&limit=${validLimit}`); // Redirige a la página de backend
    }
  } catch (error) {
    console.error("Error parsing request:", error); // Manejo de errores
    return new Response("Error parsing request", { status: 500 });
  }
}


export const POST: APIRoute = async ({ request, redirect, params }) => {
  const contentType = request.headers.get("content-type");
  const boardId = parseInt(params.boardId as string || "1", 10);
  console.log("boardId:", boardId)


  try {
    const data = contentType === "application/json" ? await request.json() : await request.formData();
    const action = data.action as string | undefined;
    const text = data.text as string | undefined;
    // const boardId = parseInt(data.boardId as string || "1", 10); // Se obtiene el ID del tablero

    console.log("action:", action)
    console.log("text:", text)

    if (!action || !boardId) {
      return new Response("Action and Board ID are required", { status: 400 });
    }

    if (action === "addBoard" && text) {
      addBoard(text); // Añade un nuevo tablero
    } 
    else if (action === "addTodo" && text) 
    {
      try {
        // Añade una nueva tarea al array de tareas del tablero especificado
        await addTodo(boardId, text); 
      } catch (err) {
        console.error("Error adding todo:", err)
        return new Response(JSON.stringify({ error: err instanceof Error ? err.message : "Failed to add todo" }), { 
            status: 404, // O el código que sea apropiado
            headers: { "Content-Type": "application/json" }
        });
      }
      
    } else if (action === "clearCompleted") {
      clearCompletedTodos(boardId); // Elimina las tareas completadas del array de tareas del tablero especificado
    }

    if (contentType === "application/x-www-form-urlencoded") {
        return redirect(`/boards/${boardId}?filter=${filter}`); // Redirige a la página de backend
    } else {
      return new Response(JSON.stringify(getFilteredTodos(boardId, filter)), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      }); // Devuelve el array de tareas en formato JSON
    }
  } catch (error) {
      console.error("Error parsing request:", error); // Manejo de errores
      return new Response("Error parsing request", { status: 500 });
  }

  return new Response("Invalid content type", { status: 400 }); // Manejo de errores
}

// export const POST: APIRoute = async ({ request, params, redirect }) => {
//   var contentType = request.headers.get("content-type");
//   console.log(contentType);

//   try {
    
//     const { action, text } = 
//     contentType === "application/x-www-form-urlencoded" ?
//         await parseFormData(request) :
//         await parseJson(request);  

//     console.log("action: ", action)
//     // console.log("text: ", text)
//     // console.log("id: ", id)

//     if (action === "add" && text) {
//       console.log("AÑADIR")
//       addTodo(text); // Añade una nueva tarea al array de tareas
//     } else if (action === "clearCompleted") {
//       console.log("BORRAR COMPLETADAS")
//       clearCompletedTodos(); // Elimina las tareas completadas del array de tareas
//     }

//   } catch (error) {
//     console.error("Error parsing request:", error); // Manejo de errores
//   }

//   if (contentType === "application/x-www-form-urlencoded") {
//     console.log("REDIRECTING")
//     return redirect(`/?filter=${filter}`); // Redirige a la página de backend
//   }
//   if (contentType === "application/json") {
//     console.log("JSON");
//     return new Response(JSON.stringify(getFilteredTodos(filter)), { 
//       status: 200,
//     headers: { "Content-Type": "application/json" } }); // Devuelve el array de tareas en formato JSON

//   }

//   return new Response("Invalid content type", { status: 400 }); // Manejo de errores
// };