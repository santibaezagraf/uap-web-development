import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Mensaje } from "../types";
import { BASE_URL } from "../hooks/useMensajes";
import { Link, Outlet } from "@tanstack/react-router";

type MensajeItemProps = {
  search: string;
  mensaje: Mensaje;
};

export function MensajeItem({
  search,
  mensaje: { id, content, likes },
}: MensajeItemProps) {
  const queryClient = useQueryClient();
  const queryKey = ["mensajes", search];

  const { mutate: increaseLike } = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`${BASE_URL}/mensajes/${id}`, {
        method: "POST",
        body: JSON.stringify({ action: "like" }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data: { mensaje: Mensaje } = await response.json();
      return data.mensaje;
    },
    onMutate: (id) => {
      queryClient.setQueryData(queryKey, (old: Mensaje[]) => {
        return old.map((mensaje) =>
          mensaje.id === id ? { ...mensaje, likes: mensaje.likes + 1 } : mensaje
        );
      });
    },
    onError: (_, id) => {
      queryClient.setQueryData(queryKey, (old: Mensaje[]) => {
        return old.map((mensaje) =>
          mensaje.id === id ? { ...mensaje, likes: mensaje.likes - 1 } : mensaje
        );
      });
    },
  });

  const { mutate: removeItem } = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`${BASE_URL}/mensajes/${id}`, {
        method: "POST",
        body: JSON.stringify({ action: "delete" }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data: { mensaje: Mensaje } = await response.json();
      return data.mensaje;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(queryKey, (old: Mensaje[]) =>
        old.filter((mensaje) => mensaje.id !== data.id)
      );
    },
  });

  return (
    <li
      data-id={id}
      className="w-full flex justify-between border border-gray-300 rounded-md p-2"
    >
      <p data-content="content" className="flex-1 text-left text-xl">
        {content}
      </p>
      {/* <Outlet /> */}
      <Link
          to={"/messages/$messageId"} params={{ messageId: id }}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md p-2 cursor-pointer">
            Details
        </ Link>

      <button
        className="bg-blue-500 hover:bg-blue-600 text-white rounded-md p-2 cursor-pointer"
        name="action"
        value="like"
        type="submit"
        onClick={() => increaseLike(id)}
      >
        {likes} Like{likes !== 1 ? "s" : ""}
      </button>
      <button
        className="bg-red-500 hover:bg-red-600 text-white rounded-md p-2 cursor-pointer"
        name="action"
        value="delete"
        type="submit"
        onClick={() => removeItem(id)}
      >
        Eliminar
      </button>
    </li>
  );
}
